import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import CreateSprints from "../components/Sprints/CreateSprints";
import ListAllSprints from "../components/Sprints/ListAllSprints";
import { _fetch, _transction } from "../CONTRACT-ABI/connect";
import TransctionModal from "../components/shared/TransctionModal";

const Sprint = () => {
  const [sprints, setSprints] = useState([]);
  const [activeSprint, setActiveSprint] = useState(null);
  const [response, setResponse] = useState(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    fetchAllSprints();
  }, []);

  async function fetchAllSprints() {
    const activeSprintId = await _fetch("activeSprintId");
    setActiveSprint(activeSprintId);
    const getAllSprints = await _fetch("getAllSprints");
    setSprints(getAllSprints);
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
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item lg={2} md={2} sm={12} xs={12}></Grid>
        <Grid item lg={8} md={8} sm={12} xs={12}>
          <div style={{ margin: 20 }}>
            <CreateSprints fetchAllSprints={fetchAllSprints} />
            <br />
            <ListAllSprints
              sprints={sprints}
              activateSprint={activateSprint}
              activeSprint={activeSprint}
            />
          </div>
        </Grid>
        <Grid item lg={2} md={2} sm={12} xs={12}></Grid>
      </Grid>
    </>
  );
};
export default Sprint;