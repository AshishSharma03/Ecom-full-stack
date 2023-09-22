import { createTheme } from '@mui/material/styles';


const theme = createTheme({
  palette: {
    mode: 'light',
    primary:{
      main : '#5400FF',
      dark :  "#5500FF"
    },
    secondary :{
      main :"#5400FF",
    },
  
  },

    typography:{
      fontFamily: 'sans-serif'
    }


  
 
});

export default theme;