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

import { createTicket } from "./Functions";

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
      const findAction = _.words(transcript, "please");
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

        actions(shortScore[0]);
        return;
      } else {
      }
    }
  }, 2000);

  const actions = (data) => {
    const findAction = _.words(transcript, "please");
    if (findAction.length === 0) {
      history(data?.nav);
    } else {
      console.log("------>", data);

      createTicket(history);
    }
    return;
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Typography variant="h6" component="div" style={{ color: "red" }}>
        {transcript}
      </Typography>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        color="info"
        onClick={SpeechRecognition.startListening}
      >
        {!listening ? <MicIcon /> : <CampaignIcon />}
      </IconButton>
    </div>
  );
};
export default VoiceFile;
