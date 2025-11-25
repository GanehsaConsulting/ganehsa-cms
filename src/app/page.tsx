"use client";

import { Wrapper } from "@/components/wrapper";
import Image from "next/image";
import { AiFillPicture } from "react-icons/ai";
import { IoIosPricetags } from "react-icons/io";
import { PiBookOpenTextFill } from "react-icons/pi";
import { FaRegFolderOpen, FaRegImages } from "react-icons/fa6";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { HiCursorClick } from "react-icons/hi";
import { GiClick } from "react-icons/gi";
import { LuCalendarDays } from "react-icons/lu";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const bgImage =
  "https://i.pinimg.com/736x/52/60/48/52604891adadb505eb5592afe0e57497.jpg";

const stats = [
  {
    title: "Articles Data",
    value: 17,
    desc: "updated last 30 days",
    icon: <PiBookOpenTextFill />,
    stats: 8,
    isIncrease: true,
  },
  {
    title: "Activities Data",
    value: 14,
    desc: "updated last 30 days",
    icon: <AiFillPicture />,
    stats: 4,
    isIncrease: true,
  },
  {
    title: "Packages Data",
    value: 43,
    desc: "updated last 30 days",
    icon: <IoIosPricetags />,
    stats: 2,
    isIncrease: false,
  },
  {
    title: "Projects Data",
    value: 24,
    desc: "updated last 30 days",
    icon: <FaRegFolderOpen />,
    stats: 2,
    isIncrease: false,
  },
];

function Home() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // 5 bulan terakhir
  const labels = ["July", "Aug", "sep", "oct", "dec"];
  const datasets = [45, 67, 43, 89, 60];
  const data = {
    labels: labels,
    datasets: [
      {
        // Title of Graph
        label: "Grafik Akses Data",
        data: datasets,
        backgroundColor: [
          "#C9CDCF",
          "#C9CDCF",
          "#C9CDCF",
          "#C9CDCF",
          "#441752",
        ],
        barPercentage: 1,
        borderRadius: {
          topLeft: 5,
          topRight: 5,
        },
      },
      // insert similar in dataset object for making multi bar chart
    ],
  };
  const options = {
    scales: {
      y: {
        title: {
          display: false,
          // text: "Y-axis Lable",
        },
        display: true,
        beginAtZero: true,
        max: 100,
      },
      x: {
        title: {
          display: false,
          text: "x-axis Lable",
        },
        display: true,
      },
    },
  };

  return (
    <>
      <Wrapper
        padding="p-1"
        useBaseClases={false}
        className="bg-transparent flex flex-col"
        header={false}
      >
        <section className="grid grid-rows-3 grid-cols-11 gap-4 w-full">
          {/* Left Cards */}
          <div className="col-span-8 grid grid-cols-4 gap-3">
            {stats.map((item, i) => (
              <div
                key={i}
                className="bg-lightColor/15 dark:bg-darkColor/40 backdrop-blur-2xl rounded-main shadow-mainShadow border border-lightColor/15 dark:border-darkColor/20 p-3 grid grid-rows-2"
              >
                <div className="grid grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <p className="text-neutral-400 text-xs">{item.title}</p>
                    <p className="text-white font-bold text-4xl">
                      {item.value}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-gradient-to-tl from-darkColor/10 to-darkColor/50 text-white w-fit h-fit p-3 rounded-xl text-xl">
                      {item.icon}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-neutral-300 flex flex-col justify-end">
                  <p className={`italic ${item.isIncrease === true ? "text-green-500" : "text-red-400" }`} >{item.isIncrease === true ? "(+)" : "(-)"} {item.stats} data from last month</p>
                  <p className="text-[10px] italic">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* right Calendar */}
          <div className="row-span-2 col-span-3 h-full w-full bg-lightColor/20 dark:bg-darkColor/40 backdrop-blur-2xl rounded-main shadow-mainShadow border border-lightColor/15 dark:border-darkColor/20 flex justify-center items-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className=" p-3 bg-transparent"
            />
          </div>

          {/* MOST CLICKED ARTICLE */}
          <div className="row-span-2 col-span-4 bg-lightColor/20 dark:bg-darkColor/40 backdrop-blur-2xl rounded-main shadow-mainShadow border border-lightColor/15 dark:border-darkColor/20 p-3 flex flex-col">
            <div className="flex justify-between items-center mb-2 mx-2">
              <div className="flex items-center gap-2 text-white/80 text-base">
                <span>
                  <HiCursorClick />
                </span>
                <span>Most Clicked Article</span>
              </div>
              <div className="text-xs bg-mainColor/60 text-white font-semibold py-1 px-3 rounded-secondary flex items-center gap-2">
                <span>
                  <LuCalendarDays />
                </span>
                <span>December</span>
              </div>
            </div>
            {/* list scrollable */}
            <div className="bg-black/10 h-full rounded-third px-3 py-1">
              <ul className="overflow-y-auto text-xs text-white">
                <li className="cursor-pointer hover:ps-3 py-3 border-b-1 border-white/20">
                  1. Panduan Mudah Mengurus Izin Usaha UMKM
                </li>
                <li className="cursor-pointer hover:ps-3 py-3 border-b-1 border-white/20">
                  2. Tips Mengurus Izin Usaha dengan Biaya Yang Murah
                </li>
                <li className="cursor-pointer hover:ps-3 py-3 border-b-1 border-white/20">
                  3. Perbedaan PT dan CV Lengkap!
                </li>
              </ul>
            </div>
          </div>

          {/* MOST CLICKED ACTIVITY */}
          <div className="row-span-2 col-span-4 bg-lightColor/20 dark:bg-darkColor/40 backdrop-blur-2xl rounded-main shadow-mainShadow border border-lightColor/15 dark:border-darkColor/20 p-3 flex flex-col">
            <div className="flex justify-between items-center mb-2 mx-1">
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <span>
                  <GiClick />
                </span>
                <span>Most Clicked Activity/Promo</span>
              </div>
              <div className="text-xs bg-mainColor/60 text-white font-semibold py-1 px-3 rounded-secondary flex items-center gap-2">
                <span>
                  <LuCalendarDays />
                </span>
                <span>December</span>
              </div>
            </div>
            {/* list scrollable */}
            <div className="bg-black/10 h-full rounded-third px-3 py-1">
              <ul className="overflow-y-auto text-xs text-white">
                <li className="cursor-pointer hover:ps-3 py-3 border-b-1 border-white/20">
                  1. Pendirian 44 CV Martabak Orins
                </li>
                <li className="cursor-pointer hover:ps-3 py-3 border-b-1 border-white/20">
                  2. Survei Virtual Office
                </li>
                <li className="cursor-pointer hover:ps-3 py-3 border-b-1 border-white/20">
                  3. Pendirian PT Gratis Virtual Office
                </li>
              </ul>
            </div>
          </div>

          <div className=" col-span-3 bg-white/90 backdrop-blur-2xl rounded-main shadow-mainShadow border border-lightColor/15 dark:border-darkColor/20 flex items-center justify-center h-full w-full p-3 drop-shadow-2xl">
            <div className="text-white w-full h-full rounded-xl flex justify-center items-center">
              <Bar data={data} options={options} />
            </div>
          </div>
        </section>
      </Wrapper>
    </>
  );
}

export default Home;
