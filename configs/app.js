'use strict';
 
//Importaciones
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { corsOption } from './cors-configuration.js';
import { dbConnection } from './db.js';
 
//Rutas
import userRoute from "../src/Users/user.routes.js";
import loginRoute from "../src/Login/login.routes.js";
import opinionRoute from "../src/Opinions/opinion.routes.js";
import commentRoute from "../src/Comments/comment.routes.js";
 
const BASE_URL = '/GestorOpinionAdmin/v1';
 
//Configuración de mi aplicación
// Configuraciones de los middlewares
/*Se almacena una función para que pueda ser exportada
o usada al crear la instancia de la aplicacion*/
const middleware = (app) => {
    //Limitamos el acceso y el tamaño de las consultas
    app.use(express.urlencoded({ extended:false, limit: '10mb'}));
    //Las consultas Json tendrán un tamaño máximo de 10mb
    app.use(express.json({limit: '10mb'}));
    //Importamos los métodos creados anteriormente
    app.use(cors(corsOption));
    //Morgan nos ayudará a detectar errores del lado del usuario
    app.use(morgan('dev'));
 
}
 
// Integracjión de todas las rutas
const routes = (app) => {
    app.use(`${BASE_URL}/users`, userRoute);
    app.use(`${BASE_URL}`, loginRoute);
    app.use(`${BASE_URL}/opinions`, opinionRoute);
    app.use(`${BASE_URL}/comments`, commentRoute);
}
 
//Función para iniciar el servidor
const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT || 3001;
    try {
        //Configuraciones de los middlewares (Mi aplicación)
        dbConnection();
        middleware(app);
        routes(app);
 
        app.listen(PORT, () =>{
            console.log(`Servidor corriendo en el puerto ${PORT}`);
            console.log(`Base URL: http://localhost:${PORT}${BASE_URL}`);
        });
 
        //Primera ruta
        app.get(`${BASE_URL}/health`, (req, res) =>{
            res.status(200).json(
                {
                    status: 'ok',
                    service: 'GestorOpinion Admin',
                    version: '1.0.0'
                }
            );
        });
       
    } catch (error) {
        console.log(error);        
    }
}
 
export { initServer };