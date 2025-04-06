import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user';
import { Op } from 'sequelize';

export const register = async (req: Request, res: Response): Promise<void> => { // creamos una funcion assync con prmses y definimos dos variables de tupojson de respuest y request
    try {
        const { name, lastName, email, password, credential } = req.body; //creamos las vriabesl del tipo json

        //validaciones
        const userUnique = await User.findOne({ // funcion para verificar el usuairo unico
            where: { [Op.or]: [{ email : email}, { credential : credential}]}, //usamor op para validar ambos tanto encrdencia como email
        });

        if (userUnique) { //si lafuncion anterior se cumple entinces e ejcuta esta condiconal que para el prcedieminto
            res.status(400).json({ msg: 'User already exists', userUnique });
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10); // ecnripta la contrasena

        await User.create({ // creaos el uaairo jsn y lo anadimoa a la db
            name,
            lastName,
            email,
            password: passwordHash,
            credential,
            status: 1,
        });

        res.json({ msg: 'User created successfully', name, lastName, email, credential }); // devuekve la confiamr dela andido
    } catch (error) {
        res.status(500).json({ msg: 'Error creating user', error }); 
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(req.body);
        res.json({ msg: 'Login Successfully', body: req.body });
    } catch (error) {
        res.status(500).json({ msg: 'Error during login', error });
    }
};