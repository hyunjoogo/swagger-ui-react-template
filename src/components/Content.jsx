import React from 'react';
import Prose from './Prose';
import { transDepsToArrayForDisplay } from '../utils/transDepsToArray';

const Content = ({ tag, apiArray }) => {
  const tagArray = transDepsToArrayForDisplay(tag.name);
  const title = tagArray[tagArray.length - 1];
  const currentLocation = tagArray.slice(0, 2).join(' > ');

  return (
    <>
      <header className="mb-9 space-y-1">
        <p className="font-display text-sm font-medium text-sky-500">
          {`API reference > ${currentLocation}`}
        </p>
        <h1 className="font-display text-3xl tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
        <p className="prose prose-slate max-w-none dark:prose-invert dark:text-slate-400">
          {tag.description}
        </p>
      </header>
      <Prose apiArray={apiArray} />
    </>
  );
};

export default Content;
