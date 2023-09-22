import dbConnect from "../../../utils/db";
import Product from "../../../model/Product";

export default async function handler(req,res){

    const { method } = req
    await dbConnect()

    switch(method){
       case 'GET':
        const product = await Product.find({})

        try{
        res.send(product)
         }catch(error){
        res.status(400).json({success:false})
         }      
         break
         
        default:
            res.status(400).json({succescs:false}) 
        break    
    }
}