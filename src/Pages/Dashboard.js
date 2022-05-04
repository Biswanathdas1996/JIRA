import React, { useEffect, useState } from "react";
import { _fetch } from "../CONTRACT-ABI/connect";
import Board from "../components/Board";
import Loader from "../components/shared/Loader";
import NoData from "../components/shared/NoData";
import Box from "@mui/material/Box";
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
    <Box
      sx={{
        pt: 4,
        pb: 2,
        mx: 12,
      }}
    >
      {loading && <Loader count="5" xs={12} sm={2.4} md={2.4} lg={2.4} />}
      {users.map((address, index) => {
        return <Board address={address} key={`user_${index}`} />;
      })}

      {!loading && users?.length === 0 && <NoData text="No user added" />}
    </Box>
  );
}

export default Dashboard;
