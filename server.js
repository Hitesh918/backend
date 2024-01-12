const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const { Statement } = require('sqlite3');
const cors = require('cors');

const uri = "mongodb+srv://hrenukunta66:hitesh66@cluster0.pfx1ved.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {});


app.use(cors());

let input
let collections = ["crime_scene_reports", "people", "incomes", "interviews", "licenses", "get_fit_now_check_ins", "get_fit_now_members", "facebook_event_checkins"]

let first, second, third, query
let errMsg = "no"

function queryProcessor(str) {
  first = str.slice(0, 3)
  if (first != "db.") {
    errMsg = "The query must start with db. "
    console.error("The query must start with db. ")
  }
  else {
    let x = str.indexOf(".", 3)
    second = str.slice(3, x)
    if (collections.includes(second)) {
      if (str[x] == ".") {
        let y = str.indexOf("(", x + 1)
        third = str.slice(x + 1, y)
        let l = str.length
        if (str[l - 1] == ")") {
          query = str.slice(y + 1, l - 1)
          console.log(second, third, query)
          query = query.replace(/(\$?\b\w+\b)(?=\s*:)/g, '"$1"');
          console.log(second, third, query)
        }
        else {
          errMsg = "Missing brackett )"
          console.error("Missing brackett )")
        }
      }
      else {
        errMsg = `Syntax Error . Missing dot(.)`

        console.error(`Syntax Error . Missing dot(.)`)
      }
    }
    else {
      console.error("Collection name is invalid")
      errMsg = "Collection name is invalid"
    }
  }
}

async function run() {
  queryProcessor(input)
  if (errMsg == "no") {
    try {
      await client.connect();
      console.log('Connected to the database');

      const database = client.db('crimeDB');
      const collection = database.collection(second);
      let documents
      if (third == "find") {
        documents = await collection.find(JSON.parse(query)).toArray();
        return documents
      }
      else if (third == "findOne") {
        documents = await collection.findOne(JSON.parse(query)).toArray();
        return documents
      }
      else if (third == "aggregate") {
        documents = await collection.aggregate(JSON.parse(query)).toArray();
        return documents
      }
      else {
        console.error("cannot be executed")
        return [{ "Error": "You only have read access to database" }]
      }
    }
    finally {
      await client.close();
    }
  }
  else {
    return [{ "Error": errMsg }]
  }
}

app.get('/', async (req, res) => {
  input = req.query.input.trim()
  console.log(input)
  try {
    const resp = await run();
    console.log(resp)
    errMsg="no"
    res.send(resp);
  } catch (error) {
    console.error(error);
    res.send([{ "Error": "Syntax Mistake , Please check your query" }])

  }
});

const PORT=process.env.PORT||5000
app.listen(PORT)
