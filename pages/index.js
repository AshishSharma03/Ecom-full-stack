import React, { useState, useEffect } from "react";
import Head from "next/head";
import Layout from "../components/Layout";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import dbConnect from "../utils/db";
import Product from "../model/Product";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext } from "react";
import { Store } from "../utils/store";
import { useSnackbar } from "notistack";
import { AddShoppingCart } from "@mui/icons-material";
import { Skeleton } from "@mui/material";

function Index(props) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { products } = props;
  const { cart } = state;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const addToCartHandler = async (product) => {
    const { data } = await axios.get(`/api/products/`);
    if (data.countInStock <= 0) {
      window.alert("Sorry, product is out of stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity: 1 } });

    enqueueSnackbar(`${product.name} added to your cart!`, {
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
      preventDuplicate: true,
    });
  };

  return (
    <Layout>
      <Grid container spacing={2}>
        {products.map((product, i) => {
          return (
            <Grid item lg={3} md={4} sm={6} xs={12} key={i}>
              {loading ? (
                <Card sx={{ boxShadow: "none" }}>
                  <CardMedia
                    component="img"
                    sx={{ height: 200, backgroundColor: "#f0f0f0" }}
                  />
                  <CardContent>
                    <Typography>
                      <Skeleton variant="text" width="80%" />
                    </Typography>
                    <Typography>
                      <Skeleton variant="text" width="60%" />
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                <Card sx={{ boxShadow: "none" }}>
                  <CardActionArea
                    onClick={() => {
                      router.push(`/product/${product.slug}`);
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={product.image}
                      title={product.name}
                    ></CardMedia>
                  </CardActionArea>

                  <CardContent sx={{ display: "flex", flexDirection: "row" }}>
                    <Typography sx={{ fontWeight: "700" }}>
                      {product.name}
                    </Typography>
                    <Box sx={{ flex: 1 }} />
                    <IconButton></IconButton>
                  </CardContent>
                  <Divider />
                  <CardContent sx={{ display: "flex" }}>
                    <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
                      ₹ {product.price} /-
                    </Typography>
                    <Box component="span" sx={{ flex: 1 }} />
                    <Button
                      variant="contained"
                      sx={{ boxShadow: "none" }}
                      endIcon={<AddShoppingCart />}
                      onClick={() => addToCartHandler(product)}
                    >
                      Add to cart
                    </Button>
                  </CardContent>
                </Card>
              )}
            </Grid>
          );
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

export async function getServerSideProps() {
  await dbConnect();
  const product = await Product.find({}).lean();

  return { props: { products: product.map(convertDocToObj) } };
}

export default Index;
