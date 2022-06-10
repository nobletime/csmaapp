'use strict';

const { ObjectId } = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const { ConnectionClosedEvent } = require('mongodb');

const dburi = 'mongodb+srv://azureserver:Rest007@rest.ms872.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const dbname = "autocheck";

async function asyncGetCookie() {
    
    const collection = "auth";
    const query = { '_id': new ObjectId('627421306d3a283cd6604904') };

    const client = await MongoClient.connect(dburi, { useNewUrlParser: true });
    const db = client.db(dbname);

    try {
        const result = await db.collection(collection).findOne(query);
        return  result.token;
    }
    finally {
        client.close();
    }

    // MongoClient.connect(dburi, function (err, db) {
    //     if (err) throw err;
    //     var dbo = db.db(dbname);
    //     dbo.collection(collection).findOne(query, function (err, result) {
    //         if (err) throw err;          

    //         db.close();
    //        return {"cookie" : result.token};
    //     })
    // });
};


function getCookie(cb){
    const query = { '_id': new ObjectId('627421306d3a283cd6604904') };
    MongoClient.connect(dburi, function (err, db) {
        if (err) throw err;
        var dbo = db.db(dbname);
    
        dbo.collection('auth').findOne(query, function (err, result) {
          if (err) throw err;
          if (result != null) {    
            cb(result.token);
          } else {
            cb('not found');
          }
          db.close();
        });
      });
}

function getStaticCookie(){
    return "username=eyJ1biI6Im5vYmxldGltZSJ9###b36b5a2bc3d6e8f2e3badc390b89c1cc886244c20cc73bc646183d38f03d385b; _ga=GA1.2.1660758389.1651508967;"
}

module.exports.asyncGetCookie = asyncGetCookie;
module.exports.getStaticCookie = getStaticCookie;
module.exports.getCookie = getCookie
