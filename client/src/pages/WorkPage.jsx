import React from "react";
import WorkingImg from "../assets/how_do_we_do.png";

function WorkPage() {
  const steps = [
    {
      number: 1,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do"
    },
    {
      number: 2,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do"
    },
    {
      number: 3,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do"
    }
  ];

  return (
    <div
      className="
        w-full 
        min-h-full 
        bg-[#d2e5ff]
        relative 
        flex flex-col items-center
        pt-16 pb-20
      "
      style={{
        backgroundImage: `url(${WorkingImg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
      }}
    >

      {/* TITLE */}
      <div className="
        text-3xl
        text-white 
        bg-black/40 
        rounded-xl 
        border border-white/40 border-dashed 
        px-10 py-4 
        font-semibold tracking-wide
        shadow-lg backdrop-blur-sm 
        animate-fadeIn
        z-10
      ">
        How Do We Work?
      </div>

      {/* STEPS WRAPPER */}
      <div className="relative mt-20 flex gap-20 z-10">

        {/* CENTER DASHED LINE */}
        <div className="
          absolute top-[72px] left-0 right-0
          border-2 border-black border-dashed 
          opacity-70
          w-[100%]
        "></div>

        {steps.map((step, index) => (
          <div 
            key={index} 
            className="
              relative 
              w-64 h-[360px] 
              transition-all duration-300 
              hover:-translate-y-3 
              hover:shadow-2xl
              animate-slideUp
            "
            style={{ animationDelay: `${index * 0.2}s` }}
          >

            {/* CARD BOX */}
            <div className="
              w-full h-full 
              bg-[#5a5f67] 
              rounded-2xl 
              border border-black border-dashed
              px-6 
              pt-24 pb-6
              text-center 
              text-white 
              shadow-md
            ">
              <p className="text-md leading-relaxed opacity-90">{step.text}</p>
            </div>

            {/* NUMBER CIRCLE */}
            <div className="
              absolute -top-12 left-1/2 -translate-x-1/2
              w-24 h-24 
              bg-[#ff6a6a] 
              rounded-full 
              flex items-center justify-center
              text-white text-3xl font-bold
              shadow-lg 
              transition-all duration-300
              hover:scale-110
            ">
              {step.number}
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default WorkPage;
