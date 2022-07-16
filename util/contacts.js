const fs = require("fs");
const dirpath = "./data";
if (!fs.existsSync(dirpath)) {
  fs.mkdirSync(dirpath);
}
const datapath = "./data/contacts.json";
if (!fs.existsSync(datapath)) {
  fs.writeFileSync(datapath, "[]", "utf-8");
}

const loadContact = () => {
  const fileBuffer = fs.readFileSync("data/contacts.json", "utf-8");
  const contacs = JSON.parse(fileBuffer);
  return contacs;
};
const findContact = (nama) => {
  const contacts = loadContact();
  const contact = contacts.find((contact) => contact.nama === nama);
  return contact;
};
const saveContacts = (contacts) => {
  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));
};
const addContact = (contact) => {
  const contacts = loadContact();
  contacts.push(contact);
  saveContacts(contacts);
};

const cekDuplikat = (nama) => {
  const contacts = loadContact();
  return contacts.find((contact) => contact.nama === nama);
};
const deleteContact = (nama) => {
  const contacts = loadContact();
  const filterContact = contacts.filter((contact) => contact.nama !== nama);
  saveContacts(filterContact);
};
const updateContacts = (contactBaru) => {
  const contacts = loadContact();
  const filterContact = contacts.filter((contact) => contact.nama !== contactBaru.oldNama);
  delete contactBaru.oldNama;
  filterContact.push(contactBaru);
  saveContacts(filterContact);
};

module.exports = { loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContacts };
