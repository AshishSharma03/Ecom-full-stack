import { List,ListItem, Typography,TextField ,Button, Box, CircularProgress} from '@mui/material'
import React,{useEffect,useContext, useState} from 'react'
import Layout from '../components/Layout'
import { useRouter } from 'next/router';
import axios from 'axios';
import { Store } from '../utils/store';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';
function Register() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const router = useRouter();
    const { redirect} = router.query
    const { state , dispatch} = useContext(Store)
    const { userInfo } =  state;
    const [loadButton,setloadButton] = useState(false)
    useEffect(()=>{

        if(userInfo){
            router.push('/')
        }

    },[])
    
        const submitHandler = async ({name,email , password,confirmPassword }) =>{

            closeSnackbar();
         
            if(password !== confirmPassword){
              enqueueSnackbar(
                `passwords don't match`,
                 { variant: 'error' }
               )
           
                return;
            }
            console.log(name,email,password)

            try {
                const {data} = await axios.post('/api/users/register',{
                  name,
                  email,
                  password,
                });
                // console.log(data)
                dispatch({ type: 'USER_LOGIN', payload: data});
                Cookies.set('userInfo',JSON.stringify(data));
                router.push('/');
                enqueueSnackbar(
                 `Welcome ${name}`,
                  { variant: 'success' }
                )
              } catch (err) { 
                enqueueSnackbar(
                  err.response ? err.response.data :err.message,
                  { variant: 'error' }
                )
              }
            
        }

  return (
    <Layout title="register">
      <Box  sx={{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"75vh"}}>
            <form  style={{width:"400px"}}onSubmit={handleSubmit(submitHandler)}>
                <Typography>Register</Typography>
                <List>
                    <ListItem>
                    <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="name"
                  label="Name"
                  inputProps={{ type: 'name' }}
                  error={Boolean(errors.name)}
                  helperText={
                    errors.name
                      ? errors.name.type === 'minLength'
                        ? 'Name length is more than 1'
                        : 'Name is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
                    </ListItem>
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
                  inputProps={{ type: 'email' }}
                  error={Boolean(errors.email)}
                  helperText={
                    errors.email
                      ? errors.email.type === 'pattern'
                        ? 'Email is not valid'
                        : 'Email is required'
                      : ''
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
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password
                      ? errors.password.type === 'minLength'
                        ? 'Password length is more than 5'
                        : 'Password is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
          <Controller
              name="confirmPassword"
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
                  id="confirmPassword"
                  label="Confirm Password"
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.confirmPassword)}
                  helperText={
                    errors.confirmPassword
                      ? errors.confirmPassword.type === 'minLength'
                        ? 'Confirm Password length is more than 5'
                        : 'Confirm  Password is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Button  disabled={loadButton} sx={{fontWeight:"600",padding:"10px", display:"flex",alignItems:'center',justifyContent:'center'}}variant="contained" type="submit" fullWidth color="primary">
            {(!loadButton)?"Sign up":<CircularProgress thickness={6} size="25px" />}
            </Button>
          </ListItem>
          <ListItem>
            Already have an account? &nbsp;
            <Typography component={'a'} href={`/LogIn?redirect=${redirect || '/'}`} >
              Login
            </Typography>
          </ListItem>
        </List>
      </form>
      </Box>
    </Layout>
  )
}

export default Register