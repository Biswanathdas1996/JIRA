import React, { useState, useEffect } from "react";
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
import SearchBar from "../shared/SearchBar";
import PwcLogo from "../../assets/images/nft.png";
import { Avatar } from "@mui/material";
import { _account, _fetch } from "../../CONTRACT-ABI/connect";

const pages = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "My profile",
    href: "/profile",
  },
];

const Header = () => {
  const [account, setAccount] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  let history = useNavigate();

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const account = await _account();
    const user = await _fetch("users", account);
    setAccount(user);
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";

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
      <MenuItem>
        <Link to="/profile">My Profile</Link>
      </MenuItem>

      <MenuItem>
        <Link href="/create-ticket">Create</Link>
      </MenuItem>
      <MenuItem>
        <p>Sign In</p>
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
          <img
            src={PwcLogo}
            height={"60px"}
            width={"60px"}
            alt="logo"
            onClick={() => history("/")}
          />

          <Button disabled>
            <SearchBar />
          </Button>

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
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {account?.name ? (
              <>
                <Button
                  type="button"
                  variant="contained"
                  sx={{
                    marginRight: "20px",
                    textTransform: "none",
                  }}
                  onClick={() => history("/create-ticket")}
                >
                  Create
                </Button>
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
              </>
            ) : (
              <Button
                aria-controls={menuId}
                variant="outlined"
                sx={{ textTransform: "none" }}
                onClick={() => history("/register")}
              >
                Register
              </Button>
            )}
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
