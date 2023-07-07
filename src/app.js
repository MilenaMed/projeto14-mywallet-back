import { MongoClient } from "mongodb";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt"

//Ferramentas
const app = express()
app.use(express.json()) 
app.use(cors())
dotenv.config()

//Mongo
const mongoClient = new MongoClient(process.env.DATABASE_URL);

try { 
    await mongoClient.connect()
    console.log("Mongo Conectado")
} catch (err) {
    console.log(err.message)
}
const db = mongoClient.db()

//POST - Cadastro
app.post('/cadastro', async (request, response) => {
    const { name, senha, email } = request.body;
    console.log("entrou cadastro")
    const senhaCriptografada = bcrypt.hashSync(senha, 10);
    const usuárioExiste = await db.collection("users").findOne({ email })
    if (usuárioExiste) {
        return response.sendStatus(409)
    }

    try {
        const dadosDoUsuário = {
            name: name,
            email: email,
            password: senhaCriptografada
        }
        await db.collection("users").insertOne(dadosDoUsuário)
        return response.status(201).send("Usuário Cadastrado!")
    } catch (err) {
        return response.status(500).send(err.message)
    }
})

//POST - Login
//POST - Operações
//GET - Operações
//Logout

//Porta
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));