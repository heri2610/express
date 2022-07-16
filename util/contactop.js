const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "nodeApp";

const db = client.db(dbName);
const coap = db.collection("contactapp");

const loadContacts = () => coap.find().toArray();
const findContacts = (nama) => coap.findOne({ nama });
// };
// const addContact = (contact) => {

// }

module.exports = { loadContacts, findContacts };
