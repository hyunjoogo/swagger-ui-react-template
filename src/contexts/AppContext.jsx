import React, { useEffect, useState } from "react";
import { generateDefinitionObject } from "../utils/generateDefinitionObject";
import Layout from "../components/Layout";
import axios from "axios";
import { transDepsToArray } from "../utils/transDepsToArray";
import { useLocation, useNavigate } from "react-router-dom";
import CONFIG from "../consts/config";

const AppContext = React.createContext();

const initialRouter = [
  {
    path: "/",
    element: <section className="h-96"></section>,
  },
];

const AppProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [apiData, setApiData] = useState();
  const [apiName, setApiName] = useState("");
  const [summaryList, setSummaryList] = useState([]);
  const [routerState, setRouterState] = useState(initialRouter);

  useEffect(() => {
    let domain = location.pathname.split("/")[1];
    if (domain === "") {
      fetchSwaggerJSON(CONFIG.defaultDomain).then(() =>
        navigate(`/${CONFIG.defaultDomain}`)
      );
    } else {
      fetchSwaggerJSON(domain);
    }
  }, [location.hash]);

  const fetchSwaggerJSON = async (domainName) => {
    let newData = {};
    try {
      const { data } = await axios({
        method: "get",
        url: CONFIG.domains[domainName].url,
        responseType: "json",
      });
      newData = { ...data };
    } catch (e) {
      alert(e);
    }

    // def객체 생성하기
    const defObj = generateDefinitionObject(newData);
    newData.defObj = defObj;

    const addRouter = newData.tags.map((tag) => {
      const tagDeps = transDepsToArray(tag.name);
      return {
        path: `/${domainName}/${tagDeps.join("/")}`,
        element: <Layout tag={tag} />,
      };
    });

    const apisList = [];
    const paths = Object.keys(newData.paths);
    paths.forEach((path) => {
      const methodsObj = newData.paths[path];
      Object.keys(methodsObj).forEach((method) => {
        const summary = methodsObj[method].summary;
        const tagDeps = transDepsToArray(methodsObj[method].tags[0]);
        const flatSummary = summary.replaceAll(" ", "_");
        const linkTo = `/${domainName}/${tagDeps.join("/")}#${flatSummary}`;
        if (summary) {
          apisList.push({
            summary,
            path,
            method,
            linkTo,
          });
        }
      });
    });
    setSummaryList(apisList);

    setRouterState([
      ...initialRouter,
      {
        path: `/${domainName}`,
        element: <Layout />,
      },
      ...addRouter,
    ]);
    setApiName(domainName);
    setApiData(newData);
  };

  const store = {
    // TODO 이름 변경 해야함
    apiData,
    apiName,
    routerState,
    handleAPI: fetchSwaggerJSON,
    summaryList,
  };

  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
