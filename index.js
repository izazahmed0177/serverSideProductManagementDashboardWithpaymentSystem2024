
const express=require("express")
const app=express();
const cors=require("cors");

var jwt = require('jsonwebtoken');


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port=5000;

app.use(cors());
app.use(express.json());


// jwt use ===========


function createToken(user) {

    const token = jwt.sign(
      {
        email:user.email
      },
  
      "secret",
  
      { expiresIn: "7d" }
    );
  
    return token;
  }


  //------------
  
  
  function verifyToken(req,res,next) {
    const authToken=req?.headers?.authorization;
    const authToken1=req?.headers
    console.log(authToken1);
    const token = authToken.split(' ')[1];
    
    console.log(authToken);
   
    const verify=jwt.verify(token,'secret');
  
    if (!verify?.email) {
      return res.send("you are not authorize")
      
    }
    req.user=verify.email;
    next()
  }


  //================







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

    const productManagementDB = client.db("productManagementDB");


    const productManagementUserCollection = productManagementDB.collection(
      "productManagementUserCollection"
    );


    const productManagementCollection = productManagementDB.collection(
        "productManagementProductDetails"
      );

    // userSelect: 


    app.post("/user", async (req, res) => {
        const user = req.body;
        const token=createToken(user);
  
        const isUserExist = await productManagementUserCollection.findOne({
          email: user?.email,
        });
  
        if (isUserExist?._id) {
        
          return res.send({
            status: "success",
            message: "Log in success",
            token,
          });
        }
        await productManagementUserCollection.insertOne(user);
         return res.send({token});
      });


      app.get("/user/:email", async (req, res) => {
        const email = req.params.email;
        const result = await productManagementUserCollection.findOne({ email });
        res.send(result);
      });

      app.patch("/user/:email", verifyToken, async (req, res) => {
    //   app.patch("/user/:email",  async (req, res) => {
        const email = req.params.email;
        const userData = req.body;
        const result = await productManagementUserCollection.updateOne(
          { email },
          { $set: userData },
          { upsert: true }
        );
        res.send(result);
      });

    //   =================================



      //product create

      app.post("/product",verifyToken, async (req, res) => {
        const productData = req.body;
        const result = await productManagementCollection.insertOne(productData);
        res.send(result);
      });


         // product routes gat one
         app.get("/product/get/:id", async (req, res) => {
            const id = req.params.id;
      
            const productData = await productManagementCollection.findOne({
              _id: new ObjectId(id),
            });
            // const result=await shoesData.toArray();
            res.send(productData);
          });
  
      //all product gate 
      app.get("/products", async (req, res) => {
        const productData = productManagementCollection.find();
        const result = await productData.toArray();
        res.send(result);
      });


       // product routes patch update data
       app.patch("/product/edit/:id",verifyToken, async (req, res) => {
        const id = req.params.id;
        const updatedData = req.body;
  
        const result = await productManagementCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedData }
        );
        // const result=await shoesData.toArray();
        res.send(result);
      });


      app.delete("/product/delete/:id",verifyToken,async (req, res) => {
        const id = req.params.id;
        // const updatedData=req.body;
  
        const result = await productManagementCollection.deleteOne({ _id: new ObjectId(id) });
        // const result=await shoesData.toArray();
        res.send(result);
      });

      /////////////





    




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
