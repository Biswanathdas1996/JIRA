import React from "react";
import { Route, Routes } from "react-router-dom";

import Profile from "./Pages/Profile";
import Dashboard from "./Pages/Dashboard";
import CreateTicket from "./Pages/CreateTicket";
import ViewTicket from "./Pages/ViewTicket";

class Routing extends React.Component {
  render() {
    return (
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/create-ticket" element={<CreateTicket />} />
        <Route exact path="/ticket/:tokenId" element={<ViewTicket />} />
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
