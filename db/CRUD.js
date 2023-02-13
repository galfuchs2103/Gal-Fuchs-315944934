const sql = require("./db");
const path = require("path");
const csv = require("csvtojson");
const cookieParser = require('cookie-parser');
const express = require("express");
const app = express();
app.use(cookieParser());

const createNewUser = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    ;
    const Q1 = "SELECT * FROM users WHERE email = ?";
    sql.query(Q1, req.body.signUpEmail, (err, mysqlres) => {
            if (err) {
                console.log("error: ", err);
                res.status(400).send({message: "error in creating user: " + err});
                return;
            }
            if (mysqlres.length != 0) {
                res.render('Login & Sign-Up', {
                    title: 'Login & Sign-Up',
                    message2: 'קיים משתמש בעל כתובת מייל זהה.'
                });
                return;
            }
        }
    )
    ;

    // pull data from body to json
    const newUser = {
        "email": req.body.signUpEmail,
        "password": req.body.SignUpPassword,
        "name": req.body.SignUpName,
        "birthdate": req.body.SignUpBirthdate,
        "address": req.body.SignUpAddress
    };
    // run query
    const Q2 = "INSERT INTO users SET ?";
    sql.query(Q2, newUser, (err, mysqlres) => {
            if (err) {
                console.log("error: ", err);
                res.status(400).send({message: "error in creating user: " + err});
                return;
            }
            console.log("created user: ", {id: mysqlres.insertId, ...newUser});
            res.cookie('email', newUser.email);
            res.render('search', {
                title: 'search',
                message: 'ברוכים הבאים, מה תרצו לאכול היום?'
            });
            //return;
        }
    )
    ;
}

// Create a route for getting all customers
const showAll = (req, res) => {
    const Q2 = "SELECT * FROM users";
    sql.query(Q2, (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error in getting all users: " + err});
            return;
        }
        ;
        console.log("got all users...");
        res.send(mysqlres);
        res.render()
        return;
    });
};

const FindUser = (req, res) => {
// check if body is empty
    if (!req.body) {
        res.status(400).send({message: "content can not be empty"});
        return;
    }
//if body not empty - create new customer
    const loginEmail = req.query.LoginEmail;
    const loginPassword = req.query.LoginPassword;

    console.log(loginEmail);
    console.log(loginPassword);
//insert query
    sql.query("SELECT * FROM users where (email = ? AND password = ?)", [loginEmail, loginPassword], (err, results,
                                                                                                      fields) => {
        if (err) {
            console.log("error is: " + err);
            res.status(400).send({message: "error in finding user " + err});
            return;
        }
// if not query error
        if (results.length == 0) {
            //alert("User not found, please check your login information");
            res.render('Login & Sign-Up', {
                title: 'Login & Sign-Up',
                message: 'לא נמצא משתמש רשום באתר התואם את הפרטים שהוזנו'
            });
            return;
        }
        console.log("User found ");
        res.cookie('email', results[0].email);
        res.render('search', {
            title: 'search',
            message: 'ברוכים הבאים, מה תרצו לאכול היום?'
        });
    });
};

const FindTable = (req, res) => {
// check if body is empty
    if (!req.body) {
        res.status(400).send({message: "content can not be empty"});
        return;
    }
//if body not empty - create new customer
    const Capacity = req.query.capacity;
    const Time = req.query.time;
    const Area = req.query.area;
    const Cuisine = req.query.cuisine;

    console.log(Capacity);
    console.log(Time);
    console.log(Area);
    console.log(Cuisine);
//insert query

    sql.query("SELECT * FROM tables where (capacity >= ? AND time = ? AND address like ? and cuisine = ?)", [Capacity, Time, '%' + Area + '%', Cuisine], (err, results,
                                                                                                                                                          fields) => {
        if (err) {
            console.log("error is: " + err);
            res.status(400).send({message: "error in finding table " + err});
            return;
        }
// if not query error
        if (results.length == 0) {
            //alert("There are no available Tables to match your search");
            res.render('search', {

                message: 'לצערנו, לא נמצא שולחן התואם את החיפוש שלך.',
                res: findCuisine()

            });
            return;
        }
        console.log("Table found ");
        res.render('results', {
            title: 'results',
            message: 'איזה כיף! מצאנו עבורך שולחן. להזמנה, יש ללחוץ על שמירת שולחן',
            res: results
        });


        return;
    });
};


const AccountDetails = (req, res) => {
    console.log("details");

    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    ;
    // run query

    var Q6 = 'select * from users where email = ?';
    const userEmail = req.cookies.email;


    console.log(userEmail);

    sql.query(Q6, userEmail, (err, mysqlres) => {
        if (err) {
            console.log("error in inserting restaurants_data", err);
            res.status(400).send({message: "error in creating user: " + err});
            return;
        }

        res.render('Account', {
            title: 'Account',
            res: mysqlres
        });
    });

};

const editUserDetails = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    ;

    console.log(req.body.AccountEmail);

    // pull data from body to json
    const email = req.cookies.email;
    const password = req.body.AccountPassword;
    const name = req.body.AccountName;
    const birthdate = req.body.AccountBirthdate;
    const address = req.body.AccountAddress;


    // run query
    const Q2 = "UPDATE users SET password = ?, name = ?, address = ? WHERE email = ?";
    console.log(Q2);
    sql.query(Q2, [password, name, address, email], (err, mysqlres) => {
            if (err) {
                console.log("error: ", err);
                res.status(400).send({message: "error in updating user: " + err});
                return;
            }
            console.log("updated user");
            sql.query("select * from users where email = ?", email, (err, results) => {
                if (err) {
                    console.log("error: ", err);
                    res.status(400).send({message: "error in updating user: " + err});
                    return;
                }
                res.render('Account', {
                    title: 'Account',
                    message: 'פרטי החשבון עודכנו בהצלחה',
                    res: results
                });
                return;
            })

            return;
        }
    )
    ;
}

const deleteUser = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    ;

    // run query
    const Q2 = "DELETE FROM users WHERE email = ?";
    sql.query(Q2, req.cookies.email, (err, mysqlres) => {
            if (err) {
                console.log("error: ", err);
                res.status(400).send({message: "error in creating user: " + err});
                return;
            }
            console.log("successfuly deleted user");
            res.render('Homepage', {
                title: 'Homepage',
                message: 'ברוכים הבאים, מה תרצו לאכול היום?'
            });

            return;
        }
    )
    ;
}

const findCuisine = (req, res) => {
    const Q8 = "SELECT distinct cuisine FROM tables";
    sql.query(Q8, (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error in getting all users: " + err});
            return;
        }
        ;
        console.log("got all users...");
        return mysqlres;
    });
};

module.exports = {
    createNewUser,
    showAll,
    FindUser,
    FindTable,
    AccountDetails,
    editUserDetails,
    deleteUser,
    findCuisine
};
