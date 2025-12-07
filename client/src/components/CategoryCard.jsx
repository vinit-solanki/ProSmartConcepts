import React from "react";

function CategoryCard({ image, title }) {
    return (
        <div
            className="
                bg-transparent 
                rounded-lg 
                overflow-hidden 
                border border-black border-dashed
                cursor-pointer
                shadow-md
                transition-all duration-300 
                hover:shadow-xl 
                hover:-translate-y-2
            "
        >
            {/* IMAGE WRAPPER WITH ZOOM EFFECT */}
            <div className="overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="
                        w-72 
                        object-cover 
                        transition-transform duration-500 
                        hover:scale-110
                    "
                />
            </div>

            {/* TITLE WITH SLIDE-UP ANIMATION */}
            <div
                className="
                    bg-black/60 
                    py-3 
                    text-center 
                    transition-all duration-300 
                    hover:bg-black/80
                "
            >
                <p className="text-white font-semibold tracking-wide">{title}</p>
            </div>
        </div>
    );
}

export default CategoryCard;
