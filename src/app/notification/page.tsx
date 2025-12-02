"use client";

import { Button } from "@/components/ui/button";
import { Wrapper } from "@/components/wrapper";
import React, { useState } from "react";
import { IoNotifications } from "react-icons/io5";
import { LuSearchX } from "react-icons/lu";
import { MdMarkChatRead } from "react-icons/md";
import { GoDotFill } from "react-icons/go";

interface NotifCardProps {
  type: string;
  color: string;
  title: string;
  desc: string;
  date: string;
}



export default function NotificationPage() {
  const [isNotif, setIsNotif] = useState(true);

  const NotifCard: React.FC<NotifCardProps> = ({
    type,
    color,
    title,
    desc,
    date,
  }) => (
    <div className="flex items-center justify-between bg-white/5 border border-white/20 rounded-lg text-white p-3">
      <div className="space-y-3 max-w-3xl">
        <div
          className={`text-xs ${color} 
          )} w-fit pe-4 ps-2 py-1 rounded-full font-semibold flex items-center gap-2 capitalize`}
        >
          <GoDotFill />
          <span>{type}</span>
        </div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-white/80">{desc}</p>
      </div>
      <p className="text-white/30">{date}</p>
    </div>
  );

  return (
    <Wrapper className="flex flex-col">
      {isNotif ? (
        <>
          {/* HEADER */}
          <section className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="text-white text-xl font-semibold flex items-center gap-2">
                <IoNotifications />
                <h1>Pemberitahuan</h1>
              </div>

              <div className="bg-blue-200/50 text-blue-900 px-2 py-0.5 rounded-full text-xs flex items-center gap-2">
                <span className="bg-blue-800 h-1.5 w-1.5 rounded-full"></span>
                <p className="font-semibold">2 new</p>
              </div>
            </div>

            {/* Search + Mark all */}
            <div className="flex items-center gap-3">
              {/* search */}
              {/* <div className="flex items-center gap-2">
                <Button>
                  <IoSearch />
                </Button>

                <div className="relative">
                  <Input
                    className="w-50 pr-10"
                    placeholder="Cari Notifikasi..."
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer" />
                </div>
              </div> */}

              {/* mark all */}
              <Button variant="default" className="text-xs">
                <MdMarkChatRead />
                <span>Mark all as read</span>
              </Button>
            </div>
          </section>

          {/* LIST */}
          <section className="overflow-y-auto scrollbar-none bg-white/10 border border-white/20 rounded-xl h-fit p-4">
            <p className="font-medium text-white/90 mb-4">Today</p>

            <div className="space-y-3">
              <NotifCard
                type="updated features"
                color="bg-yellow-100 text-yellow-700"
                title="Settings - Change Background Feature"
                desc="now you can change your appreance cms background with your custom image!"
                date="November 27"
              />

              <NotifCard
                type="greetings"
                color="bg-green-100 text-green-700"
                title="Hello, welcome to Ganesha CMS👋!"
                desc="Hallo gaes!"
                date="September 10"
              />
            </div>
          </section>
        </>
      ) : (
        <>
          {/* HEADER */}
          <section className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="text-white text-xl font-semibold flex items-center gap-2">
                <IoNotifications />
                <h1>Pemberitahuan</h1>
              </div>

              <div className="bg-blue-200/50 text-blue-900 px-2 py-0.5 rounded-full text-xs flex items-center gap-2">
                <span className="bg-blue-800 h-1.5 w-1.5 rounded-full"></span>
                <p className="font-semibold">0 notification</p>
              </div>
            </div>
          </section>

          {/* EMPTY STATE */}
          <section className="bg-white/10 border border-white/20 rounded-xl h-fit flex flex-col items-center py-10">
            <LuSearchX className="text-white/80 text-9xl opacity-30" />
            <h2 className="text-3xl text-white/80 font-semibold mb-4">
              Its quiet for now
            </h2>
            <p className="text-lightColor/70 mb-8">
              Your notification will appear here once theres something new to
              review
            </p>
          </section>
        </>
      )}
    </Wrapper>
  );
}