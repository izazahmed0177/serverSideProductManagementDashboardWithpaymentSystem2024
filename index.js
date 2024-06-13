
const express=require("express")
const app=express();
const cors=require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port=5000;

app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://izazahmedemon018:VJxlIwPncralbAi6@cluster0.843jjic.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    // const productDB = client.db("productDB");
    // const shoesCollection = productDB.collection("shoesCollection");

    // product routes
    // product routes create 
    app.post("/shoes",async(req,res)=>{
        const shoesData=req.body;
        const result=await shoesCollection.insertOne(shoesData);
        res.send(result);

    })
    // product routes gat All
    app.get("/shoes",async(req,res)=>{
       
        const shoesData=shoesCollection.find();
        const result=await shoesData.toArray();
        res.send(result);

    })
    // product routes gat one
    app.get("/shoes/:id",async(req,res)=>{
        const id=req.params.id;
       
        const shoesData=await shoesCollection.findOne({_id:new ObjectId(id)});
        // const result=await shoesData.toArray();
        res.send(shoesData);

    })
    // product routes patch update data
    app.patch("/shoes/:id",async(req,res)=>{
        const id=req.params.id;
        const updatedData=req.body;
       
        const result=await shoesCollection.updateOne(
            {_id:new ObjectId(id)},
            {$set:updatedData}
        );
        // const result=await shoesData.toArray();
        res.send(result);

    });
    // product routes Delete data
    app.delete("/shoes/:id",async(req,res)=>{
        const id=req.params.id;
        // const updatedData=req.body;
       
        const result=await shoesCollection.deleteOne(
            {_id:new ObjectId(id)},
            
        );
        // const result=await shoesData.toArray();
        res.send(result);

    });




    console.log(" You successfully connected to MongoDB!");
  } finally {
   
   
  }
}
run().catch(console.dir);



app.get("/",(req,res)=>{
    res.send("Route is working");
});



app.listen(port,(req,res)=>{
    console.log("App is listening on port :",port);
});


// izazahmedemon018@gmail.com
// izazahmedemon018
// VJxlIwPncralbAi6
