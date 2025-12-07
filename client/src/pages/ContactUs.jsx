"use client";

import React from "react";

function ContactUs() {
  return (
    <div className="w-full bg-[#d2e5ff] flex flex-col items-center py-12">

      {/* Title */}
      <h2 className="text-3xl font-semibold underline underline-offset-4 mb-12 text-[#123555]">
        Contact Us
      </h2>

      {/* Two Column Layout */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 px-6">

        {/* LEFT — FORM */}
        <div
          className="
            bg-black/10 
            backdrop-blur-md 
            p-8 
            rounded-sm
            border border-white/20 border-dashed 
            shadow-[0_6px_20px_rgba(0,0,0,0.25)]
            text-white
          "
        >
          <form className="flex flex-col gap-6">

  {/* Full Name */}
  <input
    type="text"
    placeholder="Full Name..."
    className="
      w-full p-3 rounded-md
      bg-white/10 text-white 
      placeholder-black
      border border-white/20 
      backdrop-blur-sm 
      shadow-inner shadow-black/20 
      focus:outline-none focus:ring-2 focus:ring-[#2b9ad1]
      transition-all
    "
    required
  />

  {/* Phone (Optional) */}
  <input
    type="text"
    placeholder="Phone No. (Optional)"
    className="
      w-full p-3 rounded-md
      bg-white/10 text-white 
      placeholder-black
      border border-white/20 
      backdrop-blur-sm 
      shadow-inner shadow-black/20
      focus:outline-none focus:ring-2 focus:ring-[#2b9ad1]
      transition-all
    "
  />

  {/* Email */}
  <input
    type="email"
    placeholder="Email..."
    className="
      w-full p-3 rounded-md
      bg-white/10 text-white 
      placeholder-black
      border border-white/20 
      backdrop-blur-sm 
      shadow-inner shadow-black/20
      focus:outline-none focus:ring-2 focus:ring-[#2b9ad1]
      transition-all
    "
    required
  />

  {/* Message */}
  <textarea
    placeholder="Message..."
    className="
      w-full p-3 h-32 rounded-md
      bg-white/10 text-white 
      placeholder-black
      border border-white/20 
      backdrop-blur-sm 
      resize-none
      shadow-inner shadow-black/30
      focus:outline-none focus:ring-2 focus:ring-[#2b9ad1]
      transition-all
    "
  ></textarea>

  {/* Submit Button */}
  <button
    type="submit"
    className="
      w-full 
      bg-[#2b9ad1]/80 
      text-white font-semibold 
      py-3 rounded-md 
      shadow-lg shadow-black/30
      border border-white/10
      hover:bg-[#2387b8] 
      active:scale-[0.98]
      transition-all
    "
  >
    SUBMIT
  </button>

</form>

        </div>

        {/* RIGHT — MAP + DETAILS */}
        <div className="flex flex-col gap-8">

          {/* MAP SECTION */}
          <div
  className="
    w-full 
    h-48 
    rounded-2xl 
    overflow-hidden
    border border-white/20 border-dashed 
    shadow-[0_4px_12px_rgba(0,0,0,0.25)]
  "
>
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3772.4318238131264!2d72.91259887495114!3d19.06549295207971!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c62de9ce923b%3A0xa246d1063f4042d!2sPROSMART%20CONCEPTS!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
    width="100%"
    height="100%"
    loading="lazy"
    allowFullScreen=""
    referrerPolicy="no-referrer-when-downgrade"
    className="rounded-2xl"
  ></iframe>
</div>


          {/* ADDRESS BOX */}
          <div
            className="
              bg-black/10 
              backdrop-blur-md 
              p-6 
              rounded-sm
              border border-white/20 border-dashed 
              shadow-[0_4px_12px_rgba(0,0,0,0.25)]
              text-sm leading-6 text-gray-200
            "
          >
            <p className="font-medium text-gray-800">
              Gala No 25/26, Vaibhav Industrial Estate, PROSMART CONCEPTS,
              opp. ADONIS RAHEJA ACROPOLIS, near Govandi Police Station Lane,
              Chembur, Mumbai, Maharashtra 400088
            </p>

            <div className="mt-4 space-y-1 text-gray-800">
              <p><span className="font-semibold text-gray-800">Phone:</span> +91 12345678901 — Name</p>
              <p><span className="font-semibold text-gray-800">Phone:</span> +91 12345678901 — Name</p>
            </div>

            <div className="mt-4 space-y-1 text-gray-800">
              <p>email@example.com</p>
              <p>email@example.com</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default ContactUs;
