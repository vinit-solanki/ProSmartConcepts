import os
import time
import json
import requests
import pandas as pd
from io import BytesIO
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
from PIL import Image, ImageStat
import imagehash

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

# -------------------------
# CONFIG
# -------------------------
INPUT_FILE = "products.csv"         # change if needed
IMAGE_COLS = ["product_image1", "product_image2", "product_image3", "product_image4"]
OUTPUT_ROOT = "images_downloads"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/117 Safari/537.36"
}

MIN_WIDTH = 200  # minimum width to accept
MIN_HEIGHT = 200
MAX_IMAGES_PER_PRODUCT = 15
MIN_NON_WHITE_RATIO = 0.20  # at least 20% pixels non-white / non-background


# -------------------------
# SELENIUM SETUP
# -------------------------
chrome_opts = Options()
chrome_opts.add_argument("--headless=new")
chrome_opts.add_argument("--disable-gpu")
chrome_opts.add_argument("--no-sandbox")
chrome_opts.add_argument("--disable-dev-shm-usage")
chrome_opts.add_argument("--lang=en-US")

service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=chrome_opts)


# -------------------------
# HELPERS
# -------------------------
def clean_name(name):
    if not name or str(name).strip().lower() in ("nan", "", "none"):
        return "Unknown_Product"
    s = "".join(ch for ch in str(name) if ch.isalnum() or ch in (" ", "_", "-"))
    return s.strip().replace(" ", "_")


def is_direct_image_url(url):
    lower = url.lower().split("?")[0]
    return lower.endswith((".jpg", ".jpeg", ".png", ".webp"))


def download_image_bytes(url):
    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        if r.status_code == 200:
            return r.content
    except Exception:
        pass
    return None


def image_validity_filter(img: Image.Image) -> bool:
    w, h = img.size
    if w < MIN_WIDTH or h < MIN_HEIGHT:
        return False
    # check how much of image is not close to white/blank
    gray = img.convert("L")
    stat = ImageStat.Stat(gray)
    # compute ratio of bright pixels as rough proxy for blank background
    # If too many bright pixels (i.e. image mostly white), reject
    # Alternatively, you can use more sophisticated background detection
    bright = sum(1 for px in gray.getdata() if px > 245)
    total = w * h
    if (total - bright) / total < MIN_NON_WHITE_RATIO:
        return False
    return True


def save_image(content, path):
    try:
        img = Image.open(BytesIO(content)).convert("RGB")
        img.save(path, format="JPEG", quality=90)
        return True
    except Exception as e:
        return False


def compute_img_hash(content):
    try:
        img = Image.open(BytesIO(content)).convert("L").resize((256, 256))
        return str(imagehash.phash(img))
    except Exception:
        return None


# -------------------------
# AMAZON-SPECIFIC SCRAPING
# -------------------------
def extract_amazon_image_urls(page_source, base_url):
    soup = BeautifulSoup(page_source, "html.parser")
    urls = set()

    # Pattern 1: data-a-dynamic-image
    tag = soup.select_one("#imgTagWrapperId img")
    if tag:
        dynamic = tag.get("data-a-dynamic-image")
        if dynamic:
            try:
                data = json.loads(dynamic)
                for u in data.keys():
                    urls.add(u)
            except:
                pass
        src = tag.get("src")
        if src:
            urls.add(src)

    # Pattern 2: parse JSON blobs
    for script in soup.find_all("script"):
        txt = script.string
        if not txt: continue
        if "colorImages" in txt or "imageGalleryData" in txt:
            for u in set(v for v in txt.split('"') if v.lower().startswith("http") and v.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))):
                urls.add(u)

    # Pattern 3: thumbnail / alt images
    for img in soup.find_all("img"):
        for attr in ("data-old-hires", "data-src", "src"):
            u = img.get(attr)
            if u and isinstance(u, str):
                urls.add(u)

    normalized = []
    for u in urls:
        u0 = u.split("?")[0]
        if u0.startswith("//"):
            u0 = "https:" + u0
        if u0.startswith("/"):
            u0 = urljoin(base_url, u0)
        normalized.append(u0)
    return normalized


