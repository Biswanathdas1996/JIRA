import React from "react";
import { Chart } from "react-google-charts";

export default function BurnDownchart() {
  const totalNoOfDays = 15;
  const totalStoryPoint = 30;

  let items = [];
  let ideaValue = 30;
  let actualValue = 28;
  for (let i = 0; i < totalNoOfDays; i++) {
    ideaValue = ideaValue - totalStoryPoint / totalNoOfDays;
    actualValue = actualValue - 1;
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
