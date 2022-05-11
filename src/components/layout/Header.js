import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Button } from "@mui/material";
import Link from "@material-ui/core/Link";
import { useNavigate } from "react-router-dom";
// import SearchBar from "../shared/SearchBar";
import { Avatar } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import Typography from "@mui/material/Typography";
import { AccountContext } from "../../App";
import VoiceNav from "../../VoiceNavigation/Index";

const pages = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "My profile",
    href: "/profile",
  },
  {
    label: "Backlog",
    href: "/backlog",
  },
  {
    label: "Sptints",
    href: "/sprints",
  },
  {
    label: "Burn Down",
    href: "/report",
  },
  {
    label: "Confluence",
    href: "/confluence",
  },
];

const Header = () => {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  let history = useNavigate();
  const { account, fetchUserData, projectData } = useContext(AccountContext);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const logout = () => {
    localStorage.clear();
    fetchUserData();
    history("/login");
    return;
  };

  const menuId = "primary-search-account-menu";

  const DynamicAuthUI = () => (
    <>
      {account?.name ? (
        <>
          <Avatar
            alt="Remy Sharp"
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
            }}
            src={account?.profileImg}
          ></Avatar>
          <p style={{ color: "black", margin: 10, fontWeight: "bold" }}>
            {account?.name}
          </p>
          <Button
            aria-controls={menuId}
            variant="outlined"
            sx={{ textTransform: "none" }}
            style={{ marginLeft: 10 }}
            onClick={() => logout()}
          >
            <LogoutIcon />
          </Button>
        </>
      ) : (
        <>
          <Button
            aria-controls={menuId}
            variant="contained"
            sx={{ textTransform: "none" }}
            style={{ marginRight: 10 }}
            onClick={() => history("/login")}
          >
            Login
          </Button>
          <Button
            aria-controls={menuId}
            variant="outlined"
            sx={{ textTransform: "none" }}
            onClick={() => history("/register")}
          >
            Register
          </Button>
        </>
      )}
    </>
  );

  //  MENU itemssss
  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {pages.map(({ label, href }) => (
        <MenuItem
          onClick={() => {
            handleMobileMenuClose();
            history(href);
          }}
        >
          {label}
        </MenuItem>
      ))}

      <MenuItem>
        <Link href="/create-ticket">Create Story</Link>
      </MenuItem>
      <MenuItem>
        <DynamicAuthUI />
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          padding: "15px",
          backgroundColor: "white",
        }}
        //   color="red"
      >
        <Toolbar>
          <Typography
            className="project-name"
            style={{ fontSize: 16, fontWeight: "bold" }}
          >
            {projectData?.projectName}
          </Typography>

          {/* <Button disabled>
            <SearchBar />
          </Button> */}

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              marginLeft: "10px",
            }}
          >
            {pages.map(({ label, href }) => (
              <Button
                type="button"
                key={label}
                onClick={() => history(href)}
                sx={{
                  my: 2,
                  color: "black",
                  fontWeight: "bold",
                  display: "block",
                  textTransform: "none",
                }}
              >
                {label}
              </Button>
            ))}
            {account?.name && (
              <Button
                type="button"
                variant="contained"
                sx={{
                  margin: "12px",
                  textTransform: "none",
                }}
                onClick={() => history("/create-ticket")}
              >
                Create
              </Button>
            )}
          </Box>

          <Box sx={{ flexGrow: 1 }} />
          <VoiceNav />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <DynamicAuthUI />
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
              sx={{ color: "black" }}
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {renderMobileMenu}
    </Box>
  );
};

export default Header;
