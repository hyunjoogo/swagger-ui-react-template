import {
  forwardRef,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Dialog } from "@headlessui/react";
import clsx from "clsx";
import Highlighter from "react-highlight-words";
import { AppContext } from "../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";

function SearchIcon(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" {...props}>
      <path d="M16.293 17.707a1 1 0 0 0 1.414-1.414l-1.414 1.414ZM9 14a5 5 0 0 1-5-5H2a7 7 0 0 0 7 7v-2ZM4 9a5 5 0 0 1 5-5V2a7 7 0 0 0-7 7h2Zm5-5a5 5 0 0 1 5 5h2a7 7 0 0 0-7-7v2Zm8.707 12.293-3.757-3.757-1.414 1.414 3.757 3.757 1.414-1.414ZM14 9a4.98 4.98 0 0 1-1.464 3.536l1.414 1.414A6.98 6.98 0 0 0 16 9h-2Zm-1.464 3.536A4.98 4.98 0 0 1 9 14v2a6.98 6.98 0 0 0 4.95-2.05l-1.414-1.414Z" />
    </svg>
  );
}

function HighlightQuery({ text, query }) {
  return (
    <Highlighter
      highlightClassName="group-aria-selected:underline bg-transparent text-sky-600 dark:text-sky-400"
      searchWords={[query]}
      autoEscape={true}
      textToHighlight={text}
    />
  );
}

function SearchResult({ focus, result, query, onClose }) {
  let id = useId();

  return (
    <li
      className={clsx(
        "results group block cursor-default rounded-lg px-3 py-2 hover:bg-gray-600 focus:bg-gray-600 aria-selected:bg-slate-100 dark:aria-selected:bg-slate-700/30",
        focus && "bg-gray-600"
      )}
    >
      <Link to={result.linkTo} onClick={onClose}>
        <div
          aria-hidden="true"
          className="text-sm text-slate-700 group-aria-selected:text-sky-600 dark:text-slate-300 dark:group-aria-selected:text-sky-400"
        >
          <HighlightQuery text={result.summary} query={query} />
        </div>
        <div
          id={`${id}-hierarchy`}
          aria-hidden="true"
          className="mt-0.5 truncate whitespace-nowrap text-xs text-slate-500 dark:text-slate-400"
        >
          <HighlightQuery text={result.path} query={query} />
        </div>
      </Link>
    </li>
  );
}

function SearchResults({ focused, query, suggestions, onClose }) {
  if (suggestions.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-sm text-slate-700 dark:text-slate-400">
        No results for &ldquo;
        <span className="break-words text-slate-900 dark:text-white">
          {query}
        </span>
        &rdquo;
      </p>
    );
  }

  return (
    <ul>
      {suggestions.map((result, idx) => (
        <SearchResult
          key={idx}
          focus={idx === focused}
          result={result}
          query={query}
          onClose={onClose}
        />
      ))}
    </ul>
  );
}

const SearchInput = forwardRef(function SearchInput(
  { onClose, setInputValue, suggestions, setFocused, focused },
  inputRef
) {
  const arrows = ["ArrowUp", "ArrowDown"];

  return (
    <div className="group relative flex h-12">
      <SearchIcon className="pointer-events-none absolute left-4 top-0 h-full w-5 fill-slate-400 dark:fill-slate-500" />
      <input
        ref={inputRef}
        className="flex-auto appearance-none bg-transparent pl-12 text-slate-900 outline-none placeholder:text-slate-400 focus:w-full focus:flex-none dark:text-white sm:text-sm [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            // navigate(suggestions[focused].linkTo);
            event.preventDefault();
            onClose(suggestions[focused].linkTo);
          }
          if (arrows.includes(event.key)) {
            if (event.key === "ArrowUp") {
              setFocused((prev) =>
                prev === 0 ? suggestions.length - 1 : prev - 1
              );
            }
            if (event.key === "ArrowDown") {
              setFocused((prev) =>
                prev === suggestions.length - 1 ? 0 : prev + 1
              );
            }
          }
        }}
        onChange={(event) => {
          setInputValue(event.target.value);
          setFocused(0);
        }}
      />
    </div>
  );
});

