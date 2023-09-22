import { Button, Container, Stack,Typography } from '@mui/material'
import Head from 'next/head';
import React from 'react'
function About() {
  return (
    <>
    <Head>
        <title>Second page</title>
    </Head>
    <Container>
    <Stack  p={2} >
   
    <Typography component={'a'}  herf='/' variant='outlined' color='error'>
    Click to back 
    </Typography> 
   
    </Stack>
    </Container>
    </>
  )
}

export default About