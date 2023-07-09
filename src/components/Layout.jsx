import React, { useContext, useEffect, useState } from "react";
// import Content from './Content';
// import Sidebar from './Sidebar';
import { AppContext } from "../contexts/AppContext";
import Navigation from "./Navigation";
import Content from "./Content";
import Sidebar from "./Sidebar";
// import Navigation from './Navigation';

const initialTag = { name: "index", description: "index" };
const Layout = ({ tag = initialTag }) => {
  const { apiData } = useContext(AppContext);
  const [apiArray, setApiArray] = useState([]);
  const [summaryArray, setSummaryArray] = useState([]);

  useEffect(() => {
    if (tag.name === "index") return;

    const API = [];
    const summaryList = [];
    const paths = Object.keys(apiData.paths);

    paths.forEach((path) => {
      const methodObj = apiData.paths[path];
      const methodArrayKeys = Object.keys(methodObj);

      methodArrayKeys.forEach((method) => {
        if (methodObj[method].tags.includes(tag.name)) {
          API.push({
            uri: path,
            methods: apiData.paths[path],
          });
          summaryList.push({
            id: methodObj[method].summary,
            title: methodObj[method].summary,
          });
        }
      });
    });
    setApiArray(API);
    setSummaryArray(summaryList);
  }, [tag]);

  return (
    <div>
      <div className="relative mx-auto flex max-w-8xl justify-center sm:px-2 lg:px-8 xl:px-12">
        <div className="hidden lg:relative lg:block lg:flex-none">
          <div className="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden" />
          <div className="absolute bottom-0 right-0 top-16 hidden h-12 w-px bg-gradient-to-t from-slate-800 dark:block" />
          <div className="absolute bottom-0 right-0 top-28 hidden w-px bg-slate-800 dark:block" />
          <div className="sticky top-[4.5rem] -ml-0.5 h-[calc(100vh-4.5rem)] w-64 overflow-y-auto overflow-x-hidden py-16 pl-0.5 pr-8 xl:w-72 xl:pr-8">
            <Navigation />
          </div>
        </div>
        <div className="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16">
          <article>
            <Content tag={tag} apiArray={apiArray} />
          </article>
        </div>
        <Sidebar summaryArray={summaryArray} />
      </div>
    </div>
  );
};

export default Layout;
