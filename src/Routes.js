import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import CreateSprint from "./Pages/Sprint";
import CreateTicket from "./Pages/CreateTicket";
import ViewTicket from "./Pages/ViewTicket";
import Register from "./Pages/Register";
import Login from "./Pages/Login";

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
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/login" element={<Login />} />
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
