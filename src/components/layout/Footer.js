import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Toolbar } from "@mui/material";
import PwcLogo from "../../assets/images/nft.png";

function Copyright() {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      fontWeight="600"
    >
      {/* <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "} */}
      {"© "}
      {new Date().getFullYear()}
      {" - 2023"}
      {"  . All rights reserved. "}
    </Typography>
  );
}

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#F1F7FD",
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar>
          <Link
            href="https://www.pwc.com/"
            style={{ textDecoration: "none", marginRight: "30px" }}
          >
            <img src={PwcLogo} height={"60px"} width={"60px"} alt="img" />
          </Link>

          <Copyright />
        </Toolbar>
      </Container>
    </Box>
  );
}

export default Footer;
