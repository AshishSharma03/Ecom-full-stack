import React,{useContext} from 'react'
import {useRouter} from "next/router"
// import data from '../../utils/data';
import Layout from '../../components/Layout';
import { Typography ,Grid, List, ListItem, Button } from '@mui/material';
import Image from 'next/image';
import dbConnect from '../../utils/db';
import Product from '../../model/Product';
import axios from 'axios';
import {Store } from '../../utils/store'

function ProductScreen(props) {
    
    const router = useRouter();
    // const {slug} = router.query;
    const {state,dispatch} = useContext(Store)
    const {product} = props

    

    if(!product){
      return( <> product not found </>)
    }

    const addToCartHandler = async ()=>{
      const existItem = state.cart.cartItems.find((x) => x._id === product._id)
      const quantity = existItem ? existItem.quantity + 1 : 1 ;
      const {data} = await axios.get(`/api/products/`)
      const ss =  data.find(k => k._id === product._id ? k._id : '')
      console.log(ss)
 
         
         if(data.countInStock <=quantity){
        window.alert('Sorry. product is out of stock');
        return;
      }
      dispatch({type: 'CART_ADD_ITEM',payload:{...product,quantity: 1}});
        router.push('/carts')
    }

  return (
    <Layout title={product.name} description={product.name}>
        <div style={{padding:"20px"}}>
          
            <Typography component={'a'} href={"/"} > Back to product</Typography>
        
        </div>
        <Grid container spacing={2}>
            <Grid item md ={6}>
                <Image src={product.image} alt={product.name} width={640} height={640}></Image>
            </Grid>
            <Grid item md={3} xs={12} >
                <List>
                    <ListItem>
                      <Typography component="h1" sx={{fontSize:"30px",fontWeight:"bold"}}>{product.name}</Typography>
                    </ListItem>
                    <ListItem>
                      <Typography component="h2">{product.description}</Typography>
                    </ListItem>
                    <ListItem>
                      <Typography component="h2"> category : {product.category}</Typography>
                    </ListItem>
                    <ListItem>
                      <Typography component="h2">bard : {product.brand}</Typography>
                    </ListItem>
                    <ListItem>
                      <Typography component="h2" sx={{fontSize:"20px",fontWeight:"bold"}}>{product.price} Rs/-</Typography>
                    </ListItem>
                  <ListItem>
                    <Grid container>
                        <Grid item xs={6}>
                            <Typography>Status :- </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>
                              {product.countInStock > 0 ? `In Stock` : `Unavilable`}
                            </Typography>
                        </Grid>
                    </Grid>
                  </ListItem>
                    <ListItem>
                      <Button
                      onClick = {addToCartHandler}
                      >Add to Cart</Button>
                    </ListItem>
                </List>
            </Grid>
            <Grid item xs={6}>
                
            </Grid>

            
        </Grid>
    </Layout>
  )
}


function convertDocToObj(doc) {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
}



export async function getServerSideProps(context){
  const {params} = context;
  const {slug} = params 

  await dbConnect();
  const product = await Product.findOne({slug}).lean()
  //  product.map((e) =>  console.log(e.name))
  // console.log(product.name)
  return {props : {product :convertDocToObj(product)}};
}

export default ProductScreen;