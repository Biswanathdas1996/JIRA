import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import BacklogList from "../components/Sprints/BacklogList";
import { _fetch, _transction } from "../CONTRACT-ABI/connect";
import TransctionModal from "../components/shared/TransctionModal";
import Loader from "../components/shared/Loader";

const Sprint = () => {
  const [sprints, setSprints] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [activeSprint, setActiveSprint] = useState(null);
  const [response, setResponse] = useState(null);
  const [start, setStart] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllSprints();
  }, []);

  async function fetchAllSprints() {
    setLoading(true);
    const activeSprintId = await _fetch("activeSprintId");
    setActiveSprint(activeSprintId);
    const getAllSprints = await _fetch("getAllSprints");
    setSprints(getAllSprints);
    const allTickets = await _fetch("getAllTickets");
    setTickets(allTickets);

    setLoading(false);
  }

  const activateSprint = async (id) => {
    setStart(true);
    const responseData = await _transction("activeNewSprint", id);
    setResponse(responseData);
    fetchAllSprints();
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
  };
  return (
    <>
      {start && <TransctionModal response={response} modalClose={modalClose} />}
      <Grid container>
        <Grid item lg={1} md={1} sm={12} xs={12}></Grid>
        <Grid item lg={10} md={10} sm={12} xs={12} style={{ margin: 0 }}>
          {!loading ? (
            <BacklogList
              sprints={sprints}
              activateSprint={activateSprint}
              activeSprint={activeSprint}
              tickets={tickets}
            />
          ) : (
            <Loader count="1" xs={12} sm={12} md={12} lg={12} />
          )}
        </Grid>
        <Grid item lg={1} md={1} sm={12} xs={12}></Grid>
      </Grid>
    </>
  );
};
export default Sprint;
