import React, { useState, useEffect } from "react";
import ProSmartLogoLg from "../assets/prosmart_logo_lg.png";
import HeroVideo from "../assets/hero_section_video.mp4";

import MiLiTag from "../assets/militag_hero_section.png";
import MagnifierGlasses from "../assets/magnifier_glasses_hero_section.png";
import FabricUmbrella from "../assets/fabric_umbrella_hero_section.png";

import BoxIcon1 from "../assets/hero_box1.png";
import BoxIcon2 from "../assets/hero_box2.png";
import BoxIcon3 from "../assets/hero_box3.png";
import BoxIcon4 from "../assets/hero_box4.png";

import { FaSearch } from "react-icons/fa";
import CompanySection from "./CompanySection";
import ProductCatalog from "./ProductCatalog";
import WorkPage from "./WorkPage";
import ReviewsPage from "./ReviewsPage";
import ContactUs from "./ContactUs";

function LandingPage() {
    const products = [
        { title: "MiLi MiTag Duo Item Finder", image: MiLiTag, link: "#" },
        { title: "Fabric LED Umbrella", image: FabricUmbrella, link: "#" },
        { title: "Magnifier Glasses", image: MagnifierGlasses, link: "#" }
    ];

    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(true);
            setTimeout(() => {
                setIndex((prev) => (prev + 1) % products.length);
                setFade(false);
            }, 300);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleDotClick = (i) => {
        setFade(true);
        setTimeout(() => {
            setIndex(i);
            setFade(false);
        }, 300);
    };

    return (
        <div className="w-full max-w-full overflow-x-hidden bg-[#d2e5ff]">

            {/* HERO SECTION */}
            <section className="relative w-full min-h-screen overflow-hidden">

                {/* VIDEO */}
                <video
                    src={HeroVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />

                {/* NAV */}
                <nav
                    className="
        hidden md:flex
        absolute top-0 left-0 w-full h-auto 
        bg-black/50 backdrop-blur-sm 
        flex-row 
        items-center justify-between 
        px-12 py-3 z-20
    "
                >
                    <img src={ProSmartLogoLg} alt="logo" className="w-40" />

                    <div className="flex items-center gap-10">
                        <p className="text-white font-semibold text-lg cursor-pointer hover:text-white/20 transition duration-250">Products</p>
                        <p className="text-white font-semibold text-lg cursor-pointer hover:text-white/20 transition duration-250">About</p>
                        <p className="text-white font-semibold text-lg cursor-pointer hover:text-white/20 transition duration-250">Contact Us</p>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="text"
                            className="h-10 w-72 px-4 border border-gray-700 border-dashed rounded-l-md bg-white text-sm"
                        />
                        <button className="h-10 px-4 bg-[#ff5757] flex items-center justify-center rounded-r-md border border-gray-700 border-dashed border-l-0">
                            <FaSearch className="text-white text-base" />
                        </button>
                    </div>
                </nav>


                {/* HERO CONTENT */}
                <div className="
                    relative w-full h-full 
                    flex flex-col lg:flex-row 
                    items-center justify-between 
                    px-6 sm:px-12 lg:px-24 
                    pt-28 md:pt-20 lg:pt-28 
                    z-10
                ">

                    {/* LEFT CONTENT */}
                    <div className="w-full lg:w-1/2 text-white pr-0 lg:pr-6 text-center lg:text-left">
                        <h1 className="font-bold italic text-4xl sm:text-5xl lg:text-6xl leading-[50px] sm:leading-[60px] lg:leading-[70px] underline decoration-[#d2e5ff] decoration-4 underline-offset-8">
                            ProSmart Concepts
                        </h1>

                        <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 text-[#d2e5ff] italic font-semibold">
                            a dominant player in business gifting market in India. For the past 17 years, we have been renowned for introducing several cutting-ed
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-2 text-start gap-5 mt-6 sm:mt-8 max-w-xl mx-auto lg:mx-0 font-semibold">
                            {[BoxIcon1, BoxIcon2, BoxIcon3, BoxIcon4].map((icon, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-[#d2e5ff] bg-opacity-15 rounded-xl p-3">
                                    <div className="w-10 sm:w-12 h-10 sm:h-12 bg-[#ff5757] rounded-full flex justify-center items-center border-black border-dashed border">
                                        <img src={icon} />
                                    </div>
                                    <p className="text-black text-sm leading-snug">
                                        Lorem ipsum dolor <br /> sit amet, consectetur
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center lg:items-end p-6 lg:p-12 mt-10 lg:mt-0">
                        <div className="text-center bg-black/10 border border-white/20 border-dashed rounded-xl p-6">

                            <p className="text-white text-lg mb-4 font-semibold">
                                Our Flagship Items
                            </p>

                            <div className="w-full flex items-center justify-center h-60 sm:h-72">
                                <img
                                    src={products[index].image}
                                    alt={products[index].title}
                                    className={`w-48 sm:w-60 md:w-72 object-contain transition-all duration-500 ${fade ? "opacity-0 scale-95" : "opacity-100 scale-100"
                                        }`}
                                />
                            </div>

                            <p className="text-white mt-4 text-lg font-medium">
                                {products[index].title}
                            </p>

                            <div className="flex justify-center gap-2 mt-3">
                                {products.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleDotClick(i)}
                                        className={`w-3 h-3 rounded-full ${i === index ? "bg-white" : "bg-gray-400"}`}
                                    ></button>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <CompanySection />

            <ProductCatalog />

            <WorkPage />

            <ReviewsPage />

            <ContactUs/>
        </div>
    );
}

export default LandingPage;
