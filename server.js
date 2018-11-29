const express = require('express')

let submissions = 0
let questions = []

const app = express()

app.set('view engine','pug')

app.get('/', function(request,response){
    response.render('input-form')
})

app.get('/view-form', function(request, response){
    submissions++
    questions[0]=request.query.Q1
    questions[1]=request.query.Q2
    questions[2]=request.query.Q3

    response.redirect('/view')
})

app.get('/view', function(request, response){
    response.render('view', {
        questions: questions
    })
})

app.get('/done',function(request,response){

})

app.listen(8080, function(){
    console.log('Server listening on port 8080')
})