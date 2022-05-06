import React, { useState, useEffect, createContext } from "react";
import "./App.css";
import "./index.css";
import Routes from "./Routes";
import "fontsource-roboto";
import CssBaseline from "@material-ui/core/CssBaseline";

import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import { _account, _fetch } from "./CONTRACT-ABI/connect";

export const AccountContext = createContext();
const App = () => {
  const [account, setAccount] = useState(null);
  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    const projectName = await _fetch("project");
    const projectManager = await _fetch("manager");
    setProjectData({ projectName, projectManager });
    const account = await _account();
    if (account) {
      const user = await _fetch("users", account);
      setAccount(user);
    } else {
      setAccount(null);
    }
  }

  return (
    <>
      <CssBaseline />
      <AccountContext.Provider value={{ account, fetchUserData, projectData }}>
        <Header />
        <Routes />
        <Footer />
      </AccountContext.Provider>
    </>
  );
};

export default App;
