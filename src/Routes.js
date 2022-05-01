import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import Dashboard from "./Pages/Dashboard";

class Routing extends React.Component {
  render() {
    return (
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/profile" element={<Profile />} />

        <Route
          render={function () {
            return <h1>Not Found</h1>;
          }}
        />
      </Routes>
    );
  }
}

export default Routing;
