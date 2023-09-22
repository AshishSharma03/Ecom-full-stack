// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import data from "../../utils/data";
import Product from "../../model/Product";
import dbConnect from "../../utils/db";
import User from "../../model/UserSchema";

export default async function handler(req, res) {

    await dbConnect()
    await User.deleteMany();
    await User.insertMany(data.users);
    await Product.deleteMany(); 
    await Product.insertMany(data.products);    
    res.send({message : 'seeding successfully'})
  }
  