import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel";
  import { ChevronLeft, ChevronRight } from 'lucide-react';
  import { FaStar } from "react-icons/fa";

const ClientsReview = () => {

    

    const userData = [
        {
          id: 1,
          avatarURL: "https://randomuser.me/api/portraits/men/1.jpg",
          name: "John Miller",
          desc: "Coordinated comprehensive dental treatment packages including implants and cosmetic procedures. Expert in arranging accommodation and local transportation for international patients.",
          stars: 5,
          place: "United States"
        },
        {
          id: 2,
          avatarURL: "https://randomuser.me/api/portraits/women/2.jpg",
          name: "Emma Thompson",
          desc: "Specialized in organizing orthopedic surgeries and rehabilitation programs. Successfully managed post-operative care and recovery arrangements for patients from multiple countries.",
          stars: 4,
          place: "United Kingdom"
        },
        {
          id: 3,
          avatarURL: "https://randomuser.me/api/portraits/men/3.jpg",
          name: "Raj Patel",
          desc: "Expert in cardiac treatment packages with top hospitals in India. Provides end-to-end service including visa assistance and interpreter services for international patients.",
          stars: 5,
          place: "India"
        },
        {
          id: 4,
          avatarURL: "https://randomuser.me/api/portraits/men/4.jpg",
          name: "Carlos Santos",
          desc: "Facilitates plastic surgery and cosmetic treatment programs. Ensures seamless coordination between hospitals, hotels, and travel arrangements for medical tourists.",
          stars: 4,
          place: "Brazil"
        },
        {
          id: 5,
          avatarURL: "https://randomuser.me/api/portraits/women/5.jpg",
          name: "Sophie Chen",
          desc: "Specializes in organizing advanced cancer treatment and stem cell therapy packages. Provides comprehensive support for long-term medical stay arrangements.",
          stars: 5,
          place: "Singapore"
        },
        {
          id: 6,
          avatarURL: "https://randomuser.me/api/portraits/men/6.jpg",
          name: "Marcus Anderson",
          desc: "Manages fertility treatment and IVF programs for international patients. Coordinates with top specialists and arranges extended stay accommodations for treatment cycles.",
          stars: 4,
          place: "Canada"
        },
        {
          id: 7,
          avatarURL: "https://randomuser.me/api/portraits/women/7.jpg",
          name: "Lisa Kim",
          desc: "Expert in organizing comprehensive health screening packages and preventive care programs. Provides personalized medical tourism plans with luxury recovery accommodations.",
          stars: 4,
          place: "South Korea"
        },
        {
          id: 8,
          avatarURL: "https://randomuser.me/api/portraits/men/8.jpg",
          name: "Ahmed Hassan",
          desc: "Specializes in weight loss surgery and bariatric treatment programs. Offers complete support from initial consultation to post-surgery recovery care.",
          stars: 5,
          place: "UAE"
        },
        {
          id: 9,
          avatarURL: "https://randomuser.me/api/portraits/women/9.jpg",
          name: "Isabella Ferrari",
          desc: "Coordinates organ transplant procedures and follow-up care arrangements. Manages medical documentation and legal requirements for international patients.",
          stars: 4,
          place: "Italy"
        },
        {
          id: 10,
          avatarURL: "https://randomuser.me/api/portraits/men/10.jpg",
          name: "David Wilson",
          desc: "Expert in arranging joint replacement surgeries and rehabilitation programs. Provides comprehensive medical tourism packages with luxury recovery facilities.",
          stars: 5,
          place: "Australia"
        }
      ];
      
      



  return (
     <div className="flex flex-col px-6 md:px-16 lg:pl-40 lg:pr-32 py-8 lg:py-16 max-md:items-center max-md:justify-center gap-10 lg:gap-24 bg-[#ECF1FF] mt-8">
      {/* Content Section */}
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-col">
          <h2 className="font-poppins font-bold max-sm:text-3xl max-md:text-4xl text-[54px] text-[#283841] max-lg:self-center">
            What <span className="text-[#3252DF]">Client </span>Say
          </h2>
          <p className="font-dmsans font-medium text-base text-[#283841] text-opacity-60 tracking-[0.96px] mt-1 max-lg:self-center max-md:mt-3">
            Hear From Them. Tempora Facere Doloribus Id Aut. Ea Maiore.
          </p>
        </div>
        {/* carousel buttons */}
        <div className=' flex flex-row'>
             {/* prev button */}
             <div></div>
             {/* next button */}
             <div></div>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="w-full relative">
      <Carousel
        opts={{
          align: "start",
          loop: true
        }}
        className="w-full"
      >
        <CarouselContent className="flex -ml-16">
          {userData.map((user) => (
            <CarouselItem key={user.id} className="pl-16 basis-full sm:basis-1/2 lg:basis-1/3">
              <div className="relative bg-white shadow-[3.55px_3.55px_30.21px_0px_rgba(0,0,0,0.16)] rounded-xl pt-14 pb-6 px-2 flex flex-col items-center text-center mt-10 gap-6 lg:gap-10 ">
                <div className="absolute -top-10 w-20 h-20 z-10">
                  <img
                    src={user.avatarURL}
                    alt={user.name}
                    className="w-full h-full rounded-full shadow-lg  border-white"
                  />
                </div>

                <p className="text-xs text-[#283841] font-medium font-dmsans line-clamp-3">{user.desc}</p>

                <div className="w-full flex justify-between items-center mt-4 max-lg:flex-col max-lg:gap-3">
                <div className="flex justify-start items-center gap-1 ">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <FaStar
                        key={index}
                        className={`text-xl ${index < user.stars ? "text-[#DABE29]" : "text-gray-300"}`}
                        />
                    ))}
                    </div>
                  <div className="text-right flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 font-dmsans !leading-none">{user.name}</h3>
                    <p className="text-xs font-normal text-[rgba(40,56,65,0.6)] self-start max-lg:self-center">{user.place}</p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious className=' bg-[#1E91B6] text-white'/>
        <CarouselNext className='bg-[#1E91B6] text-white' /> */}
      </Carousel>
    </div>
    </div>
  )
}

export default ClientsReview







// {/* <Carousel className="w-[90%] mt-16">
// <CarouselContent className=" flex">
//   {userData.map((item, idx) => (
//     <CarouselItem
//       key={idx}
//       className=" sm:basis-full md:basis-1/2 lg:basis-1/3"
//     >
//       <div className="flex flex-col bg-white shadow-md py-7 px-10 gap-y-4 rounded-2xl min-w-[249px] text-left">
//         {/* Quote Icon */}
//         {/* <h2 className="text-2xl text-gray-500 mb-3">
//           <Colon />
//         </h2> */}

//         {/* Feedback Description */}
//         <p className="text-gray-700 text-sm mb-4">{item.desc}</p>

//         {/* User Info */}
//         <div className="flex items-center">
//           <img
//             src={item.avatarURL}
//             alt={item.name}
//             className="rounded-full w-10 h-10 mr-3"
//           />
//           <div>
//             <h2 className="font-semibold">{item.name}</h2>
//             <p className="text-xs text-gray-500 max-md:self-start">
//               {item.role}
//             </p>
//           </div>
//         </div>
//       </div>
//     </CarouselItem>
//   ))}
// </CarouselContent>
{/* <CarouselPrevious className=' bg-[#1E91B6] text-white'/>
<CarouselNext className='bg-[#1E91B6] text-white' /> */}
// </Carousel> */}