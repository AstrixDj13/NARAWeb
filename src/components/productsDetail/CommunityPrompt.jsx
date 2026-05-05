import React from 'react';
import { FaInstagram } from 'react-icons/fa';
import { HiOutlineArrowRight } from "react-icons/hi";

const CommunityPrompt = () => {
  return (
    <a 
      href="https://www.instagram.com/naratribe/?utm_source=ig_web_button_share_sheet" 
      target="_blank" 
      rel="noopener noreferrer"
      className="group relative block w-full rounded-2xl p-[1px] my-2 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#fd1d1d]/10"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative flex items-center justify-between bg-[#F7F7F7] dark:!bg-[#0a0a0a] rounded-[15px] p-4 md:p-5 h-full">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white flex-shrink-0">
            <FaInstagram className="text-2xl" />
          </div>
          
          <div className="flex flex-col gap-0.5">
            <h3 className="font-outfit font-bold text-[16px] md:text-lg text-black dark:!text-white leading-tight">
              Join the NARA Tribe
            </h3>
            <p className="text-xs md:text-sm text-gray-600 dark:!text-gray-300 font-antikor mt-1">
              Got your fit? Post a pic or reel and tag <span className="font-semibold text-black dark:!text-white">@naratribe</span> to be featured!
            </p>
          </div>
        </div>
        
        <div className="flex-shrink-0 ml-2 md:ml-4 text-black dark:!text-white opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 hidden sm:flex">
           <HiOutlineArrowRight className="text-2xl" />
        </div>
      </div>
    </a>
  );
};

export default CommunityPrompt;
