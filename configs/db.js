'use strict';
 
import mongoose from 'mongoose';
 
export const dbConnection = async () => {
    try {
        // ********MONITOREO*************
        mongoose.connection.on('error', () => {
            console.log('MongoDB | no se puedo conectar a mongoDB');
        });
        mongoose.connection.on('connecting', () => {
            console.log('MongoDB | intentando conectar a mongoDB');
        });
        mongoose.connection.on('connected', () => {
            console.log('MongoDB | conectando a mongoDB');
        });
        mongoose.connection.on('open', () => {
            console.log('MongoDB | conectado a la base de datos');
        });
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB | reconectdo a mongoDB');
        });
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB | desconectado de mongoDB');
        });
 
        //*********CONEXION******
        //Menciona que URL_MONGODB es una variable de entorno
        await mongoose.connect(process.env.URL_MONGODB,{
            //Esperar máximo 5 segundos de respuesta
            serverSelectionTimeoutMS: 5000,
            //Definimos un máximo de 10 usuarios conectados
            maxPoolSize: 10,
 
        });
    } catch (error) {
        console.log(`Error al conectar la db: ${error}`);
        process.exit(1);
    }
};
 
// *******************Cierre controlado******************
const gracefulShutdown = async (signal) => {
    console.log(`MongoDB | Recibio ${signal}. Cerrando la conexion con base de datos....`);
    try {
        await mongoose.connection.close();
        console.log('MongoDb | Conexion con Base de datos cerrada exitosamente');
        process.exit(0); //Salida exitosa sin errores
    } catch (error) {
        console.error('MongoDB | Error durante el cierre controlado: ', error.message);
        process.exit(1); //Salida con error
    }
 
};
 
//Manejadores de señales de proceso" (Process signal handlers)
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2')); //Para el reinicio con nodemon