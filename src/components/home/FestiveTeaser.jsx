import React, { useRef, useState, useEffect } from "react";

const FestiveTeaser = () => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  // Auto-play when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && videoRef.current) {
          videoRef.current.play().catch(e => console.log(e));
        } else if (videoRef.current) {
          videoRef.current.pause();
        }
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  return (
    <section className="bg-white pt-20 pb-10 dark:!bg-black my-2">
      <div className="max-w-[2000px] mx-auto px-4 md:px-8">
        <div className="text-left md:text-center text-black dark:!text-white mb-6 md:mb-10">
          <h2 className="text-2xl md:text-4xl font-semibold italic tracking-widest uppercase font-slussen">
            Adaa: The Festive Edit
          </h2>
          <p className="mt-2 text-xs lg:text-sm leading-8 font-mono tracking-widest sm:text-lg">
            Celebrate the festivities with our exclusive new collection
          </p>
        </div>
        
        <div className="relative w-full aspect-[4/5] md:aspect-video rounded-3xl overflow-hidden shadow-2xl group">
          <video
            ref={videoRef}
            src="https://cdn.shopify.com/videos/c/o/v/3ad9ec19856544c6b58c665e24efecbc.mov"
            className="w-full h-full object-cover bg-black"
            playsInline
            loop
            muted={isMuted}
          />
          
          {/* Mute Toggle Button */}
          <button 
             onClick={(e) => { 
                e.preventDefault();
                setIsMuted(!isMuted); 
             }}
             className="absolute top-4 right-4 md:top-6 md:right-6 z-20 p-3 bg-black/60 text-white rounded-full hover:bg-black/80 transition backdrop-blur-sm"
          >
             {isMuted ? (
               <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
             ) : (
               <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" /></svg>
             )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default FestiveTeaser;
