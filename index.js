const express = require('express');
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId;

const cors = require ('cors');
require('dotenv').config()


const app = express();
const port = 5000;

//Middle ware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6qd2k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log('Connect to data base');

        const database = client.db("CarMehcanic");
        const servicesCollect = database.collection("services");
        //Get Api
        app.get('/services', async(req, res) =>{
            const cursor = servicesCollect.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //Get single service

        app.get('/services/:id', async(req, res) =>{
            const id = req.params.id;
            console.log('gretting specific service', id);
            const querry ={_id: objectId(id)};
            const service = await servicesCollect.findOne(querry);
            res.json(service);
        });
        //post api
        app.post('/services', async(req, res)=>{
            const service = req.body;
            console.log('Hit the posr api', service);
            const result = servicesCollect.insertOne(service);
            console.log(result); 
            res.json(result)
        });
        //Delete api
        app.delete('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const querry = {_id:objectId(id)};
            const result = await servicesCollect.deleteOne(querry);
            res.json(result);
        })

    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir)

app.get('/',(req, res)=>{
    res.send('Server Start and Run the Code');
});
app.listen(port, ()=>{
    console.log('Runnig Server', port);
});