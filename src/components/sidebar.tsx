"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { TbDotsVertical } from "react-icons/tb";
import { TbBrandSnowflake } from "react-icons/tb";
import { IoChevronForwardOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { navigationItems } from "@/app/system";
import { ThemeSwitch } from "./theme-switch";
import { useSidebar } from "@/app/contexts/sidebar-context";
import { toast } from "sonner";
import { getToken } from "@/lib/helpers";
import { useRouter } from "next/navigation";

interface UserLoggedIn {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export const Sidebar = () => {
  const { isExpanded, setIsExpanded } = useSidebar();
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>(
    {}
  );
  const path = usePathname();
  const noNavigation = ["/login", "/forgot-password", "/reset-password"];
  const [currentUser, setCurrentUser] = useState<UserLoggedIn>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const fetchUserLoggedIn = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/whoAmI`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Login gagal");
          setLoading(false);
          return;
        }

        if (data) {
          setCurrentUser(data.user);
        }
      } catch (err) {
        const errMessage = err instanceof Error ? err.message : "unknown error";
        console.error(errMessage);
        toast.error(errMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUserLoggedIn();
  }, []);

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("openSubmenus");
    toast.success("Berhasil logout");
    router.push("/login");
  };

  type NavigationSubItem = {
    path: string;
    name: string;
  };

  type NavigationItem = {
    path: string;
    label: string;
    icon: React.ReactNode;
    subs?: NavigationSubItem[];
  };

  const isMenuItemActive = (item: NavigationItem) => {
    if (!item.subs || item.subs.length === 0) {
      return path === item.path;
    } else {
      return item.subs.some((sub: NavigationSubItem) => path === sub.path);
    }
  };

  const isSubmenuItemActive = (subPath: string) => {
    return path === subPath;
  };

  const getValidMenuLabels = () => {
    const validLabels: string[] = [];
    Object.values(navigationItems).forEach((section) => {
      section.contents.forEach((item) => {
        if (item.subs && item.subs.length > 0) {
          validLabels.push(item.label);
        }
      });
    });
    return validLabels;
  };

  const cleanLocalStorage = useCallback(() => {
    const validLabels = getValidMenuLabels();
    const storedSubmenus = localStorage.getItem("openSubmenus");

    if (storedSubmenus) {
      const parsed = JSON.parse(storedSubmenus);
      const cleanedSubmenus: { [key: string]: boolean } = {};

      validLabels.forEach((label) => {
        cleanedSubmenus[label] = parsed[label] || false;
      });

      localStorage.setItem("openSubmenus", JSON.stringify(cleanedSubmenus));
      return cleanedSubmenus;
    }

    return {};
  }, []);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus((prev) => {
      const updatedState = { ...prev, [label]: !prev[label] };
      localStorage.setItem("openSubmenus", JSON.stringify(updatedState));
      return updatedState;
    });
  };

  useEffect(() => {
    const cleanedSubmenus = cleanLocalStorage();
    setOpenSubmenus(cleanedSubmenus);
  }, [cleanLocalStorage]);

  useEffect(() => {
    const cleanedSubmenus = cleanLocalStorage();
    setOpenSubmenus(cleanedSubmenus);
  }, [path, cleanLocalStorage]);

  return (
    <section
      className={`${isExpanded ? "w-64" : "w-[79px]"} ${
        noNavigation.includes(path) && "hidden"
      } sticky top-0 h-screen flex transition-all duration-300 z-40`}
    >
      <div className="relative w-full grow m-2 rounded-main bg-lightColor/15 dark:bg-darkColor/40 border border-lightColor/15 dark:border-darkColor/15 backdrop-blur-2xl flex flex-col overflow-hidden">
        {/* Header/Logo - Fixed */}
        <div className="flex-shrink-0 bg-black/20 dark:bg-white/20 duration-300 rounded-secondary py-2 px-2 m-2 mb-0">
          <div
            className={`${
              !isExpanded
                ? "opacity-100 flex items-center justify-center text-3xl"
                : "opacity-0 hidden"
            } relative duration-300 group`}
          >
            <TbBrandSnowflake className="group-hover:opacity-0 opacity-100 text-lightColor " />
            <div
              className="absolute inset-0 group-hover:opacity-100 opacity-0 text-lightColor cursor-pointer"
              onClick={toggleSidebar}
            >
              <IoChevronForwardOutline />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer">
              {isExpanded && (
                <div className="text-3xl text-lightColor">
                  <TbBrandSnowflake />
                </div>
              )}
              <div
                className={`${
                  !isExpanded && "hidden"
                } text-lightColor text-sm font-bold`}
              >
                CMS Ganesha
              </div>
            </div>
            {isExpanded && (
              <div
                onClick={toggleSidebar}
                className="text-lightColor w-8 h-8 flex items-center rotate-180 justify-center rounded-full hover:bg-mainColor/20 duration-300 cursor-pointer"
              >
                <IoChevronForwardOutline />
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Menu Area - Fixed height calculation */}
        <div
          className={`${isExpanded ? "overflow-y-auto" : "overflow-y-auto"} no-scrollbar
                    ${
                      isExpanded &&
                      Object.values(openSubmenus).filter(Boolean).length > 1
                        ? "bg-darkColor/10 dark:bg-lightColor/5 p-1"
                        : ""
                    }
                    flex-1 mx-2 my-2 py-2 rounded-secondary duration-300`}
        >
          {/* Navigation Sections */}
          {Object.entries(navigationItems).map(([key, section]) => (
            <div key={key} className="mb-4">
              <p
                className={`${
                  !isExpanded &&
                  "w-full h-[1px] bg-neutral-500/30 rounded-full mb-3"
                } text-neutral-200 text-[10px] uppercase tracking-wide font-semibold px-3 pb-1`}
              >
                <span className={`${!isExpanded && "hidden"}`}>
                  {section.label}
                </span>
              </p>

              <ul
                className={`${
                  isExpanded ? "" : "items-center justify-center"
                } flex flex-col gap-2`}
              >
                {section.contents.map((item, idx) => (
                  <li
                    key={idx}
                    className={`${
                      !isExpanded && item.subs?.length
                        ? "dropdown dropdown-hover dropdown-right"
                        : ""
                    } relative`}
                  >
                    <div className="flex flex-col">
                      {!item.subs?.length ? (
                        item.label === "Logout" ? (
                          <button
                            onClick={handleLogout}
                            className={`text-red-400 capitalize font-medium text-xs rounded-third hover:bg-mainColor/25 duration-150 flex items-center gap-2 w-full 
        ${
          !isExpanded
            ? "justify-center w-10 h-10 p-5 mx-auto aspect-square py-2 px-2"
            : "justify-start py-2 px-3"
        }
      `}
                          >
                            <span className={`${!isExpanded && "text-lg"}`}>
                              {item.icon}
                            </span>
                            <span
                              className={`${isExpanded ? "block" : "hidden"}`}
                            >
                              {item.label}
                            </span>
                          </button>
                        ) : (
                          <Link
                            href={item.path}
                            className={`text-lightColor capitalize font-medium text-xs rounded-third hover:bg-mainColor/25 duration-150 flex items-center gap-2 w-full 
        ${
          isMenuItemActive(item)
            ? "bg-mainColor/50 dark:bg-secondaryColor/50"
            : ""
        } 
        ${
          !isExpanded
            ? "justify-center w-10 h-10 p-5 mx-auto aspect-square py-2 px-2"
            : "justify-start py-2 px-3"
        }
      `}
                          >
                            <span className={`${!isExpanded && "text-lg"}`}>
                              {item.icon}
                            </span>
                            <span
                              className={`${isExpanded ? "block" : "hidden"}`}
                            >
                              {item.label}
                            </span>
                          </Link>
                        )
                      ) : (
                        <>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (isExpanded) {
                                toggleSubmenu(item.label);
                              }
                            }}
                            className={`${
                              isMenuItemActive(item) &&
                              "bg-mainColor/50 dark:bg-secondaryColor/50"
                            } cursor-pointer font-medium text-xs capitalize group rounded-third hover:bg-mainColor/25 duration-150 flex items-center gap-2 w-full 
                                                          ${
                                                            !isExpanded
                                                              ? "justify-center w-10 h-10 p-5 mx-auto aspect-square py-2 px-2"
                                                              : "justify-between py-2 px-3"
                                                          }`}
                          >
                            <div
                              className={`flex items-center gap-2 relative text-lightColor`}
                            >
                              {item.subs.length > 0 && !isExpanded && (
                                <div
                                  className={`${
                                    isMenuItemActive(item) && "!h-[3px]"
                                  } absolute left-[-8px] w-[3px] h-[3px] group-hover:h-[14px] duration-200 ease-in-out transition-all bg-white rounded-full`}
                                ></div>
                              )}
                              <span
                                className={`${
                                  !isExpanded && "text-lg"
                                } relative`}
                              >
                                <div
                                  className={`${
                                    item.subs &&
                                    openSubmenus[item.label] &&
                                    isExpanded
                                      ? "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 rounded-full w-5 h-5 pointer-events-none"
                                      : ""
                                  }`}
                                ></div>
                                {item.icon}
                              </span>
                              <span
                                className={`${
                                  isExpanded ? "block !line-clamp-1" : "hidden"
                                } capitalize text-left`}
                              >
                                {item.label}
                              </span>
                            </div>

                            {item.subs.length > 0 && isExpanded && (
                              <IoIosArrowDown
                                className={`transition-transform duration-200 ${
                                  openSubmenus[item.label]
                                    ? "rotate-180 text-lightColor"
                                    : "text-lightColor/60"
                                }`}
                              />
                            )}
                          </button>

                          {/* Expanded Mode Submenu */}
                          {item.subs &&
                            openSubmenus[item.label] &&
                            isExpanded && (
                              <ul className="ml-[17px] mt-1 space-y-1 border-l border-neutral-300/50 dark:border-neutral-400">
                                {item.subs.map((sub, subIdx) => (
                                  <li key={subIdx}>
                                    <Link
                                      href={sub.path}
                                      className="capitalize group ml-1 flex items-center text-[13px] text-neutral-200 dark:text-neutral-300 duration-150"
                                    >
                                      <p
                                        className={`${
                                          isSubmenuItemActive(sub.path) &&
                                          "bg-mainColor/50 dark:bg-secondaryColor/50 font-semibold text-neutral-300 dark:text-neutral-200"
                                        } text-xs group-hover:bg-mainColor/20 px-2 py-1.5 w-full rounded-third duration-150`}
                                      >
                                        {sub.name}
                                      </p>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}

                          {/* Minimized Mode Dropdown */}
                          {item.subs.length > 0 && !isExpanded && (
                            <ul className="dropdown-content menu bg-lightColor dark:bg-darkColor rounded-secondary !z-[999] w-56 p-1 shadow-lg border border-neutral-200 dark:border-neutral-700">
                              <li className="mb-2">
                                <div className="px-3 py-2 bg-mainColor/20 border border-white/50 dark:border-neutral-500/50 rounded-lg capitalize font-bold text-sm text-darkColor dark:text-lightColor pointer-events-none">
                                  {item.label}
                                </div>
                              </li>
                              {item.subs.map((sub, subIdx) => (
                                <li key={subIdx}>
                                  <Link
                                    href={sub.path}
                                    className={`${
                                      isSubmenuItemActive(sub.path) &&
                                      "bg-mainColor/50 dark:bg-mainColor/30"
                                    } rounded-lg capitalize group text-neutral-700 dark:text-neutral-200 hover:bg-mainColor/30 transition-colors duration-150`}
                                  >
                                    {sub.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer/Profile - Fixed */}
        <div className="flex-shrink-0 pb-2 px-2 space-y-2 ">
          <div
            className={`${
              isExpanded
                ? "py-3 px-2 rounded-secondary"
                : "flex items-center justify-center rounded-full w-11 h-11 mx-auto"
            } bg-white/10 hover:bg-white/30 duration-300 cursor-pointer`}
            onClick={toggleSidebar}
          >
            <div className="flex items-center gap-3">
              <div className={`${!isExpanded ? "h-11 w-11" : "h-11 w-11 flex-shrink-0"} rounded-full bg-gradient-to-tr from-darkColor to-mainColor text-white flex justify-center items-center`}>
                <span className="font-bold uppercase text-sm">
                  {currentUser?.name.split("").slice(0, 2).join("")}
                </span>
              </div>
              {isExpanded && (
                <div className="flex items-center justify-between w-full overflow-hidden">
                  <div className="overflow-hidden">
                    <h2 className="text-white font-semibold text-sm truncate">
                      {loading ? "memuat..." : currentUser?.name}
                    </h2>
                    <p className="text-white/70 text-xs truncate">
                      {loading ? "memuat..." : currentUser?.role}
                    </p>
                  </div>
                  <div className="text-white w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full hover:bg-mainColor/20 duration-300">
                    <TbDotsVertical />
                  </div>
                </div>
              )}
            </div>
          </div>
          <ThemeSwitch isExpanded={isExpanded} />
        </div>
      </div>
    </section>
  );
};