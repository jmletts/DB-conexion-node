import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { json, Op } from "sequelize";
//import jwt from "jsonwebtoken";
import { Product } from "../models";

export const addProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, name, description, price, cost_price, sku, stock, min_stock, brand, weight, dimensions, is_active } = req.body;

    const nProduct = await Product.create({
      name,
      description,
      price,
      cost_price,
      sku,
      stock,
      min_stock,
      brand,
      weight,
      dimensions,
      is_active
    });

    res.json({ msg: "User created successfully", nProduct }); 

  } catch (error) {
    res.status(500).json({ msg: "Error creating product", error });
    console.log(req.body);
  }
};


// validar para usuario
export const getProducts = async (req : Request, res : Response) : Promise<void> =>  {
    try {
        const products = await Product.findAll();
        res.json (products)
    } catch (error) {
            console.log("Error for get products");
            
    }
}


export const getProductbyId = async (req : Request, res :Response) => {
    const { id, name } = req.body;

    const foundProduct : any  = await Product.findOne ({
        where : {id : id, name : name}
    })

    if (!foundProduct) {
        res.status(400),json({msg: "id or name invalid"})
        return;
    }
    res.json(foundProduct)
}




