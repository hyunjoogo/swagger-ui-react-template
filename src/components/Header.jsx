import React, { useContext, useEffect, useState } from "react";
import clsx from "clsx";
import { ThemeSelector } from "./ThemeSelector";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";
import CONFIG from "../consts/config";
import { MobileNavigation } from "./MobileNavigation";
import { Logo, Logomark } from "./icons/Logo";
import { Search } from "./Search";

const Header = () => {
  const { handleAPI, apiName } = useContext(AppContext);

  let [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 0);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white px-4 py-5 shadow-md shadow-slate-900/5 transition duration-500 dark:shadow-none sm:px-6 lg:px-8",
        isScrolled
          ? "dark:bg-slate-900/95 dark:backdrop-blur dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/75"
          : "dark:bg-transparent"
      )}
    >
      <div className="mr-6 flex lg:hidden">
        <MobileNavigation />
      </div>
      <div className="relative mr-6 flex flex-grow basis-0 items-center gap-2">
        <Link to={`/${CONFIG.defaultDomain}`}>
          <Logomark className="h-9 w-9 lg:hidden" />
          <Logo className="hidden h-9 w-auto fill-slate-700 dark:fill-sky-100 lg:block" />
        </Link>
        <select
          value={apiName}
          onChange={(e) => {
            handleAPI(e.target.value);
            navigate(`/${e.target.value}`);
          }}
          className="block h-11 w-auto
          rounded-lg py-2.5 pl-3 pr-5 text-sm text-slate-500
          ring-1 ring-slate-200
          hover:ring-slate-300 dark:bg-slate-800/75 dark:text-slate-400 dark:ring-inset dark:ring-white/5
          dark:hover:bg-slate-700/40 dark:hover:ring-slate-500"
        >
          {Object.keys(CONFIG.domains).map((domain) => {
            const domainObj = CONFIG.domains[domain];
            return (
              <option key={domainObj.pathname} value={domainObj.pathname}>
                {domainObj.selectName}
              </option>
            );
          })}
        </select>
      </div>
      <div className="-my-5 mr-6 sm:mr-8 md:mr-0">
        <Search />
      </div>
      <div className="relative flex basis-0 justify-end gap-6 sm:gap-8 md:flex-grow">
        <ThemeSelector className="relative z-10" />
      </div>
    </header>
  );
};

export default Header;
