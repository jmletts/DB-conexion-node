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
const models = __importStar(require("../models"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '3017';
        this.insertInitialData();
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
                    yield models.sequelize.sync(); // Crea todas las tablas nuevamente
                    console.log('All tables created.');
                    yield this.insertInitialData();
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
    insertInitialData() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                console.log('Inserting initial data...');
                // Verificar si ya existen datos para evitar duplicados
                const paymentMethodCount = (yield ((_b = (_a = models.PaymentMethod) === null || _a === void 0 ? void 0 : _a.count) === null || _b === void 0 ? void 0 : _b.call(_a))) || 0;
                if (paymentMethodCount > 0) {
                    console.log('Initial data already exists, skipping...');
                    return;
                }
                // Insertar datos iniciales usando findOrCreate para evitar duplicados
                if (models.PaymentMethod) {
                    const paymentMethods = [
                        { name: 'Tarjeta de Crédito', provider: 'Stripe', processing_fee: 0.029 },
                        { name: 'PayPal', provider: 'PayPal', processing_fee: 0.034 },
                        { name: 'Transferencia Bancaria', provider: 'Manual', processing_fee: 0.000 },
                        { name: 'Efectivo contra entrega', provider: 'Manual', processing_fee: 0.000 }
                    ];
                    for (const method of paymentMethods) {
                        yield models.PaymentMethod.findOrCreate({
                            where: { name: method.name },
                            defaults: method
                        });
                    }
                    console.log('Payment methods inserted.');
                }
                if (models.ShippingMethod) {
                    const shippingMethods = [
                        { name: 'Envío Estándar', description: 'Entrega en 5-7 días hábiles', base_cost: 50.00, estimated_days: '5-7 días' },
                        { name: 'Envío Express', description: 'Entrega en 2-3 días hábiles', base_cost: 150.00, estimated_days: '2-3 días' },
                        { name: 'Envío Inmediato', description: 'Entrega el mismo día', base_cost: 300.00, estimated_days: '24 horas' },
                        { name: 'Recoger en tienda', description: 'Sin costo adicional', base_cost: 0.00, estimated_days: 'Inmediato' }
                    ];
                    for (const method of shippingMethods) {
                        yield models.ShippingMethod.findOrCreate({
                            where: { name: method.name },
                            defaults: method
                        });
                    }
                    console.log('Shipping methods inserted.');
                }
                if (models.SystemConfig) {
                    const configs = [
                        { config_key: 'site_name', config_value: 'Mi Tienda Online', description: 'Nombre del sitio web' },
                        { config_key: 'currency', config_value: 'MXN', description: 'Moneda por defecto' },
                        { config_key: 'tax_rate', config_value: '0.16', description: 'Tasa de impuesto (IVA)' },
                        { config_key: 'min_order_amount', config_value: '100.00', description: 'Monto mínimo de pedido' },
                        { config_key: 'free_shipping_threshold', config_value: '500.00', description: 'Monto para envío gratis' }
                    ];
                    for (const config of configs) {
                        yield models.SystemConfig.findOrCreate({
                            where: { config_key: config.config_key },
                            defaults: config
                        });
                    }
                    console.log('System config inserted.');
                }
                console.log('Initial data inserted successfully.');
            }
            catch (error) {
                console.error('Error inserting initial data:', error);
            }
        });
    }
}
exports.default = Server;
