const express = require('express'); //1
const { MongoClient } = require('mongodb'); //6
const cors = require('cors'); //8.1
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express(); //2
const port = 5000; //3

//middleware 8.2
app.use(cors());
app.use(express.json());

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aysae.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`; //7
//check uri ok or not
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        console.log('connected to database')

        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');

        //GET API
        app.get('/services', async(req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray();
            res.send(services);
        });


        //GET Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id)
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        //POST API
        app.post('/services', async(req, res) => {
            const service = req.body;
            console.log('hit the post api', service);
            
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            
            res.json(result)
        })


        //DELETE API
        app.delete('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })


    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => { //4
    res.send('Running Genius Server');
});



app.listen(port, () => { //5
    console.log('Running Genius Server on port', port);
})