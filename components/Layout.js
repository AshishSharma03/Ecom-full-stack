"use client";
import React, { useContext } from "react";
import Head from "next/head";
import {
  AppBar,
  Typography,
  Toolbar,
  Badge,
  Button,
  Container,
  IconButton,
  Box,
} from "@mui/material";
import { Store } from "../utils/store";
import Cookies from "js-cookie";
import Link from "next/link";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useRouter } from "next/router";

function Layout({ title, description, children }) {
  const { state, dispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const router = useRouter(); 
  const logOut = () => {
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("userInfo");
    Cookies.remove("cartItems");
    Cookies.remove("shippingAddress");
  };

  return (
    <>

      <Head>
        <title>{title ? `${title} - Mysite` : "MySite"}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <AppBar position="static" sx={{ boxShadow: "none" }}>
        <Toolbar sx={{ background: "#fff", gap: "15px" }}>
          <Typography
            component={Link}
            href="/"
            sx={{
              paddingRight: "20px",
              textDecoration: "none",
              fontWeight: "800",
              fontSize:"20px"
            }}
          >
           Vintage
          </Typography>
          
          <Box component="span" sx={{ flex: 1 }} />
            <Badge color="secondary" badgeContent={cart?.cartItems.length}>
          <IconButton onClick={()=>{router.push('/carts')}}>
              <ShoppingCartOutlinedIcon />
          </IconButton>
            </Badge>

          {userInfo ? (
            <Button onClick={logOut} variant="contained">
              Log out
            </Button>
          ) : ( 
              <Button onClick={()=>{router.push('/LogIn')}} variant="contained">Log in</Button>
         )}
        </Toolbar>
      </AppBar>
      <Container>{children}</Container>
    </>
  );
}

export default Layout;
