import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "react-bootstrap/Modal";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import ListItemText from "@mui/material/ListItemText";
import { ViewTransctionDetailsLink } from "../../config";
const steps = ["Initiating", "Waiting for confirmation", "Transction complete"];

export default function TransctionModal({ response, setStart, modalClose }) {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
    modalClose();
  };

  const domData = response?.error ? response.error.receipt : response;
  return (
    <div>
      <Modal
        show={open}
        size="lg"
        aria-labelledby="example-modal-sizes-title-lg"
        aria-describedby="modal-modal-description"
      >
        <div style={{ padding: "2rem" }}>
          <Stepper activeStep={domData ? 3 : 1} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <center>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              style={{ marginTop: 30 }}
            >
              {domData ? (
                domData?.status ? (
                  <b style={{ color: "green" }}>Transction complete</b>
                ) : (
                  <b style={{ color: "red" }}>Transction failed</b>
                )
              ) : (
                "Waiting for confirmation"
              )}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {domData
                ? "Transactions request complete."
                : "Transactions have been initiated. Waiting for confirmation."}
            </Typography>

            {domData && (
              <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary="Transaction hash"
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: "19rem",
                        }}
                      >
                        <a
                          href={ViewTransctionDetailsLink(
                            domData?.transactionHash
                          )}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              width: "11rem",
                            }}
                          >
                            {domData?.transactionHash}
                          </Typography>
                        </a>
                      </Typography>
                    }
                  />
                </ListItem>

                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary="Block hash"
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: "11rem",
                        }}
                      >
                        {domData?.blockHash}
                      </Typography>
                    }
                  />
                </ListItem>

                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary="Block number"
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: "11rem",
                        }}
                      >
                        {domData?.blockNumber}
                      </Typography>
                    }
                  />
                </ListItem>

                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary="Transction from"
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: "11rem",
                        }}
                      >
                        {domData?.from}
                      </Typography>
                    }
                  />
                </ListItem>

                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary="Transction to"
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: "11rem",
                        }}
                      >
                        {domData?.to}
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            )}

            {domData ? (
              <Button
                variant="contained"
                onClick={(e) => handleClose()}
                style={{ marginTop: 20 }}
              >
                Close
              </Button>
            ) : response?.error?.code === 4001 ? (
              <>
                <p style={{ color: "red", marginTop: 20 }}>
                  {response?.error?.message}
                </p>
                <Button
                  variant="contained"
                  onClick={(e) => handleClose()}
                  style={{ marginTop: 20 }}
                >
                  Close
                </Button>
              </>
            ) : (
              <CircularProgress style={{ marginTop: 30 }} />
            )}
          </center>
        </div>
      </Modal>
    </div>
  );
}
