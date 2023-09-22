import React , {useContext} from 'react'
import {Store} from '../utils/store'
import Layout from  '../components/Layout'
import dynamic from 'next/dynamic'

import { useRouter } from 'next/router';
import Image from 'next/image'
import  {Grid, Typography , TableContainer, Table, TableHead ,TableRow ,TableCell,TableBody,Card,List,ListItem,Button,MenuItem,Select, IconButton, Stack, Box} from '@mui/material'
import axios from 'axios'
import { DeleteOutline } from '@mui/icons-material';

 function Carts() {
  const router = useRouter();
   const { state, dispatch } = useContext(Store)
 const {
     cart: { cartItems} 
 } = state;

  const updateCartHandler = async (item , quantity)=>{
 
  const {data} = await axios.get(`/api/products/`)
  const ss =  data.find(k => k._id === item._id ? k._id : '')
  // console.log(ss)
     
     if(data.countInStock <=0){
    window.alert('Sorry. product is out of stock');
    return;
  }
  dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });


  }

  const removeItemhandler = ( item ) => {
   dispatch({type : 'CART_REMOVE_ITEM',payload : item});
  }

  const checkoutHandler = () => {
    router.push('/shipping');
  };


  return (
    <Layout title="Shopping Cart">
      <Box sx={{minHeight:"80vh"}}>
            <Typography component={"h1"} variant="h1 ">Your Cart items  </Typography>
            {cartItems.length === 0 ?(<>
                cart is empty
            </>):(
                <>
                 <Grid container spacing={5}>
          <Grid item md={9} xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{fontWeight:"600",color:"#CBCBCB"}}>Image</TableCell>
                    <TableCell sx={{fontWeight:"600",color:"#CBCBCB"}}>Name</TableCell>
                    <TableCell sx={{fontWeight:"600",color:"#CBCBCB"}} align="right">Quantity</TableCell>
                    <TableCell sx={{fontWeight:"600",color:"#CBCBCB"}} align="right">Price</TableCell>
                    <TableCell sx={{fontWeight:"600",color:"#CBCBCB"}} align="right">Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item._id} sx={{'&:hover':{background:"#EEEEEE"}}}>
                      <TableCell>
                        
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            ></Image>
                     
                      </TableCell>

                      <TableCell>
               
                          
                            <Typography >{item.name}</Typography>
                     
                    
                      </TableCell>
                      <TableCell align="right">
                        <Select  value={item.quantity} onChange={(e) => updateCartHandler(item , e.target.value)}>
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <MenuItem  key={x + 1} value={x + 1}>
                              {x + 1}
                            </MenuItem>
                          ))}
                        </Select>
                        
                      </TableCell>
                      <TableCell align="right" sx={{fontWeight:"800",fontSize:"16px"}}>{item.price} rs/-</TableCell>
                      <TableCell align="right">
                        <IconButton variant="contained" color="secondary"  onClick={()=> removeItemhandler(item)}>
                          <DeleteOutline/>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Typography variant="h6" sx={{fontWeight:"600"}}>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items) :
                      <spn style={{color:"#00AF3A"}}>
                    {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)} rs/-
                      </spn>
                  </Typography>
                </ListItem>
                <ListItem>
                  <Button sx={{fontWeight:"600"}} variant="contained" color="primary" fullWidth onClick={checkoutHandler}>
                    Check Out
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
                </>
            )}
            </Box>
    </Layout>
  )
}


export default dynamic(() =>
  Promise.resolve(Carts), {ssr:false
})