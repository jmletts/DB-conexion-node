import express, { Application } from 'express';
import sequelize from '../database/connection';
import router from '../routes/user';
import routerProducts from '../routes/products';
import {User} from '../models/user';
import {Product} from '../models/products';
import cors from 'cors';

class Server {
    private app : Application;
    private port: string;
    constructor() {
        console.log('Server is running in ');
        this.app = express();
        this.port = process.env.PORT || '3017';
        this.listen();
        this.midlewares();
        this.dbConnection();
        this.router();
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        })
    }

    router(){
        this.app.use(router);
        this.app.use(routerProducts);
    }

    midlewares() {
        this.app.use(express.json()); // para utilizar para encapsular funiones y reutilizar en distitas clases 
        this.app.use(cors()); // para permitir el acceso a la api desde cualquier origen
    }

    async dbConnection() { // que es asynds
        try {
            //await sequelize.authenticate(); 
            await User.sync({ alter: true }); // sincroniza la base de datos con el modelo
            await Product.sync({ alter: true }); // sincroniza la base de datos con el modelo
            console.log('Database connection has been established successfully.');
        } catch (error) {
            console.log('Unable to connect to the database:', error);
            
        }
    }
}

export default Server;
// para referenciar en el index 
// estrcutura de server y inicalizar un app con express