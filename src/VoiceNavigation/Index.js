/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import _ from "lodash";
import StringSimilarity from "string-similarity";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import CampaignIcon from "@mui/icons-material/Campaign";
import Modal from "react-bootstrap/Modal";
import Button from "@mui/material/Button";
import { TextData } from "./FunctionalTexts";
import { ActionText } from "./Actiontext";
import { actionFunctions } from "./Functions";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import ListGroup from "react-bootstrap/ListGroup";

const wordOfIdentification = "for me";
var base_url = window.location.origin;

const VoiceFile = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = (shortScore) => {
    setShow(true);
    console.log(shortScore);
    setData(shortScore);
  };

  let history = useNavigate();

  useEffect(() => {
    if (transcript && !listening) {
      debounce_fun(transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript, listening]);
  // throttle
  const debounce_fun = _.debounce(function (transcript) {
    if (transcript) {
      let search;
      const findAction = _.words(transcript, wordOfIdentification);
      if (findAction.length === 0) {
        search = TextData?.map((data) => {
          return {
            nav: data?.nav,
            score: StringSimilarity.compareTwoStrings(data?.text, transcript),
            page: data?.page,
          };
        });
      } else {
        search = ActionText?.map((data) => {
          return {
            action: data?.action,
            score: StringSimilarity.compareTwoStrings(data?.text, transcript),
          };
        });
      }

      const shortScore = search.sort(function (a, b) {
        return b?.score - a?.score;
      });

      if (shortScore[0]?.score > 0) {
        console.log("---f--->", shortScore[0].score);
        resetTranscript();
        if (shortScore[0].score < 0.45) {
          handleShow(shortScore);
        } else {
          handleClose();
          const findAction = _.words(transcript, wordOfIdentification);
          if (findAction.length === 0) {
            history(shortScore[0]?.nav);
          } else {
            actionFunctions(history, shortScore[0]?.action);
          }
          return;
        }
      }
    }
  }, 2000);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const iconActionUI = () => (
    <IconButton
      size="large"
      aria-label="account of current user"
      aria-controls="menu-appbar"
      aria-haspopup="true"
      color="info"
      onClick={SpeechRecognition.startListening}
      // onClick={SpeechRecognition.startListening({
      //   continuous: true,
      // })}
    >
      {!listening ? <MicIcon /> : <CampaignIcon />}
    </IconButton>
  );

  const fabStyle = {
    position: "fixed",
    bottom: 16,
    right: 16,
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Are you lookig for </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <ListGroup>
            {data?.slice(0, 6).map((val, index) => {
              if (val?.nav) {
                return (
                  <ListGroup.Item
                    onClick={() => {
                      history(val?.nav);
                      handleClose();
                    }}
                    key={index}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">{val?.page}</div>
                      <small style={{ color: "#1976d2" }}>
                        {" "}
                        {base_url + val?.nav}
                      </small>
                    </div>
                  </ListGroup.Item>
                );
              }
            })}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h6" component="div" style={{ color: "red" }}>
          {transcript}
        </Typography>

        <Box
          sx={{ display: { xs: "none", sm: "none", md: "flex", lg: "flex" } }}
        >
          {iconActionUI()}
        </Box>

        <Box
          sx={{ display: { xs: "flex", sm: "flex", md: "none", lg: "none" } }}
        >
          <Fab sx={fabStyle} variant="extended" aria-label="add">
            {iconActionUI()}
          </Fab>
        </Box>
      </div>
    </>
  );
};
export default VoiceFile;
