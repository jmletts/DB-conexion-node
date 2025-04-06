import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import {User} from '../models/user';
import { Product } from '../models/products';


export const registerProduct = async (req: Request, res : Response) => {

    const { name, description} = req.body;

    User.create({
        name: name,
        description: description,
        status: 1
    })

    res.json({
        msg: 'Product added successfully',
        name,
        description,
    })
}