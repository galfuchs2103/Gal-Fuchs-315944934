const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const sql = require('./db/db');
const csv = require('csvtojson');
const CRUD = require('./db/CRUD');
const CreateDB = require('./db/CreateDB');
const cookieParser = require('cookie-parser');
const SQL = require("./db/db");
const port = 3000;

app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// routing
app.get('/', (req, res) => {
    res.redirect("/Homepage");
})

app.get('/Homepage', (req, res) => {
    res.render("Homepage");
})

/*
app.get('/Account', (req, res) => {
    res.render('Account');
})
*/

app.get('/Account', CRUD.AccountDetails);

// account changes route
app.post('/editAccount', CRUD.editUserDetails);

// delete account route
app.post('/deleteAccount', CRUD.deleteUser);


app.get('/LoginSignUp', (req, res) => {
    res.render("Login & Sign-Up");
})

app.get('/results', (req, res) => {
    res.render("results");
})

app.get('/search', (req, res) => {
    res.render("search");
})

// set up listen
app.listen(port, () => {
    console.log("server is running on port " + port);
})


// signUp route
app.post('/signUp', CRUD.createNewUser);

// show all users
app.get('/showUsers', CRUD.showAll);

// Login
app.get('/LoginSignUp', (req, res) => {
    res.render("Login & Sign-Up");
});
app.get('/Login', CRUD.FindUser);

// search table form
app.get('/search', (req, res) => {
    res.render("search");
});

app.get('/findTable', CRUD.FindTable);


app.get('/CreateTables', [CreateDB.CreateUsersTable, CreateDB.CreateTablesTable]);
app.get('/InsertData', [CreateDB.InsertUsersData, CreateDB.InsertTablesData]);
app.get('/ShowUsersTable', CreateDB.ShowUsersTable);
app.get('/ShowTablesTable', CreateDB.ShowTablesTable);
app.get('/DropTables', [CreateDB.DropUsersTable, CreateDB.DropTablesTable]);
