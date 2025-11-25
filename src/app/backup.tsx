// "use client"

// import { Wrapper } from "@/components/wrapper";
// import Image from "next/image";
// import { AiFillPicture } from "react-icons/ai";
// import { IoIosPricetags } from "react-icons/io";
// import { PiBookOpenTextFill } from "react-icons/pi";
// import { FaRegFolderOpen, FaRegImages } from "react-icons/fa6";
// import { useState } from "react";

// const bgImage =
//   "https://i.pinimg.com/736x/52/60/48/52604891adadb505eb5592afe0e57497.jpg";

// const stats = [
//   {
//     title: "Articles Data",
//     value: 17,
//     desc: "updated last 30 days",
//     icon: <PiBookOpenTextFill />,
//   },
//   {
//     title: "Activities Data",
//     value: 14,
//     desc: "updated last 30 days",
//     icon: <AiFillPicture />,
//   },
//   {
//     title: "Packages Data",
//     value: 43,
//     desc: "updated last 30 days",
//     icon: <IoIosPricetags />,
//   },
//   {
//     title: "Projects Data",
//     value: 24,
//     desc: "updated last 30 days",
//     icon: <FaRegFolderOpen />,
//   },
//   // {
//   //   title: "Medias Data",
//   //   value: 32,
//   //   desc: "updated last 30 days",
//   //   icon: <FaRegImages />,
//   // },
// ];

// function Home() {
//   const [date, setDate] = useState<Date | null>(new Date());

//   return (
//     <>
//       <Wrapper
//         padding="p-1"
//         useBaseClases={false}
//         className="bg-transparent flex flex-col"
//         header={false}
//       >
//         <section className="grid grid-rows-4 grid-cols-10 gap-4">
//           {/* Left Cards */}
//           <div className="row-span-1 col-span-7 grid grid-cols-4 gap-3">
//             {stats.map((item, i) => (
//               <div
//                 key={i}
//                 className="bg-lightColor/15 dark:bg-darkColor/40 backdrop-blur-2xl rounded-main shadow-mainShadow border border-lightColor/15 dark:border-darkColor/20 p-3 grid grid-rows-2"
//               >
//                 <div className="grid grid-cols-2">
//                   <div className="flex flex-col gap-1">
//                     <p className="text-neutral-400 text-xs">{item.title}</p>
//                     <p className="text-white font-bold text-4xl">
//                       {item.value}
//                     </p>
//                   </div>

//                   <div className="flex justify-end">
//                     <div className="bg-gradient-to-tl from-darkColor/10 to-darkColor/50 text-white w-fit h-fit p-3 rounded-xl text-xl">
//                       {item.icon}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="text-xs text-neutral-300 flex items-end">
//                   <p>{item.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* right Calendar - adjust biar lebih tinggi dan ga dempet serta tgl nya ga dempet space nya */}
//           <div className="row-span-3 col-span-3 h-full">
//             <div className="text-white bg-darkColor/40 backdrop-blur-2xl rounded-main shadow-mainShadow border border-lightColor/15 dark:border-darkColor/20 p-4">
//               <Calendar
//                 onChange={(value) => {
//                   if (value instanceof Date) {
//                     setDate(value);
//                   }
//                 }}
//                 value={date}
//                 className="w-full text-sm rounded-lg overflow-hidden dark:text-white 
//              [&_.react-calendar__tile]:py-2 
//              [&_.react-calendar__tile--active]:bg-darkColor/40 
//              [&_.react-calendar__tile--active]:text-white 
//              [&_.react-calendar__navigation button]:text-white
//              [&_.react-calendar__navigation button]:font-semibold
//              [&_.react-calendar__month-view__weekdays]:text-neutral-300"
//               />
//             </div>
//           </div>
//         </section>
//       </Wrapper>
//     </>
//   );
// }

// export default Home;
