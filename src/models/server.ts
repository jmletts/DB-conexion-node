// src/models/server.ts (Actualizado)
import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "../routes/user";
import routerProducts from "../routes/products";
import routerCompany from "../routes/company";
import routerWebsite from "../routes/website";
import routerCategory from "../routes/category";
import * as models from "../models";

class Server {
  private app: Application;
  private port: string;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "3017";
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
    this.app.use(
      cors({
        origin: ["http://localhost:4200", "http://localhost:49375"], // Agregué puerto 3000 para el frontend público
        credentials: true,
      })
    );
    this.app.use(cookieParser());
    this.app.use(express.json());
  }

  routes() {
    this.app.use(router);
    this.app.use(routerProducts);
    this.app.use(routerCompany);
    this.app.use(routerWebsite); 
    this.app.use(routerCategory);
  }

  async dbConnection() {
    try {
      // Probar conexión
      await models.sequelize.authenticate();
      console.log("Database connection established.");

      // OPCIÓN 1: Para desarrollo - Reset completo (CUIDADO: Elimina todos los datos)

        await models.sequelize.drop(); // Elimina todas las tablas
        console.log("All tables dropped.");

        await models.sequelize.sync({
          force: true,
        });
      // OPCIÓN 2: Para producción o desarrollo normal - Sync seguro
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      process.exit(1);
    }
  }
}

export default Server;