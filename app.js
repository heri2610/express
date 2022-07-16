const express = require("express");
const app = express();
const expressLayout = require("express-ejs-layouts");
const { loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContacts } = require("./util/contacts");
// const { loadContacts, findContacts } = require("./util/contactop");
const { body, validationResult, check } = require("express-validator");
const port = 3000;
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.set("view engine", "ejs");
app.use(expressLayout);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  //   res.sendFile("./index.html", { root: __dirname });
  //   res.json({
  //     nama: "suhaeri",
  //     email: "suhaeriheri45@gmail.com",
  //     status: "mahasiswa",
  //   });
  const mahasiswa = [];
  res.render("index", { nama: "heri", title: "halaman index", layout: "layout/maim", mahasiswa });
});
app.get("/about", (req, res) => {
  res.render("about", { title: "halaman about", layout: "layout/maim" });
});
app.get("/contact", (req, res) => {
  const contacts = loadContact();
  res.render("contact", { title: "halaman contact", layout: "layout/maim", contacts, msg: req.flash("msg") });
});
app.post(
  "/contact",
  [
    body("nama").custom((value) => {
      const duplikat = cekDuplikat(value);
      if (duplikat) {
        throw new Error("nama contact sudah terdaftar");
      }
      return true;
    }),
    check("email", "Email tidak valid").isEmail(),
    check("nohp", "No hp salah").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("addContact", {
        title: "Tabah contact",
        layout: "layout/maim",
        errors: errors.array(),
      });
    } else {
      addContact(req.body);
      req.flash("msg", "data berhasil ditambahkan");
      res.redirect("/contact");
    }
  }
);
app.get("/contact/add", (req, res) => {
  res.render("addContact", { title: "Tabah contact", layout: "layout/maim" });
});
app.get("/contact/delete/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  if (!contact) {
    res.status(404);
    res.send("<h1>404<h1/>");
  }
  deleteContact(req.params.nama);
  req.flash("msg", "data berhasil dihapus");
  res.redirect("/contact");
});
app.get("/contact/edit/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  res.render("editContact", { title: "form ubah contact", layout: "layout/maim", contact });
});
app.post(
  "/contact/update",
  [
    body("nama").custom((value, { req }) => {
      const duplikat = cekDuplikat(value);
      if (value !== req.body.oldNama && duplikat) {
        throw new Error("nama contact sudah terdaftar");
      }
      return true;
    }),
    check("email", "Email tidak valid").isEmail(),
    check("nohp", "No hp salah").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("editContact", {
        title: "ubah contact",
        layout: "layout/maim",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      // res.send(req.body);
      updateContacts(req.body);
      req.flash("msg", "data berhasil ubah");
      res.redirect("/contact");
    }
  }
);
app.get("/contact/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  res.render("detail", { title: "detail contact", layout: "layout/maim", contact });
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("file not foun");
});

app.listen(port, () => {
  console.log(`server berjalan diport ${port}`);
});
