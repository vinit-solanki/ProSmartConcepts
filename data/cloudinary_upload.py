import os
import json
import cloudinary
import cloudinary.uploader
from pathlib import Path

# =====================================================
#                CLOUDINARY CONFIGURATION
# =====================================================

cloudinary.config(
    cloud_name="dstmt1w5p",
    api_key="747859347794899",
    api_secret="O04mjGTySv_xuuXHWQ6hR6uuHcM",   # <------ PUT YOUR API SECRET
    secure=True
)

# =====================================================
#                BASIC SETTINGS
# =====================================================

ROOT_FOLDER = "prosmart_images"
VALID_EXT = {".jpg", ".jpeg", ".png", ".webp"}  # allowed formats

OUTPUT_JSON = "cloudinary_uploaded_urls.json"

uploaded_data = {}  # store results


# =====================================================
#     FUNCTION: Upload single file to Cloudinary
# =====================================================

def upload_single_file(local_path: str, cloud_path: str):
    """
    Upload a single image to Cloudinary keeping the folder structure.
    """
    try:
        result = cloudinary.uploader.upload(
            local_path,
            public_id=cloud_path.replace("\\", "/"),   # Windows fix
            overwrite=True,
            resource_type="image"
        )
        return result.get("secure_url")
    except Exception as e:
        print(f"❌ Error uploading {local_path}: {e}")
        return None


# =====================================================
#        FUNCTION: Traverse + Upload recursively
# =====================================================

def upload_folder(root_dir: str):
    """
    Walks through prosmart_images folder and uploads every image to Cloudinary
    preserving folder structure.
    """
    print(f"\n🚀 Starting upload from: {root_dir}\n")

    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            ext = os.path.splitext(filename)[1].lower()
            if ext not in VALID_EXT:
                continue  # skip non-image files

            local_path = os.path.join(dirpath, filename)

            # Generate Cloudinary folder structure:
            rel_path = os.path.relpath(local_path, root_dir)  # e.g.: Medical_Devices/Diagnostic_Tools/prod_0007/prod_0007_img1.jpg
            public_id = rel_path.rsplit(".", 1)[0]            # remove extension

            print(f"⬆ Uploading: {rel_path}")

            url = upload_single_file(local_path, public_id)

            if url:
                product_id = Path(rel_path).parts[-2]  # folder name is prod_xxxx
                
                if product_id not in uploaded_data:
                    uploaded_data[product_id] = []

                uploaded_data[product_id].append(url)

    print("\n🎉 Upload completed!")


# =====================================================
#            MAIN EXECUTION
# =====================================================

if __name__ == "__main__":
    upload_folder(ROOT_FOLDER)

    # Save output mapping
    with open(OUTPUT_JSON, "w") as f:
        json.dump(uploaded_data, f, indent=4)

    print(f"\n📁 All uploaded URLs saved to: {OUTPUT_JSON}\n")
