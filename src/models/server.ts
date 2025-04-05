import express, { Application } from 'express';
import sequelize from '../database/connection';

class Server {
    private app : Application;
    private port: string;
    constructor() {
        console.log('Server is running in ');
        this.app = express();
        this.port = process.env.PORT || '3017';
        this.listen();
        this.dbConnection();
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        })
    }

    async dbConnection() { // que es asynds
        try {
            await sequelize.authenticate();
            console.log('Database connection has been established successfully.');
            
        } catch (error) {
            console.log('Unable to connect to the database:', error);
            
        }
    }
}

export default Server;
// para referenciar en el index 
// estrcutura de server y inicalizar un app con express