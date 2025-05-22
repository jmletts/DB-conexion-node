import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from '../routes/user';
import routerProducts from '../routes/products';
import * as models from '../models';  

class Server {
    private app: Application;
    private port: string;

    constructor() {
        this.app = express();
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
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(cookieParser());
    }

    routes() {
        this.app.use(router);
        this.app.use(routerProducts);
    }

   async dbConnection() {
        try {
            // Probar conexión
            await models.sequelize.authenticate();
            console.log('Database connection established.');

            // OPCIÓN 1: Para desarrollo - Reset completo (CUIDADO: Elimina todos los datos)
            if (process.env.NODE_ENV === 'development' && process.env.DB_RESET === 'true') {
                await models.sequelize.drop(); // Elimina todas las tablas
                console.log('All tables dropped.');
                
                await models.sequelize.sync(); // Crea todas las tablas nuevamente
                console.log('All tables created.');
                
                await this.insertInitialData();
            }
            // OPCIÓN 2: Para producción o desarrollo normal - Sync seguro
            else {
                await models.sequelize.sync({ 
                    alter: true 
                });
                console.log('Database synchronized successfully.');
            }

        } catch (error) {
            console.error('Unable to connect to the database:', error);
            process.exit(1);
        }
    }


private async insertInitialData() {
        try {
            console.log('Inserting initial data...');

            // Verificar si ya existen datos para evitar duplicados
            const paymentMethodCount = await models.PaymentMethod?.count?.() || 0;
            
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
                    await models.PaymentMethod.findOrCreate({
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
                    await models.ShippingMethod.findOrCreate({
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
                    await models.SystemConfig.findOrCreate({
                        where: { config_key: config.config_key },
                        defaults: config
                    });
                }
                console.log('System config inserted.');
            }

            console.log('Initial data inserted successfully.');

        } catch (error) {
            console.error('Error inserting initial data:', error);
        }
    }
}

export default Server;
 