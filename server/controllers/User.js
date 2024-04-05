import UserModel from "../models/User.js";
import jwt from 'jsonwebtoken';

export const Register=async (req,res)=>
{
    try
    {
        let user=await UserModel.findOne({email:req.body.email});
        if (user)
        {
            res.status(404).send({message:"User already created with this email"});
            return;
        }
        let userInfo=await UserModel.create({
            ...req.body,
            profilePic:req?.file?.filename
        });
        if(userInfo)
        res.status(200).send({message:"User Created"});
    else res.status(404).send({message:"Unable to create user"});
    }
    catch(e)
    {
        res.status(404).send({error:e?.message});
    }
}

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;       
        const user = await UserModel.findOne({ email, password });
        if (!user) {
            return res.status(401).send({ message: "Wrong Username/Password" });
        }            
        const { _id: id, role } = user;
        const token = jwt.sign({ userId: id }, 'thisismytokenecommproject', { expiresIn: '2h' });
       
        // Sending token along with user id and role
        res.status(200).send({ token, id, role });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}
