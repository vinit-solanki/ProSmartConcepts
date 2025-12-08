"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * InfiniteMovingCards (Enhanced UI)
 * items: [{ quote, name, title, rating (0-5), avatar (optional url) }]
 */
export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}) => {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    addAnimation();
  }, []);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
      scrollerContent.forEach((item) => {
        const duplicated = item.cloneNode(true);
        scrollerRef.current.appendChild(duplicated);
      });

      applyDirection();
      applySpeed();
      setStart(true);
    }
  }

  function applyDirection() {
    containerRef.current?.style.setProperty(
      "--animation-direction",
      direction === "left" ? "normal" : "reverse"
    );
  }

  function applySpeed() {
    const duration =
      speed === "fast" ? "18s" : speed === "normal" ? "40s" : "80s";
    containerRef.current?.style.setProperty("--animation-duration", duration);
  }

  /* ⭐ Enhanced Stars (SVG) */
  const renderStars = (rating) => {
    return (
      <div className="flex gap-1 mt-3">
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = i <= rating;
          return (
            <svg
              key={i}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={filled ? "#FFD447" : "none"}
              stroke={filled ? "#FFD447" : "#B0B0B0"}
              strokeWidth="1.5"
              className="drop-shadow-sm"
            >
              <path d="M12 2l3 6 6 .8-4.5 4.3L18 20l-6-3.2L6 20l1.5-6.9L3 8.8l6-.8z" />
            </svg>
          );
        })}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative max-w-6xl w-full overflow-hidden px-6",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-6 py-8",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            key={idx}
            className="
              relative w-[360px] shrink-0
              rounded-2xl border  border-[#9bb3cc] 
              bg-white/20 backdrop-blur-md
              shadow-[0px_8px_25px_rgba(0,0,0,0.08)]
              overflow-hidden transition-all duration-300
              hover:-translate-y-2 hover:shadow-[0px_12px_30px_rgba(0,0,0,0.15)]
            "
          >
            <div className="p-6 h-full flex flex-col">

              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-[#e3f1ff] shadow-inner flex items-center justify-center">
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold text-[#2b6cb0]">
                      {item.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  )}
                </div>

                <div>
                  <div className="text-base font-semibold text-[#123555]">{item.name}</div>
                  <div className="text-xs font-medium text-[#52708a]">{item.title}</div>
                </div>
              </div>

              {/* Stars */}
              {renderStars(item.rating || 0)}

              {/* Quote */}
              <blockquote className="mt-4 text-sm text-[#243b55] leading-relaxed">
                {item.quote}
              </blockquote>
            </div>
          </li>
        ))}
      </ul>

      {/* Animation CSS */}
      <style>{`
        @keyframes iv-scroll {
          0% { transform: translateX(0px); }
          100% { transform: translateX(-50%); }
        }

        .animate-scroll {
          animation: iv-scroll var(--animation-duration) linear infinite;
          animation-direction: var(--animation-direction);
        }
      `}</style>
    </div>
  );
};
