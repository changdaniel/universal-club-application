const express = require('express')
const app = express()
const sqlite3 = require('sqlite3').verbose();


//Required for login
var email = 'email@email.com'
var password1 = 'password'

//Required for sign up 
var firstname = 'firstname'
var lastname = 'lastname'

//IMPLEMENT LATER CHECKING PASSWORD AND CONFIRM PASSWORD
var password2 = 'password'

//opening and checking database file
let db = new sqlite3.Database('./accounts.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to accounts.db');
});

let sql = `SELECT * from accountInfo`;

db.all(sql, [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(row);
  });
});

app.set('view engine', 'pug')


//home page 

app.get('/', function (request, response) {
  response.render('home-page')
})

//login and login checking

app.get('/login', function (request, response) {

  response.render('login-page')
})

app.get('/login-check', function (request, response) {

  email = request.query.email;
  password1 = request.query.password1;

  console.log(email + ' ' + password1)

  let sql = "SELECT Password FROM accountInfo WHERE Email = '" + email + "'";

  db.each(sql, [], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    console.log(sql)
    console.log(row)

    if (row.Password == password1) {
      console.log('logged in!')
    }

  })

})

//signup and signup checking

app.get('/signup', function (request, response) {

  response.render('signup-page')
})


app.get('/signup-check', function (request, response) {

  email = request.query.email;
  password1 = request.query.password1;
  password2 = request.query.password2;
  firstname = request.query.firstname;
  lastname = request.query.lastname;


  let sql = "SELECT Email FROM accountInfo WHERE Email = '" + email + "'";
  console.log('before each method')
  console.log(sql)
  //Checking signups only for duplicate emails
  //IMPLEMENT LATER CHECKING IF PW AND CONFIRM PW IS THE SAME, PASSWORD VALIDITY, SAME USERNAME AND EMAIL
  db.each(sql, [], (err, row) => {

    console.log('after each method')
    if (err) {
      return console.error(err.message);
    }
    console.log(sql)
    console.log(row.Email)

    response.redirect('/invalid-signup')
    return;



  })


  db.run(`INSERT INTO accountInfo(Email, Password, FirstName, LastName) VALUES(?, ?, ?, ?);`, (email), (password1), (firstname), (lastname), function (err) {
    if (err) {
      return console.log(err.message);
    }
    console.log(`A row has been inserted`);
    response.redirect('/login')

  })


});

app.get('/invalid-signup', function (request, response) {

  response.render('invalid-signup-page')
})

/* app.get('/display', function (request, response) {
 
  response.send('Name: ' + name + ' Willingness: ' + willing + ' Age: ' + age + ' Password: ' + password);
}) */

app.listen(8080, function () {
  console.log('Server listening on port 8080');

});