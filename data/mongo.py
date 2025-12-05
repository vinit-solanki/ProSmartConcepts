#!/usr/bin/env python3
"""
Enhanced MongoDB Data Upload Script for ProSmart Products
Features:
- 4 collections: categories, subcategories, products, admins
- Product IDs arrays in categories and subcategories
- ID naming convention system for easy expansion
- Automatic ID generation for new products
"""

import json
import pymongo
from pymongo import MongoClient
import sys
from datetime import datetime
import hashlib
import re

# MongoDB Configuration
MONGO_URI = "mongodb+srv://prosmart:prosmart@cluster0.jokss9k.mongodb.net/?appName=Cluster0"
DATABASE_NAME = "prosmart_db"

# Input file (using Cloudinary URLs)
INPUT_JSON = "claudinary_product.json"

# ID NAMING CONVENTION SYSTEM
ID_CONVENTIONS = {
    "categories": {
        "prefix": "cat_",
        "format": "cat_{:03d}",  # cat_001, cat_002, etc.
        "description": "Category IDs: cat_001 to cat_999"
    },
    "subcategories": {
        "prefix": "subcat_",
        "format": "subcat_{:03d}",  # subcat_001, subcat_002, etc.
        "description": "Subcategory IDs: subcat_001 to subcat_999"
    },
    "products": {
        "prefix": "prod_",
        "format": "prod_{:04d}",  # prod_0001, prod_0002, etc.
        "description": "Product IDs: prod_0001 to prod_9999"
    },
    "admins": {
        "prefix": "admin_",
        "format": "admin_{:03d}",  # admin_001, admin_002, etc.
        "description": "Admin IDs: admin_001 to admin_999"
    }
}

def connect_to_mongodb():
    """Connect to MongoDB and return database instance"""
    try:
        client = MongoClient(MONGO_URI)
        # Test the connection
        client.admin.command('ping')
        print("✅ Successfully connected to MongoDB!")
        return client[DATABASE_NAME]
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        sys.exit(1)

def clear_collections(db):
    """Clear existing collections for fresh data"""
    collections = ['categories', 'subcategories', 'products', 'admins']
    for collection_name in collections:
        if collection_name in db.list_collection_names():
            db[collection_name].drop()
            print(f"🗑️  Cleared existing '{collection_name}' collection")

def load_json_data():
    """Load and parse the JSON data file"""
    try:
        with open(INPUT_JSON, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"📄 Successfully loaded data from {INPUT_JSON}")
        return data
    except FileNotFoundError:
        print(f"❌ File {INPUT_JSON} not found!")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON format: {e}")
        sys.exit(1)

def get_next_available_id(db, collection_name, prefix):
    """Get the next available ID for a collection"""
    collection = db[collection_name]
    
    # Find the highest existing ID
    pipeline = [
        {"$match": {"_id": {"$regex": f"^{prefix}"}}},
        {"$project": {"numeric_part": {"$toInt": {"$substr": ["$_id", len(prefix), -1]}}}},
        {"$sort": {"numeric_part": -1}},
        {"$limit": 1}
    ]
    
    result = list(collection.aggregate(pipeline))
    
    if result:
        next_num = result[0]["numeric_part"] + 1
    else:
        next_num = 1
    
    # Format according to convention
    if collection_name == "products":
        return f"{prefix}{next_num:04d}"
    else:
        return f"{prefix}{next_num:03d}"

