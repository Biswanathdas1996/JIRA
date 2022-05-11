import React, { useEffect } from "react";
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

import { TextData } from "./FunctionalTexts";
import { ActionText } from "./Actiontext";
import { actionFunctions } from "./Functions";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";

const wordOfIdentification = "for me";

const VoiceFile = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  let history = useNavigate();

  useEffect(() => {
    if (transcript) {
      debounce_fun(transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);
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
        resetTranscript();
        const findAction = _.words(transcript, wordOfIdentification);
        if (findAction.length === 0) {
          history(shortScore[0]?.nav);
        } else {
          // return;
          console.log("---f--->", shortScore[0]);
          actionFunctions(history, shortScore[0]?.action);
        }
        return;
      } else {
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
    <div style={{ display: "flex", alignItems: "center" }}>
      <Typography variant="h6" component="div" style={{ color: "red" }}>
        {transcript}
      </Typography>

      <Box sx={{ display: { xs: "none", sm: "none", md: "flex", lg: "flex" } }}>
        {iconActionUI()}
      </Box>

      <Box sx={{ display: { xs: "flex", sm: "flex", md: "none", lg: "none" } }}>
        <Fab sx={fabStyle} variant="extended" aria-label="add">
          {iconActionUI()}
        </Fab>
      </Box>
    </div>
  );
};
export default VoiceFile;
