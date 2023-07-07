import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { AppContext } from "./contexts/AppContext";

const Router = () => {
  const { routerState } = useContext(AppContext);
  return (
    <>
      <Routes>
        {routerState.map((route) => {
          return (
            <Route path={route.path} element={route.element} key={route.path} />
          );
        })}
        <Route path="*" element={<div></div>} />
      </Routes>
    </>
  );
};

export default Router;
