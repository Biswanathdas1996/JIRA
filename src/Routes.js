import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import CreateSprint from "./Pages/Sprint";
import CreateTicket from "./Pages/CreateTicket";
import ViewTicket from "./Pages/ViewTicket";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Backlog from "./Pages/Backlog";
import BurnDownchart from "./Pages/Reports/BurnDownchart";
import Confluence from "./Pages/Confluence/Index";

class Routing extends React.Component {
  render() {
    const uid = localStorage.getItem("uid");
    return (
      <Routes>
        {uid ? (
          <>
            <Route exact path="/" element={<Dashboard />} />
            <Route exact path="/sprints" element={<CreateSprint />} />
            <Route exact path="/create-ticket" element={<CreateTicket />} />
            <Route exact path="/ticket/:tokenId" element={<ViewTicket />} />
            <Route exact path="/backlog" element={<Backlog />} />
            <Route exact path="/report" element={<BurnDownchart />} />
            <Route exact path="/confluence" element={<Confluence />} />
          </>
        ) : (
          <>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
          </>
        )}

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
