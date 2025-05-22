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
            await models.sequelize.authenticate();
            console.log('Database connection established.');

            await models.sequelize.sync({ force: true });  // sincroniza todas las tablas

            console.log('All models were synchronized successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }
}

export default Server;
