import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb' // Documentación CRUD: https://mongodb.github.io/node-mongodb-native/6.2/
import express from "express"

const app = express()
app.use(express.json())  // IMPORTANTE: SOPORTE PARA JSON


const PORT = process.env.PORT ?? 3001
const DB_URL = process.env.MONGODB_URI ?? 'mongodb://localhost:27017'
const DB_NAME = process.env.DB_NAME ?? 'api'
const COLLECTION1 = 'users'
const COLLECTION2 = 'productos'

const client = new MongoClient(DB_URL, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// GET PARA USUARIOS
app.get('/api/users', async (request, response) => {
    try {
        await client.connect();
        const database = client.db(DB_NAME);
        const collection = database.collection(COLLECTION1);

        const results = await collection.find({}).toArray()

        response.status(200).json(results)
    } catch (error) {
        console.log(error);
    } finally {
        await client.close();
    }
})

app.get('/api/users/:id', async (request, response) => {
    const database = client.db(DB_NAME);
    const collection = database.collection(COLLECTION1);

    const { id } = request.params
    const results = await collection.find({ _id: new ObjectId(id) }).toArray()

    response.status(200).json(results)
})

// GET PARA PRODUCTOS
app.get("/", (request, response) => {
    response.redirect("/api/productos")
})

app.get('/api/productos', async (request, response) => {
    try {
        await client.connect();
        const database = client.db(DB_NAME);
        const collection = database.collection(COLLECTION2);

        const results = await collection.find({}).toArray()

        response.status(200).json(results)
    } catch (error) {
        console.log(error);
    } finally {
        await client.close();
    }
})

app.get('/api/productos/:id', async (request, response) => {
    const database = client.db(DB_NAME);
    const collection = database.collection(COLLECTION2);
    const { id } = request.params
    const results = await collection.find({ _id: new ObjectId(id) }).toArray()

    response.status(200).json(results)
})

// POST PARA USUARIOS
app.post('/api/users', async (request, response) => {
    if (!request.is('json'))
        return response.json({ message: 'Debes proporcionar datos JSON' })

    const database = client.db(DB_NAME);
    const collection = database.collection(COLLECTION1);

    const { nombre, edad } = request.body
    const results = await collection.insertOne({ nombre, edad });

    return response.status(200).json(results)
})

// POST PARA PRODUCTOS
app.post('/api/productos', async (request, response) => {
    if (!request.is('json'))
        return response.json({ message: 'Debes proporcionar datos JSON' })

    const database = client.db(DB_NAME);
    const collection = database.collection(COLLECTION2);
    const { nombre, precio, descripcion } = request.body
    const results = await collection.insertOne({ nombre, precio, descripcion })
    return response.status(200).json(results);
})

// PUT PARA USUARIOS
app.put('/api/users/:id', async (request, response) => {
    if (!request.is('json'))
        return response.json({ message: 'Debes proporcionar datos JSON' })

    const database = client.db(DB_NAME);
    const collection = database.collection(COLLECTION1);

    const { id } = request.params
    const { nombre, edad } = request.body
    const results = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { nombre, edad } });

    response.status(200).json(results)
})

// PUT PARA PRODUCTOS
app.put('/api/productos/:id', async (request, response) => {
    if (!request.is('json'))
        return response.json({ message: 'Debes proporcionar datos JSON' })

    const database = client.db(DB_NAME);
    const collection = database.collection(COLLECTION2);
    const { id } = request.params
    const { nombre, precio, descripcion } = request.body

    const results = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { nombre, precio, descripcion } });
    response.status(200).json(results)
})

// DELETE PARA USUARIOS
app.delete('/api/users/:id', async (request, response) => {
    const database = client.db(DB_NAME);
    const collection = database.collection(COLLECTION1);

    const { id } = request.params
    const results = await collection.deleteOne({ _id: new ObjectId(id) })
    response.status(200).json(results)
})

// DELETE PARA PRODUCTOS
app.delete('/api/productos/:id', async (request, response) => {
    const database = client.db(DB_NAME);
    const collection = database.collection(COLLECTION2);

    const { id } = request.params
    const results = await collection.deleteOne({ _id: new ObjectId(id) })
    response.status(200).json(results)
})


app.listen(PORT, () => console.log(`Ok. Puerto: ${PORT}`))

