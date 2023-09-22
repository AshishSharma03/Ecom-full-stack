import React, { useContext } from "react";
import { useRouter } from "next/router";
// import data from '../../utils/data';
import Layout from "../../components/Layout";
import {
  Typography,
  Grid,
  List,
  ListItem,
  Button,
  Box,
  Stack,
  Divider,
} from "@mui/material";
import dbConnect from "../../utils/db";
import Product from "../../model/Product";
import axios from "axios";
import { Store } from "../../utils/store";
import { AddShoppingCart } from "@mui/icons-material";

function ProductScreen(props) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { product } = props;

  if (!product) {
    return <> product not found </>;
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/`);
    const ss = data.find((k) => (k._id === product._id ? k._id : ""));
    console.log(ss);

    if (data.countInStock <= quantity) {
      window.alert("Sorry. product is out of stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity: 1 } });
    router.push("/carts");
  };

  return (
    <Layout title={product.name} description={product.name}>
      <div style={{ padding: "20px" }}>
        <Typography component={"a"} href={"/"}>
          {" "}
          Back to product
        </Typography>
      </div>
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Box sx={{ minHeight: "100vh" }}>
            <Box
              component={"img"}
              src={product.image}
              sx={{ width: "100%" }}
              alt={product.name}
            />
          </Box>
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Stack gap={1}>
            <Typography
              component="h1"
              sx={{ fontSize: "30px", fontWeight: "bold" }}
            >
              {product.name}
            </Typography>

            <Typography component="h2">{product.description}</Typography>

            <Typography component="h2" sx={{ color: "#A4A4A4" }}>
              {" "}
              category :
              <span style={{ color: "#000", fontWeight: "bold" }}>
                {" "}
                {product.category}{" "}
              </span>{" "}
            </Typography>

            <Typography component="h2" sx={{ color: "#A4A4A4" }}>
              bard :
              <span style={{ color: "#000", fontWeight: "bold" }}>
                {" "}
                {product.brand}{" "}
              </span>
            </Typography>

            <Typography
              component="h2"
              sx={{ fontSize: "20px", fontWeight: "bold" }}
            >
              <span style={{ color: "#A4A4A4" }}>Price :</span> {product.price}{" "}
              Rs/-
            </Typography>

            <Stack direction={"flex"} gap={2}>
              <Typography sx={{ color: "#A4A4A4" }}>Status : </Typography>
              {product.countInStock > 0 ? (
                <Typography sx={{ fontWeight: "700", color: "green" }}>
                  In Stock
                </Typography>
              ) : (
                <Typography sx={{ fontWeight: "700", color: "red" }}>
                  Unavilable
                </Typography>
              )}
            </Stack>
            <Divider/>
            <Stack direction={"row"}>
              <Box component={"span"} sx={{flex:1}} />
            <Button
              variant="contained"
              sx={{ fontWeight: "700" }}
              onClick={addToCartHandler}
              endIcon={<AddShoppingCart/>}
              >
              Add to Cart 
            </Button>
              </Stack>
          </Stack>
        </Grid>
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

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await dbConnect();
  const product = await Product.findOne({ slug }).lean();
  return { props: { product: convertDocToObj(product) } };
}

export default ProductScreen;
