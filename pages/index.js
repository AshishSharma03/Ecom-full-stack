"use client"
import  React ,{useState} from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import data from '../utils/data';
import dbConnect from '../utils/db';
import Product from '../model/Product';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Store } from '../utils/store';
import { useSnackbar} from 'notistack';

 function Index(props) {

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
   const router = useRouter();
   const { state, dispatch } = useContext(Store);  
   const {products } = props
   const {cart} = state;

   console.log(products)
  const addToCartHandler = async (product)=>{
 
    const {data} = await axios.get(`/api/products/`)
    // const ss =  data.find(k => k._id === product._id ? k._id : '')
       
       if(data.countInStock <=0){
      window.alert('Sorry. product is out of stock');
      return;
    }
    // console.log(cart.length)
    dispatch({type: 'CART_ADD_ITEM',payload:{...product,quantity: 1}});
      // router.push('/carts')

      enqueueSnackbar(
         `${product.name} Add In your cart!`,
         {
            anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
    }, 
           preventDuplicate: true, }
       )
  }
  return  (
    <Layout>

    
        <Grid container spacing={2}>
          {products.map((product,i)=>{
            return(<>
                 
                    <Grid item md={4} key={i} >
                        <Card>

                          <CardActionArea
                          onClick={()=>{router.push(`/product/${product.slug}`)}}
                          >
                            
                              <CardMedia
                              component="img"
                              image={product.image}
                              title={products.name}
                              >
                              </CardMedia>
                              <CardContent>
                                <Typography>
                                  {product.name}
                                </Typography>
                              </CardContent>
                          </CardActionArea>
                        
                          <CardActions>
                            <Typography sx={{fontWeight:"bold",fontSize:"20px"}}>{product.price}₹</Typography>
                          </CardActions>
                          <Button onClick={()=> addToCartHandler(product)}>
                            Add to cart
                          </Button>
                        </Card>
                    </Grid>
                    
                   </>)
          })}
      
        </Grid>
 
    </Layout>
  );
}

function convertDocToObj(doc) {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
}



export async function getServerSideProps(){
  await dbConnect();
  const product = await Product.find({}).lean()

  return {props : {products : product.map(convertDocToObj)}};
}

export default Index;