const express = require('express')
const app = express()
const sqlite3 = require('sqlite3').verbose();


//Required for login
var username = 'username'
var password1 = 'password'

//Required for sign up 
var firstname = 'firstname'
var lastname = 'lastname'
var email = 'email@email.com'

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

  username = request.query.username;
  password1 = request.query.password1;

  console.log(username + ' ' + password1)

  let sql = "SELECT Password FROM accountInfo WHERE Username='" + username +"'";

  db.all(sql, [], (err, row) => {
    if (err) {
      return console.error(err.message);
    }

    console.log(row.Password)

  })

})

//signup and signup checking

app.get('/signup', function (request, response) {

  response.render('signup-page')
})


app.get('/signup-check', function (request, response) {

  username = request.query.username;
  password1 = request.query.password1;
  password2 = request.query.password2;
  firstname = request.query.firstname;
  lastname = request.query.lastname;
  email = request.query.email;

  let sql = "SELECT Username, Email FROM accountInfo WHERE Username = '" + username + "' OR Email = '" + email + "'";


  //IMPLEMENT LATER CHECKING IF PW AND CONFIRM PW IS THE SAME, PASSWORD VALIDITY, SAME USERNAME AND EMAIL
  /* db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }

    console.log(rows)

    if (rows == null) {

      db.run(`INSERT INTO accountInfo(Username, Password, FirstName, LastName, Email) VALUES(?, ?, ?, ?, ?);`, (username), (password1), (firstname), (lastname), (email), function (err) {
        if (err) {
          return console.log(err.message);
        }
        console.log(`A row has been inserted`);
      })
    }
    else {
      response.redirect('/invalid-signup');
      return;

    }
  }) */

  db.run(`INSERT INTO accountInfo(Username, Password, FirstName, LastName, Email) VALUES(?, ?, ?, ?, ?);`, (username), (password1), (firstname), (lastname), (email), function (err) {
    if (err) {
      return console.log(err.message);
    }
    console.log(`A row has been inserted`);
  })

  response.redirect('/login')

});




/* app.get('/signup-check', function (request, response) {
 
  username = request.query.username;
  password = request.query.password;
 
  db.run(`INSERT INTO responses(Name, Willing, Age, Password) VALUES(?, ?, ?, ?);`, (name), (willing), (age), (password), function (err) {
    if (err) {
      return console.log(err.message);
    }
    console.log(`A row has been inserted`);
  });
 
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row);
    });
  });
 
  response.redirect('/signup-confirm')
}) */

/* app.get('/display', function (request, response) {
 
  response.send('Name: ' + name + ' Willingness: ' + willing + ' Age: ' + age + ' Password: ' + password);
}) */

app.listen(8080, function () {
  console.log('Server listening on port 8080');

});


/* 
1/19/19 Yibo
*/

//Home Page after clubs log in
app.get('/club-home', function(request,response){
  username = request.query.username;
  db.run(`CREATE TABLE IF NOT EXISTS` + username + '_application' + `(
    Userid INTEGER PRIMARY KEY
    name TEXT NOT NULL
    email text NOT NULL UNIQUE
    year INTEGER 
    question1 TEXT NOT NULL
    question2 TEXT NOT NULL
    question3 TEXT 
    question4 TEXT 
    question5 TEXT 
  );`);
  response.render('club-home');
})

//After the submission of forms
app.get('/submitted', function(request, response){
  userid = request.query.userid;
  name = request.query.name;
  email = request.query.email;
  year = request.query.year;
  question1 = request.query.question1;
  question2 = request.query.question2;
  question3 = request.query.question3;
  question4 = request.query.question4;
  question5 = request.query.question5;

  db.run(`INSERT INTO club_name(Userid, first_name, last_name, email, year, question1, question2, question3, question4, question5) VALUES(?,?,?,?,?,?,?,?);` (userid), (name), (email), (year), (question1), (question2), (question3), (question4), (question5))
  response.render('submitted');
})

app.get('/personal-info', function(request,response){
  userid = request.query.userid;
  
  db.run('SELECT * FROM accountinfo ')
})