function SearchDialog({ open, setOpen, className }) {
  const { summaryList } = useContext(AppContext);
  const navigate = useNavigate();
  let panelRef = useRef();
  let inputRef = useRef();

  const [focused, setFocused] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (open) {
      return;
    }

    function onKeyDown(event) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setOpen]);

  useEffect(() => {
    if (inputValue === "") {
      setSuggestions([]);
      return;
    }

    const result = summaryList.filter(
      (item) =>
        item.summary.includes(inputValue) || item.path.includes(inputValue)
    );
    setSuggestions(result);
  }, [inputValue]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        setInputValue("");
        setSuggestions([]);
      }}
      className={clsx("fixed inset-0 z-50", className)}
    >
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur" />

      <div className="fixed inset-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-20 md:py-32 lg:px-8 lg:py-[15vh]">
        <Dialog.Panel className="mx-auto overflow-hidden rounded-xl bg-white shadow-xl dark:bg-slate-800 dark:ring-1 dark:ring-slate-700 sm:max-w-xl">
          <div>
            <SearchInput
              ref={inputRef}
              suggestions={suggestions}
              setInputValue={setInputValue}
              focused={focused}
              setFocused={setFocused}
              onClose={(target) => {
                navigate(target);
                setOpen(false);
                setInputValue("");
                setSuggestions([]);
              }}
            />
            <div
              ref={panelRef}
              className="border-t border-slate-200 bg-white px-2 py-3 empty:hidden dark:border-slate-400/10 dark:bg-slate-800"
            >
              {inputValue !== "" && (
                <SearchResults
                  suggestions={suggestions}
                  focused={focused}
                  query={inputValue}
                  onClose={() => {
                    setOpen(false);
                    setInputValue("");
                    setSuggestions([]);
                  }}
                />
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

function useSearchProps() {
  let buttonRef = useRef();
  let [open, setOpen] = useState(false);

  return {
    buttonProps: {
      ref: buttonRef,
      onClick() {
        setOpen(true);
      },
    },
    dialogProps: {
      open,
      setOpen(open) {
        let { width, height } = buttonRef.current.getBoundingClientRect();
        if (!open || (width !== 0 && height !== 0)) {
          setOpen(open);
        }
      },
    },
  };
}

export function Search() {
  let [modifierKey, setModifierKey] = useState();
  let { buttonProps, dialogProps } = useSearchProps();

  useEffect(() => {
    setModifierKey(
      /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? "⌘" : "Ctrl "
    );
  }, []);

  return (
    <>
      <button
        type="button"
        className="group flex h-6 w-6 items-center justify-center sm:justify-start md:h-auto md:w-80 md:flex-none md:rounded-lg md:py-2.5 md:pl-4 md:pr-3.5 md:text-sm md:ring-1 md:ring-slate-200 md:hover:ring-slate-300 dark:md:bg-slate-800/75 dark:md:ring-inset dark:md:ring-white/5 dark:md:hover:bg-slate-700/40 dark:md:hover:ring-slate-500 lg:w-96"
        {...buttonProps}
      >
        <SearchIcon className="h-5 w-5 flex-none fill-slate-400 group-hover:fill-slate-500 dark:fill-slate-500 md:group-hover:fill-slate-400" />
        <span className="sr-only md:not-sr-only md:ml-2 md:text-slate-500 md:dark:text-slate-400">
          Search docs
        </span>
        {modifierKey && (
          <kbd className="ml-auto hidden font-medium text-slate-400 dark:text-slate-500 md:block">
            <kbd className="font-sans">{modifierKey}</kbd>
            <kbd className="font-sans">K</kbd>
          </kbd>
        )}
      </button>
      <SearchDialog {...dialogProps} />
    </>
  );
}
