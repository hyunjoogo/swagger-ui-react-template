import React, { useContext, useEffect, useState } from "react";
import ItemTable from "./ItemTable";
import parse from "html-react-parser";
import { LinkCopy } from "./icons/LinkCopy";
import { CopyToClipboard } from "react-copy-to-clipboard/src";
import { useLocation } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";
import Responses from "./Responses";
import CONFIG from "../consts/config";

const ApiItem = ({ method, uri, methodData }) => {
  const { apiData } = useContext(AppContext);
  const [paramData, setParamData] = useState({});
  const location = useLocation();
  // data = paths[메소드종류]
  useEffect(() => {
    const header = [];
    const path = [];
    const query = [];
    const body = [];
    methodData.parameters.forEach((param) => {
      if (param.in === "header") {
        header.push(param);
      }
      if (param.in === "path") {
        path.push(param);
      }
      if (param.in === "query") {
        query.push(param);
      }
      if (param.in === "body") {
        body.push(param);
      }
    });
    console.log(header);
    setParamData({ header, path, query, body });
  }, []);

  const methodClassName = (method) => {
    let className =
      "rounded-lg px-1.5 font-mono text-1 font-semibold uppercase leading-6 ring-1 ring-inset ";
    if (method === "get") {
      className +=
        "bg-emerald-400/10 text-emerald-500 ring-emerald-300 dark:text-emerald-400 dark:ring-emerald-400/30";
    }
    if (method === "post") {
      className +=
        "bg-sky-400/10 text-sky-500 ring-sky-300 dark:bg-sky-400/10 dark:text-sky-400 dark:ring-sky-400/30";
    }
    if (method === "delete") {
      className +=
        "bg-rose-50 text-red-500 ring-rose-200 dark:bg-rose-400/10 dark:text-rose-400 dark:ring-rose-500/20";
    }
    if (method === "patch") {
      className +=
        "bg-indigo-400/10 text-indigo-500 ring-indigo-300 dark:text-indigo-400 dark:ring-indigo-400/30";
    }
    return className;
  };

  function replaceNewLines(str) {
    return str.replace(/\n/g, "<br/>");
  }

  function showSnackBar() {
    const sb = document.getElementById("snackbar");

    //this is where the class name will be added & removed to activate the css
    sb.className = "show";

    setTimeout(() => {
      sb.className = sb.className.replace("show", "");
    }, 3000);
  }

  return (
    <>
      <h2
        className="linkCopy prose-headings:scroll-mt-28 prose-headings:font-display prose-headings:font-normal lg:prose-headings:scroll-mt-[8.5rem]"
        id={methodData.summary.replaceAll(" ", "_")}
      >
        {methodData.summary}
        <CopyToClipboard
          text={
            CONFIG.defaultSiteDomain +
            decodeURI(
              location.pathname + "#" + methodData.summary.replaceAll(" ", "_")
            )
          }
          onCopy={(text, result) => showSnackBar()}
        >
          <button>
            <LinkCopy />
          </button>
        </CopyToClipboard>
        <span id="snackbar">Successfully Copied</span>
      </h2>

      {methodData.description && (
        <span>{parse(replaceNewLines(methodData.description))}</span>
      )}
      <h3>Resource</h3>
      <div className="flex items-center gap-x-3">
        <span className={methodClassName(method)}>{method}</span>
        <span className="h-0.5 w-0.5 rounded-full bg-zinc-300 dark:bg-zinc-600"></span>
        <span className="font-mono font-bold">{uri}</span>
      </div>
      <div>
        {paramData?.header?.length !== 0 && (
          <ItemTable
            tableName={"Headers"}
            tableData={paramData.header}
            headers={["name", "required", "description"]}
          />
        )}

        {paramData?.path?.length !== 0 && (
          <ItemTable tableName={"Path Parameters"} tableData={paramData.path} />
        )}
        {paramData?.query?.length !== 0 && (
          <ItemTable
            tableName={"Query Parameters"}
            tableData={paramData.query}
            scopedSlots={{
              description: (item) => {
                return (
                  <td>
                    {item.description}
                    {item["x-example"] && (
                      <>
                        <br />
                        ex) {item["x-example"]}
                      </>
                    )}
                  </td>
                );
              },
            }}
          />
        )}
        {paramData?.body?.length !== 0 && (
          <ItemTable tableName={"Body Parameters"} tableData={paramData.body} />
        )}
      </div>
      <div>
        <h3>Responses</h3>
        {Object.keys(methodData.responses).map((response, index) => {
          if (response === "200") {
            if (methodData.responses[response].examples) {
              return (
                <Responses
                  key={index}
                  methodData={methodData}
                  response={response}
                />
              );
            } else if (methodData.responses[response].schema?.$ref) {
              const ref = methodData.responses[response].schema.$ref;
              return (
                <Responses
                  key={index}
                  methodData={methodData}
                  response={response}
                  properties={apiData.defObj[ref.slice(14)]}
                />
              );
            }
          } else {
            return (
              <Responses
                key={index}
                methodData={methodData}
                response={response}
              />
            );
          }
        })}
      </div>
      <hr />
    </>
  );
};

export default ApiItem;
