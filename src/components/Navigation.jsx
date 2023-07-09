import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useTags from './hooks/useTags';

import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import NavLink from './NavLink';

const Navigation = ({ setIsOpen = null }) => {
  const navList = useTags();

  return (
    <nav>
      <ul className="space-y-9">
        <li>
          <h2 className="font-display font-medium text-slate-900 dark:text-white">
            API reference
          </h2>
          <ul role="list" className="ml-2">
            {navList.map((group) => {
              return (
                <NavigationGroup
                  key={group.title}
                  group={group}
                  setIsOpen={setIsOpen}
                />
              );
            })}
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;

function NavigationGroup({ group, setIsOpen }) {
  let location = useLocation();
  let pathname = decodeURI(location.pathname);
  let pathnameArray = pathname.split('/');
  let isActiveGroup = group.title === pathnameArray[2];
  let navigate = useNavigate();
  return (
    <li className={clsx('relative mt-6')}>
      <h2
        className={clsx(
          'text-xs font-semibold text-sky-500',
          isActiveGroup
            ? 'text-sky-500'
            : 'text-zinc-600 hover:text-sky-500 dark:text-zinc-400 dark:hover:text-sky-500',
          !group.children && 'cursor-pointer'
        )}
        onClick={() => {
          if (!group.children) {
            setIsOpen && setIsOpen(false);
            navigate(group.href);
          }
        }}
      >
        {group.title.replaceAll('_', ' ')}
      </h2>
      <div className="relative mt-3 pl-2">
        <motion.div
          layout
          className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
        />
        <AnimatePresence initial={false}>
          {group.children && isActiveGroup && (
            <ActivePageMarker
              group={group}
              pathname={pathname}
              pathnameArray={pathnameArray}
            />
          )}
        </AnimatePresence>

        {group.children &&
          group.children.map((category, categoryIdx) => {
            let isActiveCategory = category.title === pathnameArray[3];
            return (
              <ul
                role="list"
                className="border-l border-transparent"
                key={categoryIdx}
              >
                {category.children ? (
                  <li className="relative">
                    <NavLink
                      href={category.children[0].href}
                      active={isActiveCategory}
                      isCategory={true}
                    >
                      {category.title}
                    </NavLink>
                    {isActiveCategory && category.children.length > 0 && (
                      <ul>
                        {category.children.map((section) => {
                          let isActiveSection =
                            section.title === pathnameArray[4];
                          return (
                            <li key={section.name} className="pl-2">
                              <NavLink
                                href={section.href}
                                active={isActiveSection}
                                isAnchorLink
                                setIsOpen={setIsOpen}
                              >
                                {section.title}
                              </NavLink>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                ) : (
                  <li className="relative">
                    <NavLink
                      href={category.href}
                      active={isActiveGroup && isActiveCategory}
                      setIsOpen={setIsOpen}
                    >
                      {category.title}
                    </NavLink>
                  </li>
                )}
              </ul>
            );
          })}
      </div>
    </li>
  );
}

function ActivePageMarker({ group, pathname, pathnameArray }) {
  let itemHeight = remToPx(2);
  let offset = remToPx(0.25);
  let activePageIndex = group.children.findIndex(
    (category) => category.title === pathnameArray[3]
  );
  let top = offset + activePageIndex * itemHeight;

  return (
    <motion.div
      layout
      className="a-page absolute left-2 h-6 w-px bg-sky-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ top }}
    />
  );
}

export function remToPx(remValue) {
  let rootFontSize =
    typeof window === 'undefined'
      ? 16
      : parseFloat(window.getComputedStyle(document.documentElement).fontSize);

  return parseFloat(remValue) * rootFontSize;
}
