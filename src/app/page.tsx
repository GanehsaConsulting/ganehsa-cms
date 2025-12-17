"use client";

import { Wrapper } from "@/components/wrapper";
import Image from "next/image";
import { AiFillPicture } from "react-icons/ai";
import { IoIosPricetags, IoMdImages } from "react-icons/io";
import { PiBookOpenTextFill } from "react-icons/pi";
import { FaRegEye, FaRegFolderOpen } from "react-icons/fa6";
import { useEffect, useState, useMemo } from "react";
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
import { SelectComponent } from "@/components/ui/select";

type PeriodFilter =
  | "all"
  | "today"
  | "1week"
  | "1month"
  | "3month"
  | "6month"
  | "1year";

const PeriodFilterOptions: PeriodFilter[] = [
  "all",
  "today",
  "1week",
  "1month",
  "3month",
  "6month",
  "1year",
];

const periodSelectOptions = PeriodFilterOptions.map((p) => ({
  value: p,
  label:
    p === "1week"
      ? "1 Week"
      : p === "1month"
      ? "1 Month"
      : p === "3month"
      ? "3 Months"
      : p === "6month"
      ? "6 Months"
      : p === "1year"
      ? "1 Year"
      : p.charAt(0).toUpperCase() + p.slice(1),
}));

function Home() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // State untuk period filter masing-masing column
  const [articlePeriod, setArticlePeriod] = useState<PeriodFilter>("all");
  const [activityPeriod, setActivityPeriod] = useState<PeriodFilter>("all");

  /* ================= DATA ================= */
  const { articles, isLoading: loadingArticles } = useArticles();
  const {
    activities,
    token: activityToken,
    fetchActivities,
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
  });

  const { projects: socmedProject, loading: loadingSocmed } = useProjects({
    serviceId: 7,
    initialLimit: 100,
  });

  // Gunakan period yang berbeda untuk masing-masing counter
  const { counters: articleCountersData, loading: loadingArticleCounters } =
    useCounters(articlePeriod);
  const { counters: activityCountersData, loading: loadingActivityCounters } =
    useCounters(activityPeriod);

  const { medias } = useMedias();

  /* ================= EFFECT ================= */
  useEffect(() => {
    if (activityToken && fetchActivities) {
      fetchActivities(activityToken, 1, 100, "", "All");
    }
    limitPackages(100);
  }, [activityToken, fetchActivities, limitPackages]);

  /* ================= MEMO ================= */
  const totalProjects = useMemo(
    () => webProject.length + socmedProject.length,
    [webProject.length, socmedProject.length]
  );

  const loadingProjects = loadingWeb || loadingSocmed;

  const stats = useMemo(
    () => [
      {
        title: "Articles",
        value: articles ? articles.length : 0,
        desc: "updated 5 minutes ago",
        icon: <PiBookOpenTextFill />,
        stats: 8,
        isIncrease: true,
        loading: loadingArticles,
      },
      {
        title: "Activities",
        value: activities ? activities.length : 0,
        desc: "updated 5 minutes ago",
        icon: <AiFillPicture />,
        stats: 4,
        isIncrease: true,
        loading: loadingActivities,
      },
      {
        title: "Packages",
        value: packages ? packages.length : 0,
        desc: "updated 5 minutes ago",
        icon: <IoIosPricetags />,
        stats: 2,
        isIncrease: false,
        loading: loadingPackages,
      },
      {
        title: "Projects",
        value: totalProjects,
        desc: "updated 5 minutes ago",
        icon: <FaRegFolderOpen />,
        stats: 2,
        isIncrease: false,
        loading: loadingProjects,
      },
    ],
    [
      articles,
      activities,
      packages,
      totalProjects,
      loadingArticles,
      loadingActivities,
      loadingPackages,
      loadingProjects,
    ]
  );

  // Filter dan sort artikel counters
  const filteredArticleCounters = useMemo(
    () =>
      articleCountersData
        ?.filter((c) => c.type === "ARTICLE")
        .sort((a, b) => b.count - a.count) || [],
    [articleCountersData]
  );

  // Filter dan sort activity counters
  const filteredActivityCounters = useMemo(
    () =>
      activityCountersData
        ?.filter((c) => c.type === "ACTIVITY" || c.type === "PROMO")
        .sort((a, b) => b.count - a.count) || [],
    [activityCountersData]
  );

  /* ================= MEDIA SLIDE ================= */
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!medias || medias.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % medias.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [medias]);

  // Check if activities data is ready
  const isActivitiesReady =
    !loadingActivities && activities && activities.length > 0;
  const isActivityCountersReady =
    !loadingActivityCounters && filteredActivityCounters.length > 0;

  /* ================= UI ================= */
  return (
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
            className=" p-3 bg-transparent text-white"
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
            <SelectComponent
              options={periodSelectOptions}
              value={articlePeriod}
              onChange={(v) => setArticlePeriod(v as PeriodFilter)}
              placeholder="Filter period"
              className="w-[80px]"
            />
          </div>
          <div className="h-80 overflow-y-auto no-scrollbar bg-black/10 flex-1 rounded-third px-3 py-1 overflow-hidden">
            <ul className=" text-xs text-white h-full scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
              {loadingArticleCounters || loadingArticles ? (
                <li className="flex items-center justify-center h-full gap-2 text-white/60">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white/60"></div>
                  <span>Loading articles data...</span>
                </li>
              ) : filteredArticleCounters.length > 0 ? (
                filteredArticleCounters.map((item, index) => {
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
            <SelectComponent
              options={periodSelectOptions}
              value={activityPeriod}
              onChange={(v) => setActivityPeriod(v as PeriodFilter)}
              placeholder="Filter period"
              className="w-[80px]"
            />
          </div>
          <div className=" bg-black/10 flex-1 rounded-third px-3 py-1 overflow-hidden">
            <ul className="h-80 overflow-y-auto no-scrollbar text-xs text-white scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
              {loadingActivityCounters || loadingActivities ? (
                <li className="flex items-center justify-center h-full gap-2 text-white/60">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white/60"></div>
                  <span>Loading activities data...</span>
                </li>
              ) : isActivityCountersReady && isActivitiesReady ? (
                filteredActivityCounters
                  .map((item, index) => {
                    const activity = activities.find(
                      (a) => a.id === item.refId
                    );
                    if (!activity || !activity.title) return null;

                    const displayTitle =
                      activity.title.length > 30
                        ? activity.title.slice(0, 30) + "....."
                        : activity.title;

                    return (
                      <li
                        key={`${item.refId}-${index}`}
                        className="cursor-pointer hover:ps-3 py-3 border-b-1 border-white/20 transition-all duration-200 flex justify-between items-center"
                      >
                        <span>
                          {index + 1}. {displayTitle} ({item.count})
                        </span>
                        <span className="text-white/70">
                          {item.type?.toLowerCase()}
                        </span>
                      </li>
                    );
                  })
                  .filter(Boolean)
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
              key={medias[index].url}
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
  );
}

export default Home;
