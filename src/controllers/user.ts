import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response): Promise<void> => {
  // creamos una funcion assync con prmses y definimos dos variables de tupojson de respuest y request
  try {
    const { id, name, lastName, email, password, phone } = req.body;
    //creamos las vriabesl del tipo json

    //validaciones
    const userUnique = await User.findOne({
      // funcion para verificar el usuairo unico
      where: { [Op.or]: [{ email: email }] }, //usamor op para validar ambos tanto encrdencia como email
    });

    if (userUnique) {
      //si lafuncion anterior se cumple entinces e ejcuta esta condiconal que para el prcedieminto
      res.status(400).json({ msg: "User already exists", userUnique });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10); // ecnripta la contrasena

    const nUser = await User.create({
      // creaos el uaairo jsn y lo anadimoa a la db
      name,
      lastName,
      email,
      password: passwordHash,
      phone,
      status: "active",
    });

    res.json({ msg: "User created successfully", nUser }); // devuekve la confiamr dela andido
  } catch (error) {
    res.status(500).json({ msg: "Error creating user", error });
    console.log(req.body);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user: any = await User.findOne({
    where: { email: email.trim() },
  });
  3;
  if (!user) {
    res.status(400).json({ msg: "Email no existe", user });
    return;
  }

  const passwordValid = await bcrypt.compare(password, user.password);

  if (!passwordValid) {
    res.status(400).json({ msg: "passwordno correcta", user });
    return;
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
    },
    process.env.SECRET_KEY || "Jdzkfjdkjfk",
    { expiresIn: "1h" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
    sameSite: "none", // Adjust as needed
    maxAge: 3600000, // 1 hour
  });
  res.json({ msg: "Login successfully and token sended", user, token }); // devuelv el token y el usuario
};


