import React from "react";

const TopSection = () => {
  return (
    <div className="bg-gray-100 dark:!bg-black w-full font-antikor ">
      <div className="flex flex-col lg:items-center lg:justify-center pt-32 lg:pt-64">
        <div className="flex container px-4 pt-10 lg:py-10 justify-start">
          <h1 className="ml-2 lg:ml-5 xl:ml-40 2xl:ml-72 text-2xl sm:text-4xl lg:text-6xl font-medium text-gray-800 dark:!text-white">
            ABOUT
          </h1>
        </div>
        <div className="flex flex-col lg:flex-row pl-8 lg:pr-24">
          {/* logo light mode */}
          <div className="dark:hidden">
            <img
              title="image"
              src="about/logo.svg"
              className="hidden lg:block h-48 pl-8 "
            />
            <img
              title="image"
              src="about/logo.svg"
              className="lg:hidden pr-8 w-full"
              alt="logo"
            />
          </div>
          {/* Logo dark mode  */}
          <div className="hidden dark:block">
            <img
              title="image"
              src="/home/navbar/logo.svg"
              className="hidden lg:block h-48 pl-8 "
              alt="logo"
            />
            <img
              title="image"
              src="/home/navbar/logo.svg"
              className="lg:hidden pr-8 w-full"
              alt="logo"
            />
          </div>
          <p className="hidden lg:flex ml-7 text-lg tracking-tight text-black dark:!text-white font-semibold items-end ">
            NEW AGE <br /> REAL <br /> ATTIRE
          </p>
          <p className="lg:hidden mt-4 ml-0 sm:text-4xl text-lg tracking-tight text-black dark:!text-white font-medium">
            NEW AGE REAL ATTIRE
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center min-h-[60vh] py-20">
        <div className="max-w-screen-xl w-full  ">
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-12 lg:gap-y-20 dark:!text-white px-4  items-center ">
            <div className="w-full h-full sm:h-[50vh] xl:h-[90vh] md:ml-4 xl:ml-40">
              <img
                title="image"
                src="/about/fabric/about1.jpg"
                alt="Image 1"
                className="bloc w-full h-full object-cover object-center"
              />
            </div>
            <div className="md:ml-10 xl:pl-28">
              <p className="font-medium text-3xl md:text-4xl tracking-tight mb-4">
                Who We Are
              </p>
              <p className="mb-16 lg:mb-8  text-[16px] md:text-[18px] tracking-tight font-normal ">
                Welcome to NARA—where we’re reimagining Indian heritage for the
                modern world. Our designs fuse timeless fabrics with edgy
                styles, creating fashion that’s as daring as it is affordable.
                Dive in, stand out, and join us on a journey to revolutionize
                your wardrobe!
              </p>
            </div>
          </section>
          <div className=" w-full p-4 h-screen flex flex-col items-center justify-center">
            <div className="flex gap-2 mb-4">
              <svg
                width="46.5"
                height="48"
                viewBox="0 0 31 32"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-[#D7E3B1] stroke-[#D7E3B1] dark:fill-white dark:stroke-white"
              >
                <path
                  d="M20.2415 10.5262L22.0344 9.22223L22.0353 9.22162L24.9684 7.10326L24.9697 7.10231L27.1699 5.53076H27.3795L29.572 9.28942L29.572 9.28943L29.574 9.29274L30.4641 10.7763L30.4266 10.8514L21.398 15.0432L20.2607 15.5306L20.0713 15.6118V15.8179V16.144V16.3471L20.2569 16.4296L24.6565 18.3849L24.6598 18.3864L28.5654 20.1765L30.3041 21.0458L30.1982 21.5751L28.1053 25.117L28.1052 25.1169L28.1011 25.1242L27.4394 26.3154L26.5838 25.8264L23.9885 24.0422L23.9854 24.04L21.2163 22.0854L21.2164 22.0853L21.2095 22.0807L18.2742 20.1238L18.258 20.113L18.2406 20.1043L17.9145 19.9413L17.387 19.6775L17.465 20.2621L17.7901 22.7007L18.4406 30.3444V31.4863H12.4029L12.5416 29.5433L13.5195 20.2535L13.5834 19.6468L13.0537 19.9494L11.9122 20.6017L11.8968 20.6105L11.8824 20.6211L9.43919 22.4128L6.18272 24.6923L6.18055 24.6938L3.7255 26.3817L3.32457 26.1812L1.74081 23.3304L1.74096 23.3303L1.7356 23.3214L0.757179 21.6907L0.748885 21.6769L0.739212 21.664L0.3125 21.095V21.077L4.20262 19.3653L4.20266 19.3654L4.2094 19.3622L9.41946 16.92L10.2264 16.5972L10.286 16.5734L10.3314 16.528L10.8206 16.0388L11.147 15.7125L10.7227 15.5306L6.16172 13.5759L0.622274 10.9691L0.605559 10.9613L0.588033 10.9554L0.413236 10.8972L0.607712 10.411L2.87906 6.51722L2.88414 6.50852L2.88864 6.49951L3.27111 5.73458L3.79571 5.8395L6.83333 7.75799L9.59442 9.86941L9.59428 9.86959L9.60403 9.87648L12.3762 11.8333L12.3955 11.847L12.4167 11.8575L13.069 12.1837L13.9075 12.6029L13.4882 11.7644L13.3508 11.4895L12.3783 1.92692L12.2416 0.423635L12.9085 0.3125H18.3969L18.4353 0.389297L17.7913 9.40624L17.1466 11.8236L16.9425 12.5889L17.6142 12.1692L20.2233 10.5385L20.2326 10.5326L20.2415 10.5262Z"
                  strokeWidth="0.625"
                />
              </svg>
              <svg
                width="46.5"
                height="48"
                viewBox="0 0 31 32"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-black stroke-black -mt-6 dark:fill-[#D7E3B1] dark:stroke-[#D7E3B1]"
              >
                <path
                  d="M20.2415 10.5262L22.0344 9.22223L22.0353 9.22162L24.9684 7.10326L24.9697 7.10231L27.1699 5.53076H27.3795L29.572 9.28942L29.572 9.28943L29.574 9.29274L30.4641 10.7763L30.4266 10.8514L21.398 15.0432L20.2607 15.5306L20.0713 15.6118V15.8179V16.144V16.3471L20.2569 16.4296L24.6565 18.3849L24.6598 18.3864L28.5654 20.1765L30.3041 21.0458L30.1982 21.5751L28.1053 25.117L28.1052 25.1169L28.1011 25.1242L27.4394 26.3154L26.5838 25.8264L23.9885 24.0422L23.9854 24.04L21.2163 22.0854L21.2164 22.0853L21.2095 22.0807L18.2742 20.1238L18.258 20.113L18.2406 20.1043L17.9145 19.9413L17.387 19.6775L17.465 20.2621L17.7901 22.7007L18.4406 30.3444V31.4863H12.4029L12.5416 29.5433L13.5195 20.2535L13.5834 19.6468L13.0537 19.9494L11.9122 20.6017L11.8968 20.6105L11.8824 20.6211L9.43919 22.4128L6.18272 24.6923L6.18055 24.6938L3.7255 26.3817L3.32457 26.1812L1.74081 23.3304L1.74096 23.3303L1.7356 23.3214L0.757179 21.6907L0.748885 21.6769L0.739212 21.664L0.3125 21.095V21.077L4.20262 19.3653L4.20266 19.3654L4.2094 19.3622L9.41946 16.92L10.2264 16.5972L10.286 16.5734L10.3314 16.528L10.8206 16.0388L11.147 15.7125L10.7227 15.5306L6.16172 13.5759L0.622274 10.9691L0.605559 10.9613L0.588033 10.9554L0.413236 10.8972L0.607712 10.411L2.87906 6.51722L2.88414 6.50852L2.88864 6.49951L3.27111 5.73458L3.79571 5.8395L6.83333 7.75799L9.59442 9.86941L9.59428 9.86959L9.60403 9.87648L12.3762 11.8333L12.3955 11.847L12.4167 11.8575L13.069 12.1837L13.9075 12.6029L13.4882 11.7644L13.3508 11.4895L12.3783 1.92692L12.2416 0.423635L12.9085 0.3125H18.3969L18.4353 0.389297L17.7913 9.40624L17.1466 11.8236L16.9425 12.5889L17.6142 12.1692L20.2233 10.5385L20.2326 10.5326L20.2415 10.5262Z"
                  strokeWidth="0.625"
                />
              </svg>
              <svg
                width="46.5"
                height="48"
                viewBox="0 0 31 32"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-[#D7E3B1] stroke-[#D7E3B1] dark:fill-white dark:stroke-white"
              >
                <path
                  d="M20.2415 10.5262L22.0344 9.22223L22.0353 9.22162L24.9684 7.10326L24.9697 7.10231L27.1699 5.53076H27.3795L29.572 9.28942L29.572 9.28943L29.574 9.29274L30.4641 10.7763L30.4266 10.8514L21.398 15.0432L20.2607 15.5306L20.0713 15.6118V15.8179V16.144V16.3471L20.2569 16.4296L24.6565 18.3849L24.6598 18.3864L28.5654 20.1765L30.3041 21.0458L30.1982 21.5751L28.1053 25.117L28.1052 25.1169L28.1011 25.1242L27.4394 26.3154L26.5838 25.8264L23.9885 24.0422L23.9854 24.04L21.2163 22.0854L21.2164 22.0853L21.2095 22.0807L18.2742 20.1238L18.258 20.113L18.2406 20.1043L17.9145 19.9413L17.387 19.6775L17.465 20.2621L17.7901 22.7007L18.4406 30.3444V31.4863H12.4029L12.5416 29.5433L13.5195 20.2535L13.5834 19.6468L13.0537 19.9494L11.9122 20.6017L11.8968 20.6105L11.8824 20.6211L9.43919 22.4128L6.18272 24.6923L6.18055 24.6938L3.7255 26.3817L3.32457 26.1812L1.74081 23.3304L1.74096 23.3303L1.7356 23.3214L0.757179 21.6907L0.748885 21.6769L0.739212 21.664L0.3125 21.095V21.077L4.20262 19.3653L4.20266 19.3654L4.2094 19.3622L9.41946 16.92L10.2264 16.5972L10.286 16.5734L10.3314 16.528L10.8206 16.0388L11.147 15.7125L10.7227 15.5306L6.16172 13.5759L0.622274 10.9691L0.605559 10.9613L0.588033 10.9554L0.413236 10.8972L0.607712 10.411L2.87906 6.51722L2.88414 6.50852L2.88864 6.49951L3.27111 5.73458L3.79571 5.8395L6.83333 7.75799L9.59442 9.86941L9.59428 9.86959L9.60403 9.87648L12.3762 11.8333L12.3955 11.847L12.4167 11.8575L13.069 12.1837L13.9075 12.6029L13.4882 11.7644L13.3508 11.4895L12.3783 1.92692L12.2416 0.423635L12.9085 0.3125H18.3969L18.4353 0.389297L17.7913 9.40624L17.1466 11.8236L16.9425 12.5889L17.6142 12.1692L20.2233 10.5385L20.2326 10.5326L20.2415 10.5262Z"
                  strokeWidth="0.625"
                />
              </svg>
            </div>
            <p className="text-center dark:text-[#ffff]">
              At NARA, the asterisk in the logo symbolizes more than just a
              design element—it represents our commitment to going above and
              beyond in everything we do. Just like an asterisk invites you to
              explore more information, NARA is more than just a name; it’s a
              mark of distinction. Each piece of clothing carries that extra
              layer of character, highlighting our dedication to craftsmanship,
              quality, and the finer details. We’re here to offer more than just
              fashion—we’re about adding depth and meaning to every design.
            </p>
          </div>
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-12 lg:gap-y-20 dark:!text-white px-4  items-center ">
            <div className="hidden lg:block lg:pr-3 xl:pr-5">
              <p className="font-medium text-4xl mb-4 lg:mb-[18px] text-right tracking-tight">
                Our Secret Sauce
              </p>
              <p className="mb-8 font-normal text-[16px] lg:text-[18px] text-right pl-0 xl:pl-32 ">
                Local fabrics and a commitment to affordability that's so
                serious, it's almost like we're your budgeting experts! We're
                all about local love, using pure cotton and heritage fabrics
                from all over the country, that hugs you right. But that’s not
                all, we aim to present timeless pieces that you will never get
                bored of.
              </p>
            </div>
            <div className="w-full lg:pr-3 lg:h-[60vh] xl:h-[80vh] h-[80vh]">
              <img
                title="image"
                src="/about/fabric/a2.jpg"
                alt="Image 2"
                className="bloc w-full h-full object-cover object-center"
              />
            </div>

            <div className="lg:hidden pr-5">
              <p className="font-medium text-3xl mb-4 lg:mb-[18px] tracking-tight">
                Our Secret Sauce
              </p>
              <p className="mb-8 font-normal text-[16px] md:text-[18px] pl-0 lg:pl-14 tracking-tight ">
                Local fabrics and a commitment to affordability that's so
                serious, it's almost like we're your budgeting experts! We're
                all about local love, using pure cotton and heritage fabrics
                from all over the country, that hugs you right. But that’s not
                all, we aim to present timeless pieces that you will never get
                bored of.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
export default TopSection;
