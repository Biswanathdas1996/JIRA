import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import { _fetch } from "../CONTRACT-ABI/connect";
import Board from "../components/Board";

function Dashboard() {
  const [users, setusers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllUser();
  }, []);

  async function fetchAllUser() {
    setLoading(true);
    const allUser = await _fetch("getAllUser");
    setusers(allUser);
    setLoading(false);
  }

  return (
    <Container>
      {users.map((address, index) => {
        return <Board address={address} />;
      })}
    </Container>
  );
}

export default Dashboard;
