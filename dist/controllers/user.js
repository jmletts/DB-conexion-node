"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../models/user");
const sequelize_1 = require("sequelize");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // creamos una funcion assync con prmses y definimos dos variables de tupojson de respuest y request
    try {
        const { id, name, lastName, email, password, phone } = req.body;
        //creamos las vriabesl del tipo json
        //validaciones
        const userUnique = yield user_1.User.findOne({
            // funcion para verificar el usuairo unico
            where: { [sequelize_1.Op.or]: [{ email: email }] }, //usamor op para validar ambos tanto encrdencia como email
        });
        if (userUnique) {
            //si lafuncion anterior se cumple entinces e ejcuta esta condiconal que para el prcedieminto
            res.status(400).json({ msg: "User already exists", userUnique });
            return;
        }
        const passwordHash = yield bcrypt_1.default.hash(password, 10); // ecnripta la contrasena
        const nUser = yield user_1.User.create({
            // creaos el uaairo jsn y lo anadimoa a la db
            name,
            lastName,
            email,
            password: passwordHash,
            phone,
            status: "active",
        });
        res.json({ msg: "User created successfully", nUser }); // devuekve la confiamr dela andido
    }
    catch (error) {
        res.status(500).json({ msg: "Error creating user", error });
        console.log(req.body);
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_1.User.findOne({
        where: { email: email.trim() },
    });
    3;
    if (!user) {
        res.status(400).json({ msg: "Email no existe", user });
        return;
    }
    const passwordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!passwordValid) {
        res.status(400).json({ msg: "passwordno correcta", user });
        return;
    }
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
    }, process.env.SECRET_KEY || "Jdzkfjdkjfk", { expiresIn: "1h" });
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
        sameSite: "none", // Adjust as needed
        maxAge: 3600000, // 1 hour
    });
    res.json({ msg: "Login successfully and token sended", user, token }); // devuelv el token y el usuario
});
exports.login = login;