def insert_categories(db, data):
    """Insert categories with product IDs arrays into the categories collection"""
    categories_collection = db['categories']
    categories_to_insert = []
    
    for category_name, category_data in data['categories'].items():
        # Collect all product IDs for this category
        product_ids = []
        subcategory_ids = []
        
        for subcategory_name, subcategory_data in category_data['subcategories'].items():
            subcategory_ids.append(subcategory_data['subcategory_id'])
            for product in subcategory_data['products']:
                product_ids.append(product['product_id'])
        
        category_doc = {
            "_id": category_data['category_id'],
            "category_name": category_data['category_name'],
            "product_ids": product_ids,  # Array of all product IDs in this category
            "subcategory_ids": subcategory_ids,  # Array of all subcategory IDs
            "product_count": len(product_ids),
            "subcategory_count": len(subcategory_ids),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        categories_to_insert.append(category_doc)
    
    if categories_to_insert:
        result = categories_collection.insert_many(categories_to_insert)
        print(f"📦 Inserted {len(result.inserted_ids)} categories with product arrays")
    
    return len(categories_to_insert)

def insert_subcategories(db, data):
    """Insert subcategories with product IDs arrays into the subcategories collection"""
    subcategories_collection = db['subcategories']
    subcategories_to_insert = []
    
    for category_name, category_data in data['categories'].items():
        category_id = category_data['category_id']
        
        for subcategory_name, subcategory_data in category_data['subcategories'].items():
            # Collect all product IDs for this subcategory
            product_ids = [product['product_id'] for product in subcategory_data['products']]
            
            subcategory_doc = {
                "_id": subcategory_data['subcategory_id'],
                "subcategory_name": subcategory_data['subcategory_name'],
                "category_id": category_id,
                "product_ids": product_ids,  # Array of all product IDs in this subcategory
                "product_count": len(product_ids),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            subcategories_to_insert.append(subcategory_doc)
    
    if subcategories_to_insert:
        result = subcategories_collection.insert_many(subcategories_to_insert)
        print(f"📦 Inserted {len(result.inserted_ids)} subcategories with product arrays")
    
    return len(subcategories_to_insert)

def insert_products(db, data):
    """Insert products into the products collection"""
    products_collection = db['products']
    products_to_insert = []
    
    for category_name, category_data in data['categories'].items():
        category_id = category_data['category_id']
        
        for subcategory_name, subcategory_data in category_data['subcategories'].items():
            subcategory_id = subcategory_data['subcategory_id']
            
            for product in subcategory_data['products']:
                product_doc = {
                    "_id": product['product_id'],
                    "product_id": product['product_id'],
                    "product_name": product['product_name'],
                    "product_title": product['product_title'],
                    "product_description": product['product_description'],
                    "image_urls": product['image_urls'],
                    "image_count": len(product['image_urls']),
                    "subcategory_id": subcategory_id,
                    "category_id": category_id,
                    "status": "active",  # For future inventory management
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
                products_to_insert.append(product_doc)
    
    if products_to_insert:
        result = products_collection.insert_many(products_to_insert)
        print(f"📦 Inserted {len(result.inserted_ids)} products")
    
    return len(products_to_insert)

def insert_admin_user(db):
    """Insert admin user into the admins collection"""
    admins_collection = db['admins']
    
    # Hash the password for security
    password_hash = hashlib.sha256("admin".encode()).hexdigest()
    
    admin_doc = {
        "_id": "admin_001",
        "username": "admin",
        "password": password_hash,  # Hashed password
        "plain_password": "admin",  # For reference (remove in production)
        "role": "admin",
        "permissions": ["read", "write", "delete", "manage_users", "manage_products"],
        "email": "online@prosmart.in",
        "created_at": datetime.utcnow(),
        "last_login": None,
        "is_active": True
    }
    
    try:
        result = admins_collection.insert_one(admin_doc)
        print(f"👤 Inserted admin user with ID: {result.inserted_id}")
        return 1
    except pymongo.errors.DuplicateKeyError:
        print("👤 Admin user already exists, skipping...")
        return 0

def create_indexes(db):
    """Create useful indexes for better query performance"""
    print("🔍 Creating indexes...")
    
    # Categories indexes
    db['categories'].create_index("category_name")
    db['categories'].create_index("product_ids")
    db['categories'].create_index("subcategory_ids")
    
    # Subcategories indexes
    db['subcategories'].create_index("category_id")
    db['subcategories'].create_index("subcategory_name")
    db['subcategories'].create_index("product_ids")
    
    # Products indexes
    db['products'].create_index("category_id")
    db['products'].create_index("subcategory_id")
    db['products'].create_index("product_name")
    db['products'].create_index("status")
    db['products'].create_index([("product_name", "text"), ("product_title", "text"), ("product_description", "text")])
    
    # Admin indexes
    db['admins'].create_index("username", unique=True)
    db['admins'].create_index("role")
    db['admins'].create_index("is_active")
    
    print("✅ Indexes created successfully!")

def create_id_convention_collection(db):
    """Create a collection to store ID naming conventions for reference"""
    conventions_collection = db['id_conventions']
    
    # Clear existing conventions
    conventions_collection.drop()
    
    convention_docs = []
    for collection_name, convention in ID_CONVENTIONS.items():
        doc = {
            "_id": collection_name,
            "collection_name": collection_name,
            "prefix": convention["prefix"],
            "format": convention["format"],
            "description": convention["description"],
            "example": convention["format"].format(1),
            "created_at": datetime.utcnow()
        }
        convention_docs.append(doc)
    
    if convention_docs:
        conventions_collection.insert_many(convention_docs)
        print("📋 Created ID naming conventions collection")

def add_new_product_helper(db, category_id, subcategory_id, product_name, product_title, product_description, image_urls):
    """Helper function to add a new product with auto-generated ID"""
    
    # Generate new product ID
    new_product_id = get_next_available_id(db, "products", "prod_")
    
    # Create product document
    product_doc = {
        "_id": new_product_id,
        "product_id": new_product_id,
        "product_name": product_name,
        "product_title": product_title,
        "product_description": product_description,
        "image_urls": image_urls,
        "image_count": len(image_urls),
        "subcategory_id": subcategory_id,
        "category_id": category_id,
        "status": "active",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Insert product
    db['products'].insert_one(product_doc)
    
    # Update category product_ids array
    db['categories'].update_one(
        {"_id": category_id},
        {
            "$push": {"product_ids": new_product_id},
            "$inc": {"product_count": 1},
            "$set": {"updated_at": datetime.utcnow()}
        }
    )
    
    # Update subcategory product_ids array
    db['subcategories'].update_one(
        {"_id": subcategory_id},
        {
            "$push": {"product_ids": new_product_id},
            "$inc": {"product_count": 1},
            "$set": {"updated_at": datetime.utcnow()}
        }
    )
    
    print(f"✅ Added new product: {new_product_id} - {product_name}")
    return new_product_id

def display_summary(db, categories_count, subcategories_count, products_count, admin_count):
    """Display upload summary and collection stats"""
    print("\n" + "="*70)
    print("📊 UPLOAD SUMMARY")
    print("="*70)
    print(f"Categories inserted:    {categories_count}")
    print(f"Subcategories inserted: {subcategories_count}")
    print(f"Products inserted:      {products_count}")
    print(f"Admin users inserted:   {admin_count}")
    print("\n📈 COLLECTION STATISTICS")
    print("-"*40)
    print(f"categories collection:    {db['categories'].count_documents({})}")
    print(f"subcategories collection: {db['subcategories'].count_documents({})}")
    print(f"products collection:      {db['products'].count_documents({})}")
    print(f"admins collection:        {db['admins'].count_documents({})}")
    print(f"id_conventions collection: {db['id_conventions'].count_documents({})}")
    print("="*70)

def display_id_conventions():
    """Display ID naming conventions"""
    print("\n🏷️  ID NAMING CONVENTIONS")
    print("-"*50)
    for collection_name, convention in ID_CONVENTIONS.items():
        print(f"{collection_name.upper()}:")
        print(f"  Format: {convention['format']}")
        print(f"  Example: {convention['format'].format(1)}")
        print(f"  Description: {convention['description']}")
        print()

def sample_queries(db):
    """Run some sample queries to verify data"""
    print("\n🔍 SAMPLE QUERIES & VERIFICATION")
    print("-"*50)
    
    # Sample category with product arrays
    sample_category = db['categories'].find_one()
    if sample_category:
        print(f"Sample category: {sample_category['category_name']}")
        print(f"  - Products in category: {sample_category['product_count']}")
        print(f"  - First 3 product IDs: {sample_category['product_ids'][:3]}")
    
    # Sample subcategory with product arrays
    sample_subcategory = db['subcategories'].find_one()
    if sample_subcategory:
        print(f"\nSample subcategory: {sample_subcategory['subcategory_name']}")
        print(f"  - Products in subcategory: {sample_subcategory['product_count']}")
        print(f"  - First 3 product IDs: {sample_subcategory['product_ids'][:3]}")
    
    # Sample product
    sample_product = db['products'].find_one()
    if sample_product:
        print(f"\nSample product: {sample_product['product_name']}")
        print(f"  - Product ID: {sample_product['product_id']}")
        print(f"  - Images: {sample_product['image_count']}")
        print(f"  - Category: {sample_product['category_id']}")
        print(f"  - Subcategory: {sample_product['subcategory_id']}")
    
    # Count products by category
    pipeline = [
        {"$group": {"_id": "$category_id", "count": {"$sum": 1}}},
        {"$lookup": {"from": "categories", "localField": "_id", "foreignField": "_id", "as": "category"}},
        {"$unwind": "$category"},
        {"$project": {"category_name": "$category.category_name", "product_count": "$count"}},
        {"$sort": {"product_count": -1}}
    ]
    
    print("\n📊 Products per category:")
    for result in db['products'].aggregate(pipeline):
        print(f"  - {result['category_name']}: {result['product_count']} products")

def main():
    """Main execution function"""
    print("🚀 Starting Enhanced MongoDB upload process...")
    print(f"📁 Input file: {INPUT_JSON}")
    print(f"🗄️  Database: {DATABASE_NAME}")
    print(f"🌐 MongoDB URI: {MONGO_URI[:50]}...")
    
    # Display ID conventions
    display_id_conventions()
    
    # Connect to MongoDB
    db = connect_to_mongodb()
    
    # Load JSON data
    data = load_json_data()
    
    # Clear existing collections (optional - comment out if you want to keep existing data)
    clear_collections(db)
    
    # Insert data into collections
    print("\n📤 Uploading data to MongoDB...")
    categories_count = insert_categories(db, data)
    subcategories_count = insert_subcategories(db, data)
    products_count = insert_products(db, data)
    admin_count = insert_admin_user(db)
    
    # Create ID conventions collection
    create_id_convention_collection(db)
    
    # Create indexes for better performance
    create_indexes(db)
    
    # Display summary
    display_summary(db, categories_count, subcategories_count, products_count, admin_count)
    
    # Run sample queries
    sample_queries(db)
    
    print("\n🎉 Enhanced upload completed successfully!")
    print("\n💡 TO ADD NEW PRODUCTS:")
    print("   Use the add_new_product_helper() function")
    print("   New IDs will be auto-generated following conventions")
    print("   Category and subcategory arrays will be auto-updated")

if __name__ == "__main__":
    main()
