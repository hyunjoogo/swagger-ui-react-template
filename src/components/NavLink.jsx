import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

const NavLink = ({
  href = '#',
  active = false,
  isAnchorLink = false,
  children,
  isCategory = false,
  setIsOpen,
}) => {
  return (
    <Link
      to={href}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'flex justify-between gap-2 py-1 pr-3 text-sm transition',
        isAnchorLink ? 'pl-7' : 'pl-4',
        active
          ? 'text-sky-500'
          : 'text-zinc-600 hover:text-sky-500 dark:text-zinc-400 dark:hover:text-sky-500'
      )}
      onClick={() => setIsOpen && setIsOpen(false)}
    >
      <span className="truncate">{children}</span>
      {isCategory && (
        <ChevronRightIcon
          className={clsx(
            active ? 'rotate-90 text-gray-500' : 'text-gray-400',
            'ml-auto h-5 w-5 shrink-0'
          )}
          aria-hidden="true"
        />
      )}
    </Link>
  );
};

export default NavLink;
