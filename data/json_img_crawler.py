import os
import time
import json
import requests
from io import BytesIO
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
from PIL import Image
import imagehash

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager


# ============ CONFIG ============

INPUT_JSON = "product_final.json"
OUTPUT_ROOT = "prosmart_images"

MAX_IMAGES_PER_PRODUCT = 25
MIN_WIDTH = 200
MIN_HEIGHT = 200
MIN_NON_WHITE_RATIO = 0.20

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/117 Safari/537.36"
    )
}


# ============ SELENIUM ============

chrome_opts = Options()
chrome_opts.add_argument("--headless=new")
chrome_opts.add_argument("--disable-gpu")
chrome_opts.add_argument("--no-sandbox")
chrome_opts.add_argument("--disable-dev-shm-usage")

service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=chrome_opts)


# ============ HELPERS ============

def clean(name: str):
    """Sanitize folder/file names."""
    if not name:
        return "Unknown"
    s = "".join(c for c in name if c.isalnum() or c in (" ", "_", "-"))
    return s.strip().replace(" ", "_")


def download_bytes(url):
    try:
        r = requests.get(url, headers=HEADERS, timeout=12)
        if r.status_code == 200:
            return r.content
    except:
        pass
    return None


def is_valid_image(img: Image.Image):
    """Basic quality checks."""
    w, h = img.size
    if w < MIN_WIDTH or h < MIN_HEIGHT:
        return False

    gray = img.convert("L")
    bright_pixels = sum(1 for px in gray.getdata() if px > 245)
    total = w * h

    if (total - bright_pixels) / total < MIN_NON_WHITE_RATIO:
        return False

    return True


def img_hash(content):
    try:
        img = Image.open(BytesIO(content)).convert("L").resize((256, 256))
        return str(imagehash.phash(img))
    except:
        return None


def save_image(content, path):
    try:
        img = Image.open(BytesIO(content)).convert("RGB")
        img.save(path, format="JPEG", quality=90)
    except:
        pass


# ============ AMAZON SCRAPING ============

def extract_amazon_images(page_source):
    soup = BeautifulSoup(page_source, "html.parser")
    urls = set()

    main = soup.select_one("#imgTagWrapperId img")
    if main:
        dyn = main.get("data-a-dynamic-image")
        if dyn:
            try:
                dyn_json = json.loads(dyn)
                urls.update(dyn_json.keys())
            except:
                pass
        if main.get("src"):
            urls.add(main["src"])

    for img in soup.find_all("img"):
        for attr in ("data-old-hires", "src", "data-src"):
            u = img.get(attr)
            if u and u.startswith("http"):
                urls.add(u)

    cleaned = []
    for u in urls:
        u = u.split("?")[0]
        if u.startswith("//"):
            u = "https:" + u
        cleaned.append(u)

    return cleaned


# ============ GENERIC PAGE IMAGE SCRAPER ============

def scrape_all_images_from_page(url):
    """Scrape ALL <img> URLs from any webpage."""
    print(f"  🌐 Scraping fallback page: {url}")

    try:
        driver.get(url)
        time.sleep(1.2)
    except:
        print("  ❌ Failed to load fallback page.")
        return []

    soup = BeautifulSoup(driver.page_source, "html.parser")

    urls = set()

    for img in soup.find_all("img"):
        src = img.get("src") or img.get("data-src") or img.get("data-lazy-src")
        if not src:
            continue

        # Fix relative URLs
        if src.startswith("//"):
            src = "https:" + src
        elif src.startswith("/"):
            src = urljoin(url, src)

        if src.startswith("http"):
            urls.add(src)

    cleaned = list(urls)
    print(f"  🌟 Found {len(cleaned)} fallback images")

    return cleaned


# ============ MAIN PRODUCT PROCESSOR ============

def process_product(prod, category_name, subcategory_name):
    pid = prod["product_id"]
    pname = clean(prod["product_name"])

    # FOLDER: category/subcategory/product_id/
    folder = os.path.join(
        OUTPUT_ROOT,
        clean(category_name),
        clean(subcategory_name),
        str(pid)
    )

    os.makedirs(folder, exist_ok=True)

    seen = set()
    count = 0

    print(f"\n▶ Processing: {pid} ({pname})")

    # ========== PRIMARY SOURCE LOOP ==========

    for url in prod.get("image_urls", []):
        if count >= MAX_IMAGES_PER_PRODUCT:
            break

        if "amazon." in url:
            print("  🛒 Amazon URL → scraping full gallery...")
            try:
                driver.get(url)
                time.sleep(1.5)
                imgs = extract_amazon_images(driver.page_source)
            except:
                imgs = []
        else:
            imgs = [url]  # direct non-Amazon image link

        for img_url in imgs:
            if count >= MAX_IMAGES_PER_PRODUCT:
                break

            if not img_url:
                continue

            content = download_bytes(img_url)
            if not content:
                continue

            try:
                img = Image.open(BytesIO(content))
            except:
                continue

            if not is_valid_image(img):
                continue

            h = img_hash(content)
            if not h or h in seen:
                continue

            seen.add(h)

            count += 1
            save_image(content, os.path.join(folder, f"{pid}_img{count}.jpg"))

    # ========== FALLBACK IF NO IMAGES FOUND ==========

    if count == 0:
        print("  ⚠ No images found → FALLBACK TO PAGE SCRAPING!")

        fallback_url = prod["image_urls"][0] if prod["image_urls"] else None
        if fallback_url:
            fallback_imgs = scrape_all_images_from_page(fallback_url)

            for img_url in fallback_imgs:
                if count >= MAX_IMAGES_PER_PRODUCT:
                    break

                content = download_bytes(img_url)
                if not content:
                    continue

                try:
                    img = Image.open(BytesIO(content))
                except:
                    continue

                if not is_valid_image(img):
                    continue

                h = img_hash(content)
                if not h or h in seen:
                    continue

                seen.add(h)
                count += 1
                save_image(content, os.path.join(folder, f"{pid}_img{count}.jpg"))

    print(f"  ✔ Saved {count} images")


# ============ MAIN ============

def main():
    with open(INPUT_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)

    for cat_name, cat_data in data["categories"].items():
        for sub_name, sub_data in cat_data["subcategories"].items():
            for prod in sub_data["products"]:
                process_product(prod, cat_name, sub_name)

    driver.quit()
    print("\n🎉 All images downloaded successfully!")


if __name__ == "__main__":
    main()
