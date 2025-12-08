import React from "react";

function CategoryCard({ image, title }) {
    return (
        <div
            className="
                bg-transparent 
                rounded-lg 
                overflow-hidden 
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
                    bg-[#7e9199] 
                    py-3 
                    text-center 
                    transition-all duration-300 
                    hover:bg-[#5a7078]
                "
            >
                <p className="text-white font-semibold tracking-wide">{title}</p>
            </div>
        </div>
    );
}

export default CategoryCard;
