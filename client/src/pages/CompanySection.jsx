import React from "react";

function CompanySection() {
    const companies = ["Company 1", "Company 2", "Company 3", "Company 4"];

    return (
        <div className="w-full bg-white p-6 flex flex-col items-center">
            <h2 className="prosmart-heading text-2xl underline underline-offset-4 mb-5">
                Our Partners
            </h2>

            {/* GRID FOR RESPONSIVE DESIGN */}
            <div className="
                grid 
                grid-cols-1 
                sm:grid-cols-2 gap-y-6
                md:grid-cols-2 gap-y-8
                lg:grid-cols-4 
                gap-18
                place-items-center
            ">
                {companies.map((company, index) => (
                    <div
                        key={index}
                        className="relative flex items-center bg-black/20 px-10 py-4 rounded-r-full"
                    >
                        {/* CIRCLE ABSOLUTE */}
                        <div
                            className="w-14 h-14 rounded-full absolute -left-7 top-1/2 -translate-y-1/2"
                            style={{ backgroundColor: "#30a4d9" }}
                        ></div>

                        {/* COMPANY NAME */}
                        <p className="text-black font-medium">{company}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CompanySection;
