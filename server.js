const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const { Statement } = require('sqlite3');
const cors = require('cors');

const uri = "mongodb+srv://hrenukunta66:hitesh66@cluster0.pfx1ved.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {});


app.use(cors());



let input
let collections=["crime_scene_reports" , "persons"  , "incomes" , "interviews" , "licenses" , "get_fit_now_check_ins" , "get_fit_now_members" , "facebook_event_checkins"]

let first , second , third , query , errMsg

function queryProcessor(str){
    first=str.slice(0 , 3)
    if(first != "db."){
      errMsg = "wrong query 1"
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
                    // query=query.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ')
                    // query = query.replace(/([{,]\s*)([a-zA-Z_$][\w$]*)(\s*:)/g, '$1"$2"$3');
                    query = query.replace(/(\$?\b\w+\b)(?=\s*:)/g, '"$1"');



                    console.log(second , third , query)

                }
                else{
                  errMsg = "wrong query 4"

                    console.error("wrong error 4")
                }
            }
            else{
              errMsg = "wrong query 3"

                console.error("wrong query 3")
            }
        }
        else{
            console.error("wrong query 2")
            errMsg = "wrong query 2"

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
        // console.log('Documents in the collection:', documents);
        return documents
    }
    else if(third=="findOne"){
        documents = await collection.findOne(JSON.parse(query)).toArray();
        // console.log('Documents in the collection:', documents);
        return documents
    }
    else if(third=="aggregate"){
        documents = await collection.aggregate(JSON.parse(query)).toArray();
        // console.log('Documents in the collection:', documents);
        return documents
    }
    else{
        console.error("cannot be executed")
        return errMsg
    }
  }
  finally {
    await client.close();
  }
}

// run().catch(console.dir);


app.get('/', async (req, res) => {
  input = req.query.input
  // input = "db.interviews.find({ person_id: 14887 })"
  // input = `db.licenses.aggregate([ { $match: { gender: "male" } } ])`
  console.log(input)
    try {
      const resp = await run();
      console.log(resp)
      res.send(resp);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  });
  
  // exports.app = functions.https.onRequest(app);


  app.listen(5000)