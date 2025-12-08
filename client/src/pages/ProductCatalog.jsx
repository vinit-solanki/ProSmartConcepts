import React from "react";
import CategoryCard from "../components/CategoryCard";

// Import images
import Cat1 from "../assets/products_cat1.jpg";
import Cat2 from "../assets/products_cat2.png";
import Cat3 from "../assets/products_cat3.png";
import Cat4 from "../assets/products_cat4.png";
import Cat5 from "../assets/products_cat5.png";
import Cat6 from "../assets/products_cat6.png";

function ProductCatalog() {
    const categories = [
        { title: "Medical & Healthcare", image: Cat1 },
        { title: "Beauty, Personal Care & Wellness", image: Cat2 },
        { title: "Home, Kitchen & Lifestyle", image: Cat3 },
        { title: "Electronics & Gadgets", image: Cat4 },
        { title: "Automotive, Tools & Industrial", image: Cat5 },
        { title: "Kids, Education, Art & Gifts", image: Cat6 },
    ];

    return (
        <div className="w-full bg-[#d2e5ff] py-8 flex flex-col items-center">
            
            {/* Heading */}
            <h2 className="prosmart-heading text-3xl underline underline-offset-8 mb-10">
                Our Product Catalog
            </h2>

            {/* Grid Layout */}
            <div className="
                grid 
                grid-cols-1 
                sm:grid-cols-2 
                lg:grid-cols-3 
                gap-10 
                place-items-center
            ">
                {categories.map((cat, idx) => (
                    <CategoryCard key={idx} image={cat.image} title={cat.title} />
                ))}
            </div>

            {/* Button */}
            <button className="cursor-pointer mt-10 border border-black px-6 py-2 rounded-lg shadow-sm hover:bg-black/80 hover:text-white transition">
                View Products
            </button>
        </div>
    );
}

export default ProductCatalog;
