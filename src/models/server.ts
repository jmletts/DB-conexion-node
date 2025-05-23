import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from '../routes/user';
import routerProducts from '../routes/products';
import routerCompany from '../routes/company'; // 👈 Agregar esta línea
import * as models from '../models';  

class Server {
    private app: Application;
    private port: string;

    constructor() {
        this.app = express();
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
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(cookieParser());
    }

    routes() {
        this.app.use(router);
        this.app.use(routerProducts);
        this.app.use(routerCompany); 
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
                
                await models.sequelize.sync({
                    //force: true
                }); // Crea todas las tablas nuevamente
                console.log('All tables created.');
                
                await models.sequelize.sync({ 
                    force: true 
                });
                
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
}

export default Server;