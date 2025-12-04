import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

export const connectDB = async () => {
    // 1. Inicia el servidor de MongoDB en memoria
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    // 2. Conecta Mongoose a la DB en memoria
    await mongoose.connect(uri);
    // console.log(`[DB Test] Conectado a MongoDB en memoria.`); // Puedes comentar esto
};

export const disconnectDB = async () => {
    // 1. Cierra la conexión de Mongoose y elimina la DB
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    }
    // 2. Detiene el servidor en memoria
    if (mongoServer) {
        await mongoServer.stop();
    }
};

export const clearDatabase = async () => {
    // Limpia todas las colecciones para aislar los tests individuales
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        try {
            await collection.deleteMany({});
        } catch (error) {
            // Ignoramos errores si la colección no existe
        }
    }
};