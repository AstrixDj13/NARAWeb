import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function PageLoader({ onComplete }) {
  const letters = ["n", "a", "r", "a"];
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Background overlay fades out
  const bgVariants = {
    hidden: { opacity: 1 },
    visible: { opacity: 1 },
    exit: {
      opacity: 0,
      transition: { duration: 1.2, ease: "easeInOut", delay: 0.3 }
    }
  };

  // Container variants for staggered children and exit flying
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
    exit: {
      y: typeof window !== "undefined" ? -window.innerHeight / 2 + 40 : -300,
      x: isDesktop && typeof window !== "undefined" ? -window.innerWidth / 2 + 160 : 0,
      scale: 0.25,
      opacity: 0,
      transition: { duration: 1.5, ease: "easeInOut" }
    }
  };

  // The 'cloth' unfolding animation for each letter
  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      scaleY: 0.5,
      scaleX: 1.2,
      rotateX: 80,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scaleY: 1,
      scaleX: 1,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        mass: 0.8,
      },
    },
    exit: {
      rotateX: [0, 60, -60, 45, -45, 0],
      rotateY: [0, 40, -40, 20, -20, 0],
      rotateZ: [0, -15, 15, -10, 10, 0],
      transition: {
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] w-screen h-screen flex items-center justify-center bg-[#1F4A40] overflow-hidden"
      variants={bgVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onAnimationComplete={(definition) => {
        // Wait for the 'visible' animation to complete, add a longer delay for background loading, then trigger complete
        if (definition === "visible" && onComplete) {
          setTimeout(onComplete, 2000);
        }
      }}
    >
      {/* We use Antikor Mono to exactly match the logo's serif styling */}
      <motion.div
        className="flex space-x-1"
        style={{ fontFamily: "'Antikor Mono', monospace" }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            className="text-6xl md:text-8xl font-medium text-[#E8F0D6] tracking-tight"
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d"
            }}
          >
            {letter}
          </motion.span>
        ))}
        {/* The asterisk */}
        <motion.span
          variants={{
            hidden: { opacity: 0, scale: 0, rotate: -180 },
            visible: {
              opacity: 1,
              scale: 1,
              rotate: 0,
              transition: { delay: 0.8, type: "spring", stiffness: 200 }
            }
          }}
          className="text-4xl md:text-6xl font-medium text-[#AFA3D1] ml-2 -mt-4 md:-mt-6"
        >
          *
        </motion.span>
      </motion.div>
    </motion.div>
  );
}