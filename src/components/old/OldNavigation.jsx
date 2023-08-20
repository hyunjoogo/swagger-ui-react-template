import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../contexts/AppContext";

export function OldNavigation({ className }) {
  const { apiData, apiName } = useContext(AppContext);
  const [navList, setNavList] = useState([]);

  useEffect(() => {
    const tags = apiData.tags;
    let arr = [];
    tags.forEach((tag) => {
      const tagArray = tag.name.split("|");

      // 튠잇어드민이 없으면
      if (!arr.find((item) => item.title === tagArray[0])) {
        if (tagArray.length === 2) {
          arr.push({
            title: tagArray[0],
            children: [
              {
                title: tagArray[1],
                name: tag.name,
                description: tag.description,
              },
            ],
          });
        } else {
          arr.push({
            title: tagArray[0],
            children: [
              {
                title: tagArray[1],
                children: [
                  {
                    title: tagArray[2],
                    name: tag.name,
                    description: tag.description,
                  },
                ],
              },
            ],
          });
        }
      } else {
        // 뎁스가 한개일때
        if (tagArray.length === 2) {
          const idx = arr.findIndex((item) => item.title === tagArray[0]);
          arr[idx].children.push({
            title: tagArray[1],
            name: tag.name,
            description: tag.description,
          });
        } else {
          const idx = arr.findIndex((item) => item.title === tagArray[0]);
          const childIdx = arr[idx].children.findIndex(
            (child) => child.title === tagArray[1]
          );
          if (childIdx === -1) {
            arr[idx].children.push({
              title: tagArray[1],
              children: [
                {
                  title: tagArray[2],
                  name: tag.name,
                  description: tag.description,
                },
              ],
            });
          } else {
            arr[idx].children[childIdx].children.push({
              title: tagArray[2],
              name: tag.name,
              description: tag.description,
            });
          }
        }
      }
    });
    setNavList(arr);
    // TODO 이렇게 만들어야 함
  }, []);

  let router = useLocation();
  const splitUrl = decodeURI(router.pathname).split("/") ?? null;
  const location =
    splitUrl?.length > 3
      ? splitUrl[splitUrl.length - 2] + "/" + splitUrl[splitUrl.length - 1]
      : splitUrl[splitUrl.length - 1];

  return (
    <>
      <nav className={clsx("text-base lg:text-sm", className)}>
        <ul className="space-y-9">
          <li>
            <h2 className="font-display font-medium text-slate-900 dark:text-white">
              API reference
            </h2>
            <ul className="nav-1 mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200">
              {navList.map((nav) => {
                return (
                  <li key={nav.title} className="relative ml-2">
                    <h3 className="font-display font-medium text-slate-900 dark:text-white">
                      {nav.title} : 어드민 단위
                    </h3>
                    {nav.children?.map((child) => {
                      return (
                        <ul className="nav-2 mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200">
                          {child.children ? (
                            <li key={child.name} className="relative ml-2">
                              <Link
                                to={`/${apiName}/${child.name}`}
                                className={clsx(
                                  "block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full",
                                  child.name === location
                                    ? "font-semibold text-sky-500 before:bg-sky-500"
                                    : "text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                                )}
                              >
                                {child.title}
                              </Link>
                            </li>
                          ) : (
                            <li key={child.name} className="relative ml-2">
                              <h4 className="font-display font-medium text-slate-900 dark:text-white">
                                {child.title} : 카테고리단위
                              </h4>
                            </li>
                          )}
                          {child.children?.map((grandchild) => {
                            return (
                              <li key={grandchild.name} className="relative">
                                <Link
                                  to={`/${apiName}/${grandchild.name}`}
                                  className={clsx(
                                    "block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full",
                                    grandchild.name === location
                                      ? "font-semibold text-sky-500 before:bg-sky-500"
                                      : "text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                                  )}
                                >
                                  {grandchild.title}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      );
                    })}
                  </li>
                );
              })}
              {/*{apiData?.tags?.map((link) => (*/}
              {/*  <li key={link.name} className="relative">*/}
              {/*    <Link*/}
              {/*      to={`/${apiName}/${link.name}`}*/}
              {/*      className={clsx(*/}
              {/*        'block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full',*/}
              {/*        link.name === location*/}
              {/*          ? 'font-semibold text-sky-500 before:bg-sky-500'*/}
              {/*          : 'text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300'*/}
              {/*      )}*/}
              {/*    >*/}
              {/*      {link.name}*/}
              {/*    </Link>*/}
              {/*  </li>*/}
              {/*))}*/}
            </ul>
          </li>
        </ul>
      </nav>
    </>
  );
}
