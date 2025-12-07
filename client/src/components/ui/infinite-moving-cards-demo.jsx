"use client";

import React from "react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

export default function InfiniteMovingCardsDemo() {
  return (
    <div className="w-full rounded-md flex flex-col bg-transparent items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="normal"
        pauseOnHover={true}
      />
    </div>
  );
}

const testimonials = [
  {
    quote:
      "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness.",
    name: "Charles Dickens",
    title: "Author - A Tale of Two Cities",
    rating: 5,
    avatar: "" // optional avatar url
  },
  {
    quote:
      "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer...",
    name: "William Shakespeare",
    title: "Playwright - Hamlet",
    rating: 4
  },
  {
    quote: "All that we see or seem is but a dream within a dream.",
    name: "Edgar Allan Poe",
    title: "Poet",
    rating: 4
  },
  {
    quote:
      "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
    name: "Jane Austen",
    title: "Novelist - Pride & Prejudice",
    rating: 5
  },
  {
    quote:
      "Call me Ishmael. Some years ago — never mind how long precisely... I thought I would sail about a little and see the watery part of the world.",
    name: "Herman Melville",
    title: "Novelist - Moby Dick",
    rating: 3
  }
];