# -------------------------
# GENERIC PAGE IMAGE EXTRACTION
# -------------------------
def extract_best_image_from_page(url):
    try:
        driver.get(url)
        time.sleep(0.7)
        soup = BeautifulSoup(driver.page_source, "html.parser")

        # og:image
        og = soup.find("meta", property="og:image")
        if og and og.get("content"):
            return urljoin(url, og["content"])

        # fallback largest img by heuristic (width/height attributes)
        cand = []
        for img in soup.find_all("img"):
            src = img.get("src") or img.get("data-src") or ""
            if not src: continue
            src = src.strip()
            if src.startswith("//"):
                src = "https:" + src
            if src.startswith("/"):
                src = urljoin(url, src)
            try:
                w = int(img.get("width") or 0)
                h = int(img.get("height") or 0)
            except:
                w, h = 0, 0
            cand.append(((w * h), src))
        cand.sort(reverse=True)
        if cand:
            return cand[0][1]
    except Exception:
        return None
    return None


# -------------------------
# MAIN LOOP
# -------------------------
def process_product(row):
    name = clean_name(row.get("product_name"))
    if name == "Unknown_Product":
        name = clean_name(row.get("product_title"))

    product_dir = os.path.join(OUTPUT_ROOT, name)
    os.makedirs(product_dir, exist_ok=True)

    seen = set()
    count = 0

    for col in IMAGE_COLS:
        raw = row.get(col)
        if not raw or str(raw).strip().lower() in ("", "nan", "none"):
            continue
        raw = str(raw).strip()

        # AMAZON product → collect full set
        if "amazon." in urlparse(raw).netloc:
            print("Scraping Amazon images for:", raw)
            try:
                driver.get(raw)
                time.sleep(1.2)  # allow JS load
                page = driver.page_source
            except Exception as e:
                print("  Selenium load failed:", e)
                continue

            urls = extract_amazon_image_urls(page, raw)
            for u in urls:
                content = download_image_bytes(u)
                if not content:
                    continue
                try:
                    img = Image.open(BytesIO(content)).convert("RGB")
                except:
                    continue
                if not image_validity_filter(img):
                    continue
                h = compute_img_hash(content)
                if not h or h in seen:
                    continue
                seen.add(h)
                count += 1
                if count > MAX_IMAGES_PER_PRODUCT:
                    break
                save_image(content, os.path.join(product_dir, f"{name}_image{count}.jpg"))

            # after finishing amazon url, do not process further raw urls for this product
            continue

        # Non-Amazon: pick one best image
        print("Processing generic URL:", raw)
        candidate = raw if is_direct_image_url(raw) else extract_best_image_from_page(raw)
        if not candidate:
            print("  No candidate found, skipping.")
            continue
        content = download_image_bytes(candidate)
        if not content:
            continue
        try:
            img = Image.open(BytesIO(content)).convert("RGB")
        except:
            continue
        if not image_validity_filter(img):
            continue
        h = compute_img_hash(content)
        if not h or h in seen:
            continue
        seen.add(h)
        count += 1
        save_image(content, os.path.join(product_dir, f"{name}_image{count}.jpg"))

    if count == 0:
        print("  Warning: no valid images for:", name)
    else:
        print(f"  Saved {count} images for product: {name}")


def main():
    if not os.path.exists(INPUT_FILE):
        print("Input file missing:", INPUT_FILE)
        return
    df = pd.read_csv(INPUT_FILE) if INPUT_FILE.lower().endswith(".csv") else pd.read_excel(INPUT_FILE)
    os.makedirs(OUTPUT_ROOT, exist_ok=True)

    for idx, row in df.iterrows():
        try:
            process_product(row)
        except Exception as ex:
            print("!! Error processing row", idx, ex)

    driver.quit()
    print("All done.")
    

if __name__ == "__main__":
    main()
