import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import User from '../../../model/UserSchema';
import { signToken } from '../../../utils/auth';
import dbConnect from '../../../utils/db';

const handler = nc();

handler.post(async (req, res) => {

  await dbConnect();
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
    isAdmin: false,
  });
  const user = await newUser.save();
  const token = signToken(user);
  res.send({
    token,
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });

  res.status(401).send({message: 'Invalid email or password'});
   res.status(500).send({message:'Check your connection'})
});

export default handler;