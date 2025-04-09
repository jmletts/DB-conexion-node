import { Request, Response } from 'express';
import { Product } from '../models/products';


export const registerProduct = async (req: Request, res : Response) => {

    const { name, description} = req.body;

    Product.create({
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

export const getProducts = async (req: Request, res: Response) => {
    const listaProducto = await Product.findAll();
    res.json({listaProducto})
}