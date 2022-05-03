import * as React from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";

export default function Priority({ priority }) {
  switch (priority) {
    case "blocker":
      return <RemoveCircleIcon sx={{ color: "red" }} fontSize="small" />;
    case "critical":
      return <LabelImportantIcon sx={{ color: "red" }} fontSize="small" />;
    case "high":
      return <ArrowUpwardIcon sx={{ color: "red" }} fontSize="small" />;
    case "medium":
      return <DensityMediumIcon sx={{ color: "orange" }} fontSize="small" />;
    case "low":
      return (
        <KeyboardDoubleArrowDownIcon sx={{ color: "info" }} fontSize="small" />
      );
    default:
      return <ArrowUpwardIcon sx={{ color: "red" }} fontSize="small" />;
  }
}
