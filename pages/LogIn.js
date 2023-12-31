import { Box, Button, CircularProgress, List, ListItem, TextField, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Store } from "../utils/store";
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useSnackbar } from "notistack";
import { Controller, useForm } from "react-hook-form";

function LogIn() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { redirect } = router.query; // login?redirect=/shipping
  const { state, dispatch } = useContext(Store);
  const [loadButton,setloadButton] = useState(false)
  const { userInfo } = state;
  useEffect(() => {
    if (userInfo) {
      router.push("/");
    }
  }, []);

  const submitHandler = async ({ email, password }) => {
    setloadButton(true)
    console.log(email, password);
    closeSnackbar();
    try {
      const { data } = await axios.post("/api/users/login", {
        email,
        password,
      });

      dispatch({ type: "USER_LOGIN", payload: data });
      setloadButton(false)
      Cookies.set("userInfo", JSON.stringify(data));
      router.push(redirect || "/");
      enqueueSnackbar("Log in", { variant: "success" });

    } catch (err) {
      setloadButton(false)
      enqueueSnackbar(
        err.response.data ? err.response.data.message : err.message,
        { variant: "error" }
      );
    
    }
  };
  return (
    <Layout title="Login">
      <Box sx={{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"75vh"}}>

      
      <form style={{width:"400px"}} onSubmit={handleSubmit(submitHandler)}>
        <Typography variant="h4">Login</Typography>
        <List>
          <ListItem>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="email"
                  label="Email"
                  inputProps={{ type: "email" }}
                  error={Boolean(errors.email)}
                  helperText={
                    errors.email
                      ? errors.email.type === "pattern"
                        ? "Email is not valid"
                        : "Email is required"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="password"
                  label="Password"
                  inputProps={{ type: "password" }}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password
                      ? errors.password.type === "minLength"
                        ? "Password length is more than 5"
                        : "Password is required"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Button disabled={loadButton} sx={{fontWeight:"600",padding:"10px", display:"flex",alignItems:'center',justifyContent:'center'}} variant="contained" type="submit" fullWidth color="primary">
              {(!loadButton)?"Login":<CircularProgress thickness={6} size="25px" />}
            </Button>
          </ListItem>
          <ListItem>
            {"Don't have an account?"} &nbsp;
            <Typography component={'a'} href="/register">Register</Typography>
          </ListItem>
        </List>
      </form></Box>
    </Layout>
  );
}

export default LogIn;
