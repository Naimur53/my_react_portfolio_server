const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();

const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;
const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.icikx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('portfolio');
        const bestProjects = database.collection('best_projects');
        app.get('/bestprojects', async (req, res) => {
            const result = await bestProjects.find({}).toArray();
            console.log(result);
            res.json(result)
        })
        app.post('/bestprojects', async (req, res) => {
            console.log('adding', req.body);
            const result = await bestProjects.insertOne(req.body);
            console.log(result);
            res.json(result)
        })
        app.put('/bestprojects/:id', async (req, res) => {
            console.log(req.body);
            console.log(req.params.id);
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const doc = { $set: req.body }
            const options = { upsert: true };
            const result = await bestProjects.updateOne(filter, doc, options);
            console.log(result);
            res.json(result)

        })
        app.delete('/bestprojects/:id', async (req, res) => {
            console.log(req.body);
            console.log(req.params.id);
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await bestProjects.deleteOne(filter);
            console.log(result);
            res.json(result)

        })


    }
    finally {
        // await client.close(); 


    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running server')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})

