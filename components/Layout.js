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
  Stack,
  Avatar,
} from "@mui/material";
import { Store } from "../utils/store";
import Cookies from "js-cookie";
import Link from "next/link";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useRouter } from "next/router";
import LogoutIcon from '@mui/icons-material/Logout';
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
        <title>{title ? `${title}_Vintage` : "Vintage"}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <AppBar position="static" sx={{ boxShadow: "none" ,padding:"20px",background:"#fff"}}>
        <Toolbar sx={{ background: "#fff", gap: "15px" }}>
          <Button
            onClick={()=>{router.push('/')}}
            sx={{
              paddingRight: "20px",
              textDecoration: "none",
              fontWeight: "800",
              fontSize:"20px",
              color:"#5400FF"
            }}
          >
           Vintage
          </Button>
          
          <Box component="span" sx={{ flex: 1 }} />
            <Badge color="secondary" badgeContent={cart?.cartItems.length}>
          <IconButton onClick={()=>{router.push('/carts')}}>
              <ShoppingCartOutlinedIcon />
          </IconButton>
            </Badge>

          {userInfo ? (
            <Stack direction={"row"} gap={1} alignItems={"center"}>
            
            <IconButton  >
              <Avatar>{userInfo.name[0]}</Avatar>
            </IconButton>
            <IconButton onClick={logOut} >
              <LogoutIcon/>
            </IconButton>
            </Stack>
          ) : ( 
              <Button onClick={()=>{router.push('/LogIn')}} variant="contained">Log in</Button>
         )}
        </Toolbar>
      </AppBar>
      <Container maxWidth={"xl"}>{children}</Container>
      <Box sx={{display:'flex',justifyContent:"center",gap:1,color:"#D1D1D1",alignItems:"center",padding:"20px",minHeight:"10vh"}}>
        <Typography sx={{fontSize:"13px"}}>Design by</Typography><Typography sx={{fontSize:"13px"}} component={'a'} href="https://github.com/AshishSharma03">Ashish Sharma</Typography>
      </Box>
    </>
  );
}

export default Layout;
