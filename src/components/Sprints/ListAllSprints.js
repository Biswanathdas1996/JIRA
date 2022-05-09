import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Card } from "@mui/material";
import { Button } from "@mui/material";
import ListOfTickets from "./ListOfTickets";

export default function ListAllSprints({
  sprints,
  activeSprint,
  activateSprint,
  tickets,
}) {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Card
      style={{
        padding: "20px",
      }}
    >
      <h4>All Sprints</h4>
      {sprints?.length > 0 &&
        sprints.map((sprint, index) => {
          const filterTicketsForCurrentUser = tickets.filter(
            (ticket) => ticket?.sprintId === sprint?.id
          );

          return (
            <Accordion
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              style={{ marginTop: 20, backgroundColor: "#8b86862b" }}
              key={`sprints_${index}`}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography sx={{ width: "33%", flexShrink: 0 }}>
                  SPRINT - {sprint?.id}
                </Typography>

                <Typography
                  sx={{ color: "text.secondary" }}
                  style={{
                    fontSize: 15,
                    marginLeft: 10,
                    float: "right",
                    color: "green",
                  }}
                >
                  {activeSprint === sprint?.id && (
                    <b>Currently Active Sprint</b>
                  )}
                  {activeSprint !== sprint?.id && (
                    <Button
                      type="button"
                      variant="contained"
                      sx={{
                        margin: "12px",
                        textTransform: "none",
                        float: "right",
                      }}
                      onClick={() => activateSprint(sprint?.id)}
                    >
                      Start Sprint
                    </Button>
                  )}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  <Typography style={{ fontSize: 12, margin: 10 }}>
                    Start Date: <b>{sprint?.startDate}</b>
                  </Typography>
                  <Typography style={{ fontSize: 12, margin: 10 }}>
                    Ended on: <b>{sprint?.enddate}</b>
                  </Typography>
                </div>

                <ListOfTickets data={filterTicketsForCurrentUser} />
              </AccordionDetails>
            </Accordion>
          );
        })}
    </Card>
  );
}
