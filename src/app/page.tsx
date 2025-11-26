"use client";

import { Wrapper } from "@/components/wrapper";
import Image from "next/image";
import { AiFillPicture } from "react-icons/ai";
import { IoIosPricetags, IoMdImages } from "react-icons/io";
import { PiBookOpenTextFill } from "react-icons/pi";
import { FaRegEye, FaRegFolderOpen, FaRegImages } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { HiCursorClick } from "react-icons/hi";
import { GiClick } from "react-icons/gi";
import { useArticles } from "@/hooks/useArticles";
import { useActivities } from "@/hooks/useActivities";
import { usePackages } from "@/hooks/usePackages";
import { useProjects } from "@/hooks/useProjects";
import { useCounters } from "@/hooks/useCounters";
import { useMedias } from "@/hooks/useMedias";
import Link from "next/link";

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
      title: "Articles",
      value: articles ? Number(articles.length) : 0,
      desc: "updated last 30 days",
      icon: <PiBookOpenTextFill />,
      stats: 8,
      isIncrease: true,
      loading: loadingArticles,
    },
    {
      title: "Activities",
      value: activities ? Number(activities.length) : 0,
      desc: "updated last 30 days",
      icon: <AiFillPicture />,
      stats: 4,
      isIncrease: true,
      loading: loadingActivities,
    },
    {
      title: "Packages",
      value: packages ? Number(packages.length) : 0,
      desc: "updated last 30 days",
      icon: <IoIosPricetags />,
      stats: 2,
      isIncrease: false,
      loading: loadingPackages,
    },
    {
      title: "Projects",
      value: totalProjects,
      desc: "updated last 30 days",
      icon: <FaRegFolderOpen />,
      stats: 2,
      isIncrease: false,
      loading: loadingProjects,
    },
  ];

  const { counters, loading: loadingCounters } = useCounters();

  // ARTICLE
  const articleCounters = counters
    ?.filter((c) => c.type === "ARTICLE")
    .sort((a, b) => b.count - a.count);
  // .slice(0, 6);

  // ACTIVITY
  const activityCounters = counters
    ?.filter((c) => c.type === "ACTIVITY" || c.type === "PROMO")
    .sort((a, b) => b.count - a.count);
  // .slice(0, 6);

  // MEDIA DISPLAY
  const { medias } = useMedias();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!medias || medias.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % medias.length);
    }, 5000); // 3 detik ganti
    return () => clearInterval(interval);
  }, [medias]);

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
                    <p className="text-neutral-400 text-xs">Data</p>
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
              <div className="text-xs bg-mainColor/60 text-white font-semibold py-1 px-3 rounded-secondary flex items-center gap-2 cursor-pointer hover:bg-mainColor transition-all">
                <span>
                  <FaRegEye />
                </span>
                {/* <span>last 3 month</span> */}
                <Link href={"/article"}>see page</Link>
              </div>
            </div>
            {/* LIST SCROLLABLE */}
            <div className="h-80 overflow-y-auto no-scrollbar bg-black/10 flex-1 rounded-third px-3 py-1 overflow-hidden">
              <ul className=" text-xs text-white h-full scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
                {loadingCounters || loadingArticles ? (
                  <li className="flex items-center justify-center h-full gap-2 text-white/60">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white/60"></div>
                    <span>Loading articles data...</span>
                  </li>
                ) : articleCounters && articleCounters.length > 0 ? (
                  articleCounters.map((item, index) => {
                    const article = articles?.find((a) => a.id === item.refId);
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
              <div className="text-xs bg-mainColor/60 text-white font-semibold py-1 px-3 rounded-secondary flex items-center gap-2 cursor-pointer hover:bg-mainColor transition-all">
                <span>
                  <FaRegEye />
                </span>
                {/* <span>last 3 month</span> */}
                <Link href={"/activity"}>see page</Link>
              </div>
            </div>
            {/* LIST SCROLLABLE */}
            <div className=" bg-black/10 flex-1 rounded-third px-3 py-1 overflow-hidden">
              <ul className="h-80 overflow-y-auto no-scrollbar text-xs text-white scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
                {loadingCounters || loadingActivities ? (
                  <li className="flex items-center justify-center h-full gap-2 text-white/60">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white/60"></div>
                    <span>Loading activities data...</span>
                  </li>
                ) : activityCounters && activityCounters.length > 0 ? (
                  activityCounters?.map((item, index) => {
                    const activity = activities.find(
                      (a) => a.id === item.refId
                    );
                    return (
                      <li
                        key={item.refId}
                        className="cursor-pointer hover:ps-3 py-3 border-b-1 border-white/20 transition-all duration-200 flex justify-between items-center"
                      >
                        <span>
                          {index + 1}.{" "}
                          {activity?.title &&
                            (activity.title.length > 30
                              ? activity.title.slice(0, 30) + "....."
                              : activity.title + ".....")}
                          ({item.count})
                        </span>
                        <span className="text-white/70">
                          {item.type?.toLowerCase()}
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

          {/* MEDIA GALLERY PREVIEW */}
          <div className="relative overflow-hidden col-span-3 bg-white/15 backdrop-blur-2xl rounded-main shadow-mainShadow border border-lightColor/15 dark:border-darkColor/20 flex items-center  h-45 w-full">
            {medias && medias.length > 0 && (
              <Image
                key={medias[index].url} // supaya animasi jalan
                src={medias[index].url}
                alt="media display"
                width={1000}
                height={1000}
                className="object-cover object-top w-full h-full rounded-main transition-all duration-700 ease-in-out"
              />
            )}
            <div className="absolute bottom-0 w-full h-[70%] bg-gradient-to-t from-black/90 to-transparent"></div>
            <div className="absolute bottom-0  px-3 pb-2 text-white">
              <Link
                href={"/media-library"}
                className="text-xs italic text-neutral-300 hover:text-neutral-400"
              >
                click here to see more..
              </Link>

              <div className="flex items-center gap-2 font-semibold">
                <span>
                  <IoMdImages />
                </span>
                <span>Media Gallery</span>
              </div>
            </div>
          </div>
        </section>
      </Wrapper>
    </>
  );
}

export default Home;
