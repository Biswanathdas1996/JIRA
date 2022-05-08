import React, { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import { _fetch } from "../../CONTRACT-ABI/connect";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";

const UserImage = ({ uid }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    frtchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const frtchData = async () => {
    setLoading(true);

    const repoterData = await _fetch("users", uid);
    setUser(repoterData);
    setLoading(false);
  };

  return (
    <>
      {!loading ? (
        <Tooltip title={user?.name} arrow>
          <Avatar
            alt={user?.name}
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
            }}
            src={user?.profileImg}
            title={user?.name}
          ></Avatar>
        </Tooltip>
      ) : (
        <Skeleton animation="wave" />
      )}
    </>
  );
};

export default UserImage;
