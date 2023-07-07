import React from "react";

import Router from "./Router";
import { AppProvider } from "./contexts/AppContext";

function App() {
  return (
    <AppProvider>
      <div className="bg-white dark:bg-slate-900">
        {/*<Header />*/}
        <Router />
      </div>
    </AppProvider>
  );
}

export default App;
