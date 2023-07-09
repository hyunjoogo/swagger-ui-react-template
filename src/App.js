import React from "react";

import Router from "./Router";
import { AppProvider } from "./contexts/AppContext";
import Header from "./components/Header";

function App() {
  return (
    <AppProvider>
      <div className="bg-white dark:bg-slate-900">
        <Header />
        <Router />
      </div>
    </AppProvider>
  );
}

export default App;
