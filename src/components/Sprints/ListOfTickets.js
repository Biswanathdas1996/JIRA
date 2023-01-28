import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import TicketCard from "../../components/shared/TicketCard";
import AssignTickets from "./AssignTickets";
import AssignSprint from "./AssignSprint";
import { _fetch } from "../../CONTRACT-ABI/connect";
import { Grid } from "@mui/material";

export default function CheckboxListSecondary({ data, sprints }) {
  const [users, setusers] = useState([]);
  const [totalUserCount, setTotalUserCount] = useState(0);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    const allUser = await _fetch("getAllUser");
    setTotalUserCount(allUser?.length);
    let tempUserData = [];
    await allUser.map(async (address) => {
      const result = await _fetch("users", address);
      tempUserData.push(result);
      setusers(tempUserData);
    });
  };

  return (
    <Grid fluid={true} container>
      {data?.map((value) => {
        return (
          <Grid item lg={6} md={6} sm={6} xs={6} style={{ paddingRight: 10 }}>
            <div style={{ marginBottom: 20 }}>
              <TicketCard
                item={value}
                showStatus={true}
                assignSprint={() =>
                  value?.sprintId === "" && (
                    <AssignSprint
                      index={value?.index}
                      item={value}
                      sprints={sprints}
                      getData={getData}
                    />
                  )
                }
              />
              {!value?.owner && value?.sprintId !== "" && (
                <AssignTickets
                  index={value?.index}
                  item={value}
                  totalUserCount={totalUserCount}
                  users={users}
                  getData={getData}
                />
              )}
            </div>
          </Grid>
        );
      })}
    </Grid>
  );
}
