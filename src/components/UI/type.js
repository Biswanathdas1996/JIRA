import * as React from "react";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PestControlIcon from "@mui/icons-material/PestControl";
export default function TypeUI({ type }) {
  return (
    <>
      {type === "bug" ? (
        <PestControlIcon sx={{ color: "red" }} fontSize="small" />
      ) : (
        <BookmarkIcon sx={{ color: "green" }} fontSize="small" />
      )}
    </>
  );
}
