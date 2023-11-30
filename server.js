const { MongoClient } = require('mongodb');
const { Statement } = require('sqlite3');

// Replace the connection string with your own MongoDB Atlas connection string
const uri = "mongodb+srv://hrenukunta66:hitesh66@cluster0.pfx1ved.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {});

let input="db.licenses.find({id:101586})"


function queryProcessor(str){
  let first=str.slice(0 , 3)
  if(first != "db."){
    console.error("wrong query 1")
  }
  else{
    console.log("fine")
  }
}




async function run() {
  try {
    await client.connect();
    console.log('Connected to the database');

    const database = client.db('crimeDB');
    const collection = database.collection('persons'); 

    // const mongoShellCommand = 'db.collection.find()'; // Replace with your own MongoDB shell command

    // const collectionName = mongoShellCommand.split('.')[1];
    // const collection = database.collection(collectionName);

    const query =[{$match :{address_street_name:"Northwestern Dr"}} , {$sort:{address_number:-1}} , {$limit:1} , {$lookup:{from:"interviews" , localField:"id", foreignField:"person_id" , as:"statement"}} , {$unwind:"$statement"}]


    // const query = [{$match:{$and:[{membership_status:"gold"} ,{id:/^48Z/}]}} , {$lookup:{from:"persons" , localField:"person_id" , foreignField:"id" , as:"personDetails"}} , {$unwind:"$personDetails"} ]; 

    const documents = await collection.aggregate(query).toArray();
    console.log('Documents in the collection:', documents);

  } finally {
    await client.close();
  }
}

run().catch(console.dir);

