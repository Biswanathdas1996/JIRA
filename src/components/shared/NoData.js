import React from "react";
import { Typography, Stack } from "@mui/material";
import { TabPanel } from "@mui/lab";
import SpeakerNotesOffIcon from "@mui/icons-material/SpeakerNotesOff";

const Bid = ({ text }) => {
  return (
    <TabPanel
      value="3"
      sx={{ backgroundColor: "#F0F6FF", width: "100%", height: 380 }}
    >
      <Stack
        direction="Column"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "Center",
          p: 5,
        }}
      >
        <SpeakerNotesOffIcon sx={{ color: "#ABB2B9", fontSize: 60 }} />
        <Typography
          sx={{
            color: "#ABB2B9",
            fontSize: 14,
            fontWeight: "bold",
            marginTop: 5,
          }}
        >
          {text}
        </Typography>
      </Stack>
    </TabPanel>
  );
};

export default Bid;
