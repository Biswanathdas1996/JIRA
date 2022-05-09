import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import UserImage from "../shared/GetUserImage";

export default function FolderList({ tickets }) {
  let comments = [];
  if (tickets?.comments) {
    comments = JSON.parse(tickets.comments);
  }

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {comments &&
        comments.map((data, index) => {
          const comments = JSON.parse(data);

          return (
            <ListItem>
              <ListItemAvatar style={{ marginRight: 10 }}>
                <UserImage uid={comments?.uid} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <div
                    className="html-tracking-div"
                    dangerouslySetInnerHTML={{ __html: comments?.comments }}
                  ></div>
                }
                secondary={comments?.time}
              />
            </ListItem>
          );
        })}
    </List>
  );
}
