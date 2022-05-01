import Profile1 from "../../assets/images/profile1.jpg";
import Profile2 from "../../assets/images/profile2.jpg";
import { Avatar, AvatarGroup, Tooltip, Grid } from "@mui/material";

const Avatars = ({ author }) => {
  return (
    <Grid container justify="flex-start">
      <AvatarGroup
        max={2}
        sx={{
          marginTop: "1px",
          mb: "10px",
          display: "flex",
        }}
      >
        <Tooltip title="Owner">
          <Avatar sx={{ width: 25, height: 25 }} alt="Owner" src={Profile1} />
        </Tooltip>
        <Tooltip title={author || "Author"}>
          <Avatar sx={{ width: 25, height: 25 }} alt="Author" src={Profile2} />
        </Tooltip>
      </AvatarGroup>
    </Grid>
  );
};

export default Avatars;
