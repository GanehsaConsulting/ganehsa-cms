"use client";

import { Wrapper } from "@/components/wrapper";
import Image from "next/image";
import { AiFillPicture } from "react-icons/ai";
import { IoIosPricetags } from "react-icons/io";
import { PiBookOpenTextFill } from "react-icons/pi";
import { FaRegFolderOpen, FaRegImages } from "react-icons/fa6";
import { useEffect, useState } from "react";
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
import { useArticles } from "@/hooks/useArticles";
import { useActivities } from "@/hooks/useActivities";
import { usePackages } from "@/hooks/usePackages";
import { useProjects } from "@/hooks/useProjects";
import { useCounters } from "@/hooks/useCounters";

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

function Home() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { articles, isLoading: loadingArticles } = useArticles();
  const {
    activities,
    setLimit: limitActivity,
    isLoading: loadingActivities,
  } = useActivities();
  const {
    packages,
    setLimit: limitPackages,
    isLoading: loadingPackages,
  } = usePackages();
  const { projects: webProject, loading: loadingWeb } = useProjects({
    serviceId: 3,
    initialLimit: 100,
  }); // web
  const { projects: socmedProject, loading: loadingSocmed } = useProjects({
    serviceId: 7,
    initialLimit: 100,
  }); // sosmed

  const totalProjects = webProject.length + socmedProject.length;
  const loadingProjects = loadingWeb || loadingSocmed;

  useEffect(() => {
    limitActivity(100);
    limitPackages(100);
  }, [activities, packages]);

  const stats = [
    {
      title: "Articles Data",
      value: articles ? Number(articles.length) : 0,
      desc: "updated last 30 days",
      icon: <PiBookOpenTextFill />,
      stats: 8,
      isIncrease: true,
      loading: loadingArticles,
    },
    {
      title: "Activities Data",
      value: activities ? Number(activities.length) : 0,
      desc: "updated last 30 days",
      icon: <AiFillPicture />,
      stats: 4,
      isIncrease: true,
      loading: loadingActivities,
    },
    {
      title: "Packages Data",
      value: packages ? Number(packages.length) : 0,
      desc: "updated last 30 days",
      icon: <IoIosPricetags />,
      stats: 2,
      isIncrease: false,
      loading: loadingPackages,
    },
    {
      title: "Projects Data",
      value: totalProjects,
      desc: "updated last 30 days",
      icon: <FaRegFolderOpen />,
      stats: 2,
      isIncrease: false,
      loading: loadingProjects,
    },
  ];

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
    ],
  };
  const options = {
    scales: {
      y: {
        title: {
          display: false,
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

  const { counters, loading: loadingCounters } = useCounters();

  // ARTICLE
  const articleCounters = counters
    ?.filter((c) => c.type === "ARTICLE")
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // ACTIVITY
  const activityCounters = counters
    ?.filter((c) => c.type === "ACTIVITY" || c.type === "PROMO")
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

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
                    {item.loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <p className="text-white text-sm">Loading...</p>
                      </div>
                    ) : (
                      <p className="text-white font-bold text-4xl">
                        {item.value}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-gradient-to-tl from-darkColor/10 to-darkColor/50 text-white w-fit h-fit p-3 rounded-xl text-xl">
                      {item.icon}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-neutral-300 flex flex-col justify-end">
                  <p
                    className={`italic ${
                      item.isIncrease === true
                        ? "text-green-500"
                        : "text-red-400"
                    }`}
                  >
                    {item.isIncrease === true ? "(+)" : "(-)"} {item.stats} data
                    from last month
                  </p>
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
                <span>last 3 month</span>
              </div>
            </div>
            {/* list scrollable - FIXED */}
            <div className="bg-black/10 flex-1 rounded-third px-3 py-1 overflow-hidden">
              <ul className="overflow-y-auto text-xs text-white h-full scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
                {loadingCounters || loadingArticles ? (
                  <li className="flex items-center justify-center h-full gap-2 text-white/60">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white/60"></div>
                    <span>Loading articles data...</span>
                  </li>
                ) : articleCounters && articleCounters.length > 0 ? (
                  articleCounters.map((item, index) => {
                    const article = articles.find((a) => a.id === item.refId);
                    return (
                      <li
                        key={item.refId}
                        className="cursor-pointer hover:ps-3 py-3 border-b-1 border-white/20 transition-all duration-200"
                      >
                        {index + 1}. {article?.title?.slice(0, 40) + "....."} (
                        {item.count})
                      </li>
                    );
                  })
                ) : (
                  <li className="flex items-center justify-center h-full text-white/60">
                    No clicked articles
                  </li>
                )}
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
                <span>last 3 month</span>
              </div>
            </div>
            {/* list scrollable - FIXED */}
            <div className="bg-black/10 flex-1 rounded-third px-3 py-1 overflow-hidden">
              <ul className="overflow-y-auto text-xs text-white h-full scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
                {loadingCounters || loadingActivities ? (
                  <li className="flex items-center justify-center h-full gap-2 text-white/60">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white/60"></div>
                    <span>Loading activities data...</span>
                  </li>
                ) : activityCounters && activityCounters.length > 0 ? (
                  activityCounters.map((item, index) => {
                    const activity = activities.find(
                      (a) => a.id === item.refId
                    );
                    return (
                      <li
                        key={item.refId}
                        className="cursor-pointer hover:ps-3 py-3 border-b-1 border-white/20 transition-all duration-200"
                      >
                        {index + 1}. {activity?.title?.slice(0, 35) + "....."} (
                        {item.count}) -{" "}
                        <span className="bg-black/20 dark:bg-white/10 py-1 px-2 rounded-full">
                          {item.type.toLowerCase()}
                        </span>
                      </li>
                    );
                  })
                ) : (
                  <li className="flex items-center justify-center h-full text-white/60">
                    No clicked activities
                  </li>
                )}
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
