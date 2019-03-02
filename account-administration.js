const express = require('express')
const app = express()
const sqlite3 = require('sqlite3').verbose();

//Required for user login
var email = 'email@email.com'
var id = 0;
var password = 'password';
//Required for club login


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

  console.log(request.query.email + ' ' + request.query.password)

  let sql = "SELECT * FROM accountInfo WHERE Email = '" + request.query.email + "'";

  db.each(sql, [], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    console.log(sql)
    console.log(row)

    if (row.Password == password) {
      console.log('logged in!')
      email = row.Email;
      id = row.Userid;
      response.redirect("/directory")
      return;

    }
    else {
      console.log('incorrect password')
    }

  })

})

//signup and signup checking

app.get('/signup', function (request, response) {

  response.render('signup-page')
})


app.get('/signup-check', function (request, response) {

  email = request.query.email;
  password = request.query.password;
  var firstname = request.query.firstname;
  var lastname = request.query.lastname;


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

    response.redirect('/invalid-signup-page')
    return;
  })

  db.run(`INSERT INTO accountInfo(Email, Password, FirstName, LastName) VALUES(?, ?, ?, ?);`, (email), (password), (firstname), (lastname), function (err) {
    if (err) {
      return console.log(err.message);
    }
    console.log(`A row has been inserted`);
    response.redirect('/login')
    return;
  })


});

app.get('/invalid-signup', function (request, response) {

  response.render('invalid-signup-page')
})

/* app.get('/display', function (request, response) {
 
  response.send('Name: ' + name + ' Willingness: ' + willing + ' Age: ' + age + ' Password: ' + password);
}) */


//club account administration

app.get('/club-signup', function (request, response) {

  response.render('club-signup-page')
})

app.get('/club-login', function (request, response) {

  response.render('club-login-page')
})

app.get('/club-login-validation', function (request, response) {

  let sql = "SELECT * FROM clubInfo WHERE ClubName = '" + request.query.clubname + "'";

  db.each(sql, [], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    console.log(sql)
    console.log(row)

    if (row.ClubPassword == request.query.clubpassword) {
      console.log('club logged in!')

    }
    else {
      console.log('incorrect password')
    }

  })
})

app.get('/club-signup-validation', function (request, response) {

  let sql = "SELECT ClubName FROM clubInfo WHERE ClubName = '" + request.query.clubname + "'";
  console.log('before each method')
  console.log(sql)

  db.each(sql, [], (err, row) => {

    console.log('after each method')
    if (err) {
      return console.error(err.message);
    }
    console.log(sql)

    response.redirect('/invalid-signup-page')
    return;
  })

  db.run(`INSERT INTO clubInfo(ClubName, ClubPassword) VALUES(?, ?);`, (request.query.clubname), (request.query.clubpassword), function (err) {
    if (err) {
      return console.log(err.message);
    }
    console.log(`A club row has been inserted`);
    response.redirect('/club-login')
    return;
  })

})

//directory

app.get('/directory', function (request, response) {

  var sql = "select ClubName from clubInfo";
  var clubnames = [];

  db.each(sql, [], (err, row) => {
    if (err) {
      throw err;
    }
    clubnames = row['ClubName']
    console.log(clubnames)
    response.render('directory-page', {clubnames, clubnames})
    return;
    })

  })


function directoryFetch() {

}




app.listen(8080, function () {
  console.log('Server listening on port 8080');

});