const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const { Statement } = require('sqlite3');

const uri = "mongodb+srv://hrenukunta66:hitesh66@cluster0.pfx1ved.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {});

console.log("serverrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
let input=`db.licenses.find({id:101586})`
let collections=["crime_scene_reports" , "persons"  , "incomes" , "interviews" , "licenses" , "get_fit_now_check_ins" , "get_fit_now_members" , "facebook_event_checkins"]

let first , second , third , query

function queryProcessor(str){
    first=str.slice(0 , 3)
    if(first != "db."){
      console.error("wrong query 1")
    }
    else{
        let x=str.indexOf("." , 3)
        second=str.slice(3,x)
        if(collections.includes(second)){
            if(str[x]=="." ){
                let y= str.indexOf("(" , x+1)
                third=str.slice(x+1 , y)
                let l=str.length
                if(str[l-1]==")"){
                    query=str.slice(y+1 , l-1)
                    console.log(second , third , query)
                    query=query.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ')
                }
                else{
                    console.error("wrong error 4")
                }
            }
            else{
                console.error("wrong query 3")
            }
        }
        else{
            console.error("wrong query 2")
        }
    }
  }

async function run() {
    queryProcessor(input)
  try {
    await client.connect();
    console.log('Connected to the database');

    const database = client.db('crimeDB');
    const collection = database.collection(second); 
    let documents

    if(third=="find"){
        documents = await collection.find(JSON.parse(query)).toArray();
        console.log('Documents in the collection:', documents);
    }
    else if(third=="findOne"){
        documents = await collection.findOne(JSON.parse(query)).toArray();
        console.log('Documents in the collection:', documents);
    }
    else if(third=="aggregate"){
        documents = await collection.aggregate(JSON.parse(query)).toArray();
        console.log('Documents in the collection:', documents);
    }
    else{
        console.error("cannot be executed")
    }
  }
  finally {
    await client.close();
  }
}

// run().catch(console.dir);


app.get('/run', async (req, res) => {
    try {
      await run();
      res.send('Operation completed successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  });
  
  // exports.app = functions.https.onRequest(app);


  app.listen(3000)