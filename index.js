import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT;

const app = express();

const client = new MongoClient("mongodb+srv://mashnovilya:EOfVznnzKrJxVw2A@cluster0.y3lgcok.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server
        const conn = await client.connect();
        // Send a ping to confirm a successful connection
        const res = await client.db("todolist")
    } finally {
        await client.close();
    }
}
run().catch(console.dir);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/articles', async (req, res) => {
    const conn = await client.connect();
    const articles = await client.db("todolist").collection("articles").find().toArray((err, result) => {
        if (err) throw err;
        db.close();
    });
    res.status(200).send(articles);
}); 

app.delete("/articles/:id", async (req, res) => { 
    const conn = await client.connect();
    console.log(req.params.id)
    const result = await client.db("todolist").collection("articles").deleteOne({_id: new ObjectId(req.params.id)}, (err, obj) => {
        if (err) throw err;
        db.close();
    })
    res.status(200).send(result);
})

app.post("/articles/:id", async (req, res) => { 
    const conn = await client.connect();
    console.dir(req.query.statut)
    console.dir(req.params.id)
    const result = await client
        .db("todolist")
        .collection("articles")
        .updateOne({_id: new ObjectId(req.params.id)}, {$set: {category: req.query.statut}}, (err, res) => {
            if (err) throw err;
            db.close();
    })
    res.status(200).send(result);
})

app.post("/articles/", async (req, res) => { 
    const conn = await client.connect();
    console.dir(req.query)
    const result = await client
        .db("todolist")
        .collection("articles")
        .insertOne({title: req.query.title, description: req.query.description, category: req.query.category}, (err, res) => {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    res.status(201).send(result);
})

app.post('/', (req, res) => {
    res.send('POST request to the homepage')
})

app.listen(PORT, () => { 
    console.log("Server running at PORT: ", PORT); 
}).on("error", (error) => {
    throw new Error(error.message);
});