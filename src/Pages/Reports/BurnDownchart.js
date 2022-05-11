/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { _fetch, _transction } from "../../CONTRACT-ABI/connect";

const totalNoOfDays = 15;

export default function BurnDownchart() {
  const [storyPointArray, setStoryPointArray] = useState([]);
  const [columns, setColumns] = useState([]);
  const [user, setUser] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchData() {
    setLoading(true);
    const activeSprintId = await _fetch("activeSprintId");
    const allTickets = await _fetch("getAllTickets");
    const filterTicketsForCurrentUser = await allTickets.filter(
      (ticket) => ticket?.sprintId === activeSprintId
    );
    const storyPoints = [];
    filterTicketsForCurrentUser.map(async (data) => {
      await fetch(data?.abiLink)
        .then((response) => response.json())
        .then((allData) => {
          storyPoints.push(allData?.storypoint);
          setStoryPointArray([...storyPoints]);
        });
    });
    setLoading(false);
  }

  let totalStoryPoint = 0;
  storyPointArray.map((count) => {
    totalStoryPoint += Number(count);
  });

  let items = [];
  let ideaValue = totalStoryPoint;
  let actualValue = totalStoryPoint;

  for (let i = 0; i <= totalNoOfDays; i++) {
    if (i === 0) {
      ideaValue = totalStoryPoint;
      actualValue = totalStoryPoint;
    } else {
      ideaValue = ideaValue - totalStoryPoint / totalNoOfDays;
      actualValue = actualValue - 1;
    }

    items.push([i, ideaValue, actualValue]);
  }

  console.log(items);

  const Columns = [["x", "Ideal", "actual"]];

  const totalData = [...Columns, ...items];

  const LineChartOptions = {
    hAxis: {
      title: "Time",
    },
    vAxis: {
      title: "Story Points",
    },
    series: {
      1: { curveType: "function" },
    },
  };

  return (
    <>
      <Chart
        width={"100%"}
        height={"500px"}
        chartType="LineChart"
        loader={<div>Loading Chart</div>}
        data={totalData}
        options={LineChartOptions}
        rootProps={{ "data-testid": "2" }}
      />
    </>
  );
}
