import React, { Fragment, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import styled from 'styled-components';
import SyntaxHighlighter from 'react-syntax-highlighter';

const Responses = ({ methodData, response, properties }) => {
  const { apiData } = useContext(AppContext);

  const produces = methodData.produces || apiData.produces;

  function parseDescription(properties) {
    try {
      return JSON.stringify(properties, null, 2);
    } catch (e) {
      console.error(e);
    }
  }

  const methodClassName = (method) => {
    let className =
      'rounded-lg px-1.5 font-mono text-1 font-semibold uppercase leading-6 ring-1 ring-inset ';
    if (method[0] === '2') {
      className +=
        'bg-emerald-400/10 text-emerald-500 ring-emerald-300 dark:text-emerald-400 dark:ring-emerald-400/30';
    }
    if (method[0] === '5') {
      className +=
        'bg-rose-50 text-red-500 ring-rose-200 dark:bg-rose-400/10 dark:text-rose-400 dark:ring-rose-500/20';
    }
    if (method[0] === '4') {
      className +=
        'bg-orange-50 text-orange-500 ring-orange-200 dark:bg-orange-400/10 dark:text-orange-400 dark:ring-orange-500/20';
    }
    return className;
  };

  return (
    <Fragment>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          <span className={methodClassName(response)}>{response}</span>
          <span>{methodData.responses[response].description}</span>
        </div>
        <span>
          Content-type:{' '}
          {produces.map((key, index) => {
            if (index === produces.length - 1) return key;
            return key + ', ';
          })}
        </span>
      </div>
      {produces.map((key) => {
        if (methodData.responses[response].examples) {
          if (key in methodData.responses[response].examples) {
            if (key === 'text/html') {
              return (
                <Highlighter language="html" useInlineStyles={false} key={key}>
                  {methodData.responses[response].examples[key]}
                </Highlighter>
              );
            }

            return (
              <Highlighter language="json" useInlineStyles={false} key={key}>
                {parseDescription(
                  JSON.parse(methodData.responses[response].examples[key])
                )}
              </Highlighter>
            );
          }
        }
      })}
      {response === '200' && properties && (
        <Highlighter language="json" useInlineStyles={false}>
          {parseDescription(properties)}
        </Highlighter>
      )}
    </Fragment>
  );
};

export default Responses;

const Highlighter = styled(SyntaxHighlighter)`
  .hljs-attr {
    color: rgb(156, 220, 254);
  }

  .hljs-string {
    color: rgb(214, 157, 133);
  }

  .hljs-number {
    color: rgb(184, 215, 163);
  }

  .hljs-literal {
    color: rgb(184, 215, 163);
  }
  .hljs-tag {
    color: #4da0ce;
  }
  .hljs-tag .hljs-name {
    color: #4da0ce;
  }
`;
