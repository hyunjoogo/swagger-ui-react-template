import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

function useTableOfContents(tableOfContents) {
  let [currentSection, setCurrentSection] = useState(
    tableOfContents[0]?.id.replaceAll(' ', '_')
  );

  let getHeadings = useCallback((tableOfContents) => {
    return tableOfContents
      .flatMap((node) => [node.id.replaceAll(' ', '_')])
      .map((id) => {
        let el = document.getElementById(id);
        if (!el) return;

        let style = window.getComputedStyle(el);
        let scrollMt = parseFloat(style.scrollMarginTop);

        let top = window.scrollY + el.getBoundingClientRect().top - scrollMt;
        return { id, top };
      });
  }, []);

  useEffect(() => {
    if (tableOfContents.length === 0) return;
    let headings = getHeadings(tableOfContents);

    function onScroll() {
      let top = window.scrollY;
      let current = headings[0].id;
      for (let heading of headings) {
        if (top >= heading.top) {
          current = heading.id;
        } else {
          break;
        }
      }
      setCurrentSection(current);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [getHeadings, tableOfContents]);
  return currentSection;
}

const Sidebar = ({ summaryArray }) => {
  let currentSection = useTableOfContents(summaryArray);
  const location = useLocation();
  const [hash, setHash] = useState('');

  useEffect(() => {
    if (location.hash !== '') {
      const decodeHash = decodeURI(location.hash).slice(1);
      setHash(decodeHash);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  useEffect(() => {
    if (hash === '') {
      return;
    }
    const element = document.getElementById(hash);
    if (element) {
      element.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  function isActive(section) {
    if (section.id.replaceAll(' ', '_') === currentSection) {
      return true;
    }
    if (!section.children) {
      return false;
    }
    return section.children.findIndex(isActive) > -1;
  }

  const move = (target) => {
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView();
    }
  };
  return (
    <div className="hidden xl:sticky xl:top-[4.5rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.5rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6">
      <nav aria-labelledby="on-this-page-title" className="w-56">
        {summaryArray.length > 0 && (
          <>
            <h2
              id="on-this-page-title"
              className="font-display text-sm font-medium text-slate-900 dark:text-white"
            >
              On this page
            </h2>
            <ol role="list" className="mt-4 space-y-3 text-sm">
              {summaryArray.map((section, index) => (
                <li key={section.id + index}>
                  <h3>
                    <Link
                      to={`#${section.id.replaceAll(' ', '_')}`}
                      onClick={() => move(section.id.replaceAll(' ', '_'))}
                      className={clsx(
                        isActive(section)
                          ? 'text-sky-500'
                          : 'font-normal text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                      )}
                    >
                      {section.title}
                    </Link>
                  </h3>
                </li>
              ))}
            </ol>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
