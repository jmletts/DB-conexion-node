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
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../routes/user"));
const products_1 = __importDefault(require("../routes/products"));
const user_2 = require("../models/user");
const products_2 = require("../models/products");
const cors_1 = __importDefault(require("cors"));
class Server {
    constructor() {
        console.log('Server is running in ');
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '3017';
        this.listen();
        this.midlewares();
        this.dbConnection();
        this.router();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
    router() {
        this.app.use(user_1.default);
        this.app.use(products_1.default);
    }
    midlewares() {
        this.app.use(express_1.default.json()); // para utilizar para encapsular funiones y reutilizar en distitas clases 
        this.app.use((0, cors_1.default)()); // para permitir el acceso a la api desde cualquier origen
    }
    dbConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //await sequelize.authenticate(); 
                yield user_2.User.sync({ alter: true }); // sincroniza la base de datos con el modelo
                yield products_2.Product.sync({ alter: true }); // sincroniza la base de datos con el modelo
                console.log('Database connection has been established successfully.');
            }
            catch (error) {
                console.log('Unable to connect to the database:', error);
            }
        });
    }
}
exports.default = Server;
// para referenciar en el index 
// estrcutura de server y inicalizar un app con express
