import React, { useState, useEffect } from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import Typography from "@mui/material/Typography";
import { _fetch } from "../../CONTRACT-ABI/connect";
import UserImage from "../shared/GetUserImage";

export default function CustomizedTimeline({ tokenId }) {
  const [ticketTrack, setTicketTrack] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setLoading(true);
    const allTickets = await _fetch("getAllTickets");
    const filterTicketsForCurrentUser = await allTickets.find(
      (ticket) => ticket.id === tokenId
    );
    if (filterTicketsForCurrentUser?.tracking) {
      setTicketTrack(JSON.parse(filterTicketsForCurrentUser?.tracking));
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "white",
      }}
    >
      <h4> History</h4>
      {!loading && (
        <Timeline>
          {ticketTrack &&
            ticketTrack.map((data, index) => {
              return (
                <TimelineItem>
                  <TimelineOppositeContent
                    sx={{ m: "auto 0" }}
                    align="right"
                    variant="body2"
                    color="text.secondary"
                  >
                    {data?.time}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector />

                    {/* <FastfoodIcon /> */}
                    <UserImage uid={data?.updatedBy} />

                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent sx={{ py: "12px", px: 2 }}>
                    <Typography
                      variant="h6"
                      component="span"
                      style={{ fontSize: 15 }}
                    >
                      <div
                        className="html-tracking-div"
                        dangerouslySetInnerHTML={{ __html: data?.status }}
                      ></div>
                    </Typography>
                    <Typography></Typography>
                  </TimelineContent>
                </TimelineItem>
              );
            })}
        </Timeline>
      )}
    </div>
  );
}
