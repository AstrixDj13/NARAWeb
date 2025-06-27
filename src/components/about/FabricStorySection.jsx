import React from "react";

const FabricStorySection = () => {
  return (
    <div className="flex lg:flex-col items-center justify-center py-12 lg:py-28 xl:py-40 bg-[#EEEBE6] dark:!bg-black font-antikor">
      <div className="max-w-screen-2xl w-full ">
        <section className="lg:grid md:grid-cols-9 ">
          {/* Text Section */}
          <div className="lg:col-span-6 dark:!text-white">
            <h2 className="hidden xl:block text-4xl font-medium tracking-tight leading-relaxed pr-56 pl-8 lg:pl-32">
              Our Fabrics Have Their Own Story To Tell
            </h2>
            <h2 className="xl:hidden text-3xl sm:text-5xl sm:leading-relaxed sm:px-8 font-medium leading-normal pl-6">
              Our Fabrics Have Their Own Story To Tell
            </h2>
            <p className="text-sm sm:text-lg pl-6 pr-2 pt-2 pb-4 lg:mt-4 lg:pb-0 sm:px-8 sm:py-4 font-normal lg:pl-8 xl:pl-32">
              At NARA, our fabrics are more than just material—they’re a
              tapestry of stories and traditions. We celebrate the versatility
              of cotton, showcasing it in an array of prints and styles that
              honor India’s rich textile heritage. From the intricate patterns
              of Ikat and Kalamkari to the timeless elegance of Khadi cotton,
              our clothes embrace these traditional techniques and weave them
              into modern silhouettes. Each piece is a tribute to the artistry
              and history of our fabrics, creating a wardrobe that’s as
              meaningful as it is stylish.
            </p>
            <div className="lg:relative lg:mt-10">
              <video
                src="/about/fabric/a4.mp4"
                autoPlay
                loop
                muted
                className="bloc col-span-4 lg:h-[400px] xl:h-[440px] lg:w-3/4 lg:left-[180px] xl:left-[300px] object-cover lg:absolute "
              />
              <img
                title="image"
                src="/about/fabric/a5.JPG"
                alt="Fabric story 3"
                className="hidden col-span-1 lg:block left-0 h-[320px] lg:pl-10 xl:pl-32 lg:h-[300px] lg:top-[450px] object-center object-cover"
              />
            </div>
          </div>
          <div className="col-span-3">
            <video
              src="/about/fabric/a3.mp4"
              autoPlay
              loop
              muted
              className="bloc lg:col-span-2 lg:row-span-7 lg:w-[400px] lg:h-[500px] h-1/2 object-cover p-4 lg:mb-10 xl:ml-14"
            />
            <img
              title="image"
              src="/about/fabric/a6.jpeg"
              alt="Fabric story 4"
              className="bloc lg:col-span-2 row-span-2 sm:h-[400px] lg:h-[260px] lg:w-[400px] lg:py-7 lg:px-10 xl:pl-40 sm:pl-40 pl-20 lg:object-bottom object-cover"
            />
          </div>
          <div className="lg:col-span-9 lg:grid lg:grid-cols-9 lg:mt-20 lg:pl-7 xl:pl-20 ">
            {/* <img title="image"
              src="/about/fabric/a2.webp"
              alt="Fabric story 6"
              className="bloc lg:col-span-3 w-full h-full xl:h-4/5 object-cover mr-10 p-3 lg:p-0 "
            />
            <img title="image"
              src="/about/fabric/a3.webp"
              alt="Fabric story 6"
              className="bloc row-col-2 lg:col-span-2 w-full object-cover xl:ml-16 lg:ml-8"
            />
            <img title="image"
              src="/about/fabric/a4.webp"
              alt="Fabric story 7"
              className="bloc lg:col-span-3 w-full h-full xl:h-4/5 p-3 xl:ml-32 lg:ml-20 object-cover"
            /> */}
          </div>
          <div className="lg:col-span-9 lg:grid lg:grid-cols-9 mt-2 lg:mt-0 gap-10 px-10 lg:px-10">
            <img
              title="image"
              src="/about/fabric/a7.jpg"
              alt="Fabric story 8"
              className="bloc lg:col-span-6 row-span-5 w-full h-full object-cover"
            />
            <img
              title="image"
              src="/about/fabric/a8.jpg"
              alt="Fabric story 9"
              className="bloc lg:col-span-3 w-full h-full object-cover mt-10 lg:mt-20 "
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default FabricStorySection;
