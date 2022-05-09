import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import TicketCard from "../../components/shared/TicketCard";
import AssignTickets from "./AssignTickets";
import AssignSprint from "./AssignSprint";
import { _fetch } from "../../CONTRACT-ABI/connect";

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
    <List dense sx={{ width: "100%" }}>
      {data?.map((value) => {
        console.log(value);
        return (
          <div style={{ marginBottom: 20 }}>
            <TicketCard item={value} showStatus={true} />
            {!value?.owner && value?.sprintId !== "" && (
              <AssignTickets
                index={value?.index}
                item={value}
                totalUserCount={totalUserCount}
                users={users}
                getData={getData}
              />
            )}

            {value?.sprintId === "" && (
              <AssignSprint
                index={value?.index}
                item={value}
                sprints={sprints}
                getData={getData}
              />
            )}
          </div>
        );
      })}
    </List>
  );
}
