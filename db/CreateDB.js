var SQL = require('./db');
const path = require('path');
const csv = require('csvtojson');


const CreateUsersTable = (req, res, next) => {
    var Q1 = "create table if not exists `users` (id int(11) not null primary key auto_increment, email varchar(50) not null, password varchar(50) not null, name varchar(50) not null, birthdate date not null, address varchar(50) not null)";
    SQL.query(Q1, (err, mySQLres) => {
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating table"});
            return;
        }
        console.log('created users table');

        return;
    })
    next();
};


const CreateTablesTable = (req, res) => {
    var Q4 = "create table if not exists `tables` (id int(11) not null primary key auto_increment, restaurant varchar(50) not null, address varchar(50) not null, cuisine varchar(50) not null, capacity int not null, time time not null, phone_number varchar(50) not null, map varchar(1000) not null, link varchar(1000) not null)";
    SQL.query(Q4, (err, mySQLres) => {
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating table"});
            return;
        }
        console.log('created tables table');
        res.send("created all tables successfully");
        return;
    })

};


const InsertUsersData = (req, res, next) => {
    var Q5 = "INSERT INTO users SET ?";
    const csvFilePath = path.join(__dirname, "users_data.csv");
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            console.log(jsonObj);
            jsonObj.forEach(element => {
                var NewEntry = {
                    "id": element.id,
                    "email": element.email,
                    "password": element.password,
                    "name": element.name,
                    "birthdate": element.birthdate,
                    "address": element.address
                }
                SQL.query(Q5, NewEntry, (err, mysqlres) => {
                    console.log(mysqlres);
                    if (err) {
                        console.log("error in inserting users_data", err);
                    }
                    console.log("created row in users table successfully ");
                });
            });
        })
    next();
};


const InsertTablesData = (req, res) => {
    var Q7 = "INSERT INTO tables SET ?";
    const csvFilePath = path.join(__dirname, "tables_data.csv");
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            console.log(jsonObj);
            jsonObj.forEach(element => {
                var NewEntry = {
                    "id": element.id,
                    "restaurant": element.restaurant,
                    "address": element.address,
                    "cuisine": element.cuisine,
                    "capacity": element.capacity,
                    "time": element.time,
                    "phone_number": element.phone_number,
                    "map": element.map,
                    "link": element.link
                }
                SQL.query(Q7, NewEntry, (err, mysqlres) => {
                    if (err) {
                        console.log("error in inserting tables_data", err);
                    }
                    console.log("created row in Tables table successfully ");
                });
            });
        });
    res.send("inserted data to all tables successfully");
};


const ShowUsersTable = (req, res) => {
    var Q9 = "SELECT * FROM users";
    SQL.query(Q9, (err, mySQLres) => {
        if (err) {
            console.log("error in showing users table ", err);
            res.send("error in showing users table ");
            return;
        }
        console.log("showing users table");
        res.send(mySQLres);
        return;

    })
};

const ShowTablesTable = (req, res) => {
    var Q11 = "SELECT * FROM tables";
    SQL.query(Q11, (err, mySQLres) => {
        if (err) {
            console.log("error in showing tables table ", err);
            res.send("error in showing tables table ");
            return;
        }
        console.log("showing tables table");
        res.send(mySQLres);
        return;

    })

};


const DropUsersTable = (req, res, next) => {
    var Q13 = "DROP TABLE users";
    SQL.query(Q13, (err, mySQLres) => {
        if (err) {
            console.log("error in dropping users table ", err);
            res.status(400).send({message: "error in dropping users table" + err});
            return;
        }
        console.log("table users dropped");

        next();
    })
};


const DropTablesTable = (req, res) => {
    var Q15 = "DROP TABLE tables";
    SQL.query(Q15, (err, mySQLres) => {
        if (err) {
            console.log("error in dropping tables table ", err);
            res.status(400).send({message: "error in dropping tables table" + err});
            return;
        }
        console.log("table tables dropped");
        res.send("all tables were dropped");
        return;
    })
};


module.exports = {
    CreateUsersTable,
    CreateTablesTable,

    InsertUsersData,
    InsertTablesData,

    ShowUsersTable,
    ShowTablesTable,

    DropUsersTable,
    DropTablesTable
};
