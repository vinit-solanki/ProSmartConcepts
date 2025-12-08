import React from "react";
import InfiniteMovingCardsDemo from "../components/ui/infinite-moving-cards-demo";
import ReviewsBG from "../assets/reviews_bg.png"; // <-- add your bg here

function ReviewsPage() {
  return (
    <div
      className="w-full min-h-screen flex flex-col items-center pt-20 pb-32 overflow-hidden"
      style={{
        backgroundImage: `url(${ReviewsBG})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* Title */}
      <div
        className="
        prosmart-heading
          text-2xl text-white 
          bg-black/40 
          rounded-xl 
          border border-white/40  
          px-10 py-3 
          font-semibold shadow-lg 
          mb-12
        "
      >
        Reviews
      </div>

      {/* Infinite Cards */}
      <div className="w-full flex justify-center">
        <div className="max-w-7xl w-full">
          <InfiniteMovingCardsDemo />
        </div>
      </div>
    </div>
  );
}

export default ReviewsPage;
