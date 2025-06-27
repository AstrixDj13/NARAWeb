import React, { useState, useEffect } from "react";
const MidSection = () => {
  const testimonials = [
    {
      name: "Floyd Miles",
      text: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit...",
      rating: 4,
      image: "/home/person/img1.svg",
      bgColor: "bg-[#d8e3b136]",
      border: "border-[#D8E3B1]",
    },
    {
      name: "Floyd Miles",
      text: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit....",
      rating: 5,
      image: "/home/person/img2.svg",
      bgColor: "bg-[#b6b1d23d]",
      border: "border-[#B6B1D2]",
    },
    {
      name: "Floyd Miles",
      text: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit...",
      rating: 5,
      image: "/home/person/img1.svg",
      bgColor: "bg-[#d8e3b136]",
      border: "border-[#D8E3B1]",
    },
    {
      name: "Floyd Miles",
      text: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit...",
      rating: 5,
      image: "/home/person/img2.svg",
      bgColor: "bg-[#b6b1d23d]",
      border: "border-[#B6B1D2]",
    },
  ];
  return (
    <>
      <div className="hidden lg:flex flex-col bg-[#E9EAC6] dark:!bg-black lg:min-h-screen md:min-h-[50vh] relative justify-center items-center">
        <div className="absolute text-center top-28 md:top-32 font-mono bottom-20 md:bottom-28">
          <h1 className="text-3xl md:text-6xl font-semibold italic text-black mb-8 whitespace-break-spaces">
            <span className="block mb-3 dark:!text-white tracking-widest">
              YOU CAN FIND
            </span>
            <span className="block dark:!text-white tracking-widest">
              HIDDEN GEMS,
            </span>
          </h1>
          <p className="text-xl md:text-3xl font-normal text-black dark:!text-white">
            if you look around, with all
          </p>
          <p className="text-xl md:text-3xl font-normal text-black dark:!text-white text-left ">
            your heart.
          </p>
        </div>
        <div className="absolute bottom-0 top-[450px] left-0 right-0">
          <img
            title="image"
            src="/home/frame.svg"
            alt="Stars pattern"
            className="dark:hidden w-full h-auto"
          />
          <img
            title="image"
            src="/home/frame2.svg"
            alt="Stars pattern"
            className="hidden dark:block w-full h-auto"
          />
        </div>
      </div>
      <div className="relative">
        <div className="bg-white dark:!bg-black pb-24 md:py-24">
          <div className="max-w-8xl mx-auto text-left pl-8 md:pl-24">
            <h2 className="text-xl md:text-3xl dark:!text-white font-extrabold italic md:tracking-widest uppercase">
              Wind brought in the word
            </h2>
            <p className="mt-2 text-black dark:!text-white text-[14px] md:text-[18px] font-mono md:tracking-widest">
              This is what people have to say about us.
            </p>
            <button className="mt-6 bg-transparent border border-[#B5B5B5] text-[#1F4A40] dark:!text-[#D8E3B1] text-[14px] font-bold py-2 px-6">
              View all
            </button>
          </div>

          <div className="mt-12 overflow-x-scroll testimonial-container flex gap-4 max-w-full mx-3 md:mx-20">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`min-w-[300px] md:min-w-[400px] py-3 px-6 md:p-6 border-2 ${testimonial.bgColor} ${testimonial.border}`}
              >
                <div className="flex mb-4 justify-between">
                  <img
                    title="image"
                    src={testimonial.image}
                    alt={testimonial.name}
                    className=" w-12 h-12 rounded-full mr-4"
                  />
                  <div className="text-[#1F4A40] dark:!text-[#D8E3B1] text-3xl md:text-4xl font-bold space-x-2">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <span key={i}>*</span>
                    ))}
                  </div>
                </div>
                <h3 className="text-[16px] font-bold font-mono text-black dark:!text-[#D8E3B1] mb-7">
                  {testimonial.name}
                </h3>
                <p className="text-black dark:!text-white font-medium font-mono text-[10px] md:text-[14px]">
                  {testimonial.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MidSection;
