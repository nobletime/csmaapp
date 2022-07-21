
//const conn=mysql.createConnection({host:"rest-tracker.mysql.database.azure.com", user:"azuredb", password:"Rest007!", database:"autocheck", port:3306, ssl:{ca:fs.readFileSync("./../ssl/BaltimoreCyberTrustRoot.crt.pem")}});

// create the connection to database

const mysql = require('mysql');
const fs = require('fs');
const path = require('path');

const config =
{
    host: 'rest-tracker.mysql.database.azure.com',
    user: 'azuredb',
    password: 'Rest007!',
    database: 'rest-tracker-app',
    port: 3306,
    ssl: { ca: fs.readFileSync(path.join(__dirname, "DigiCertGlobalRootCA.crt.pem")) }
};

const conn = new mysql.createConnection(config);

conn.connect(
    function (err) {
        if (err) {
            console.log("SQL Error: Cannot connect!");
            throw err;
        }
        else {
            console.log("SQL Connection established.");
            //  queryDatabase();
        }
    });


function insertUser(user) {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO users (email, firsname, lastname, password, dob, created_date, gender,  phone, token, token, active) VALUES (?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?);',
            [user.email, user.firsname, user.lastname, user.password, user.dob, user.created_date, user.gender, user.gender, user.token, user.token, user.active],
            function (err, dbres, fields) {
                if (err) return reject(null);
                return resolve(dbres);
            })
    })
};

function insertPromo(promocode, credits) {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO promocodes (promocode, credits) VALUES (?,?);',
            [promocode, Number(credits)],
            function (err, dbres, fields) {
                if (err) return reject(null);
                return resolve(dbres);
            })
    })
};

function deleteUser(username) {
    return new Promise((resolve, reject) => {
        conn.query('DELETE FROM users WHERE username = ?;',
            [username],
            function (err, dbres, fields) {
                if (err) return reject(null);
                return resolve(dbres);
            })
    })
};

function findAllUser() {
    return new Promise((resolve, reject) => {
        conn.query('Select * from users',
            function (err, dbres, fields) {
                if (err) return reject(null);
                return resolve(dbres);
            })
    })
};

function findAllPromo() {
    return new Promise((resolve, reject) => {
        conn.query('Select * from promocodes',
            function (err, dbres, fields) {
                if (err) return reject(null);
                return resolve(dbres);
            })
    })
};


function findByUsername(username) {
    return new Promise((resolve, reject) => {
        conn.query('Select * from users where username=?', [username],
            function (err, dbres, fields) {
                if (err) return reject(null);
                if (dbres.length == 0)
                    return resolve(false)
                else
                    return resolve(dbres[0]);
            })
    })
};

function readToken() {
    return new Promise((resolve, reject) => {
        conn.query('select * from auth WHERE id = 0',
            function (err, dbres, fields) {
                if (err) return reject(null);
                return resolve(dbres[0]);
            })
    })
};

function updateCreditForUser(username, totalcredits) {
    return new Promise((resolve, reject) => {
        conn.query('UPDATE users SET credits = ? WHERE username = ?', [Number(totalcredits), username],
            function (err, dbres, fields) {
                if (err) return reject(null);
                return resolve(dbres);
            })
    })
};

function updatePromo(old_promocode, credits, new_promocode) {
    return new Promise((resolve, reject) => {
        conn.query('UPDATE promocodes SET promocode = ? , credits = ? WHERE promocode = ?', [ new_promocode, Number(credits), old_promocode],
            function (err, dbres, fields) {
                if (err) return reject(null);
                return resolve(dbres);
            })
    })
};

function updateToken(id, token) {
    return new Promise((resolve, reject) => {
        conn.query('UPDATE auth SET token = ? WHERE id = ?', [ token, id],
            function (err, dbres, fields) {
                if (err) return reject(null);
                return resolve(dbres);
            })
    })
};


function updateUser(id, username) {
    id = Number(id)
    return new Promise((resolve, reject) => {
        let query = 'UPDATE users SET ';
        let updatefields = [];
        for (const key in username) {
            if (isNaN(username[key])) {
                if (key == 'created_date') {
                   // updatefields.push(`${key} = STR_TO_DATE("${username[key]}", "%m-%d-%Y")`)
                } else {
                    updatefields.push(`${key} = '${username[key]}'`)
                }
            } else if(key =="promocode"){
                updatefields.push(`${key} = ''`)
            } else{
                updatefields.push(`${key} = ${username[key]}`)
            }
        }
        query = query + updatefields.join(",") + ' WHERE id = ' + Number(id)
        conn.query(query,
            function (err, dbres, fields) {
                if (err) return reject(null);
                return resolve(dbres);
            })
    })
};


function findPromo(promocode) {
    return new Promise((resolve, reject) => {
        conn.query('Select * from promocodes where promocode=?', [promocode],
            function (err, dbres, fields) {
                if (err) return reject(null);
                if (dbres.length == 0)
                    return resolve(false)
                else
                    return resolve(dbres[0]);
            })
    })
};

function deletePromo(promocode) {
    return new Promise((resolve, reject) => {
        conn.query('delete from promocodes where promocode=?', [promocode],
            function (err, dbres, fields) {
                if (err) return reject(null);
                return resolve(dbres);
            })
    })
};

// conn.end(function (err) { 
//     if (err) throw err;
//     else  console.log('Done.') 
//     });


module.exports.insertUser = insertUser
module.exports.deleteUser = deleteUser
module.exports.findPromo = findPromo
module.exports.insertPromo = insertPromo
module.exports.deletePromo = deletePromo
module.exports.findByUsername = findByUsername
module.exports.findAllPromo = findAllPromo
module.exports.findAllUser = findAllUser
module.exports.updateCreditForUser = updateCreditForUser
module.exports.updateUser = updateUser
module.exports.updatePromo = updatePromo
module.exports.updateToken = updateToken
module.exports.readToken = readToken