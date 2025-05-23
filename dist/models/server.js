"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_1 = __importDefault(require("../routes/user"));
const products_1 = __importDefault(require("../routes/products"));
const company_1 = __importDefault(require("../routes/company")); // 👈 Agregar esta línea
const models = __importStar(require("../models"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '3017';
        this.middlewares();
        this.routes();
        this.dbConnection();
        this.listen();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
    middlewares() {
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)());
        this.app.use((0, cookie_parser_1.default)());
    }
    routes() {
        this.app.use(user_1.default);
        this.app.use(products_1.default);
        this.app.use(company_1.default);
    }
    dbConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Probar conexión
                yield models.sequelize.authenticate();
                console.log('Database connection established.');
                // OPCIÓN 1: Para desarrollo - Reset completo (CUIDADO: Elimina todos los datos)
                if (process.env.NODE_ENV === 'development' && process.env.DB_RESET === 'true') {
                    yield models.sequelize.drop(); // Elimina todas las tablas
                    console.log('All tables dropped.');
                    yield models.sequelize.sync({
                    //force: true
                    }); // Crea todas las tablas nuevamente
                    console.log('All tables created.');
                    yield models.sequelize.sync({
                        force: true
                    });
                }
                // OPCIÓN 2: Para producción o desarrollo normal - Sync seguro
                else {
                    yield models.sequelize.sync({
                        alter: true
                    });
                    console.log('Database synchronized successfully.');
                }
            }
            catch (error) {
                console.error('Unable to connect to the database:', error);
                process.exit(1);
            }
        });
    }
}
exports.default = Server;
