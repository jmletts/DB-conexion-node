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
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, lastName, email, password, credential } = req.body; //creamos las vriabesl del tipo json
        //validaciones
        const userUnique = yield user_1.User.findOne({
            where: { [sequelize_1.Op.or]: [{ email: email }, { credential: credential }] }, //usamor op para validar ambos tanto encrdencia como email
        });
        if (userUnique) { //si lafuncion anterior se cumple entinces e ejcuta esta condiconal que para el prcedieminto
            res.status(400).json({ msg: 'User already exists', userUnique });
            return;
        }
        const passwordHash = yield bcrypt_1.default.hash(password, 10); // ecnripta la contrasena
        yield user_1.User.create({
            name,
            lastName,
            email,
            password: passwordHash,
            credential,
            status: 1,
        });
        res.json({ msg: 'User created successfully', name, lastName, email, credential }); // devuekve la confiamr dela andido
    }
    catch (error) {
        res.status(500).json({ msg: 'Error creating user', error });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        res.json({ msg: 'Login Successfully', body: req.body });
    }
    catch (error) {
        res.status(500).json({ msg: 'Error during login', error });
    }
});
exports.login = login;
