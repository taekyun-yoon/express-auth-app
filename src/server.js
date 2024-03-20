const express = require('express');
const path = require('path');
const { default: mongoose } = require('mongoose');

const app = express();
const PORT = 3000;

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.connect(`mongodb+srv://paul:wizen5128@express-auth-project.qvfovwd.mongodb.net/?retryWrites=true&w=majority&appName=express-auth-project`)
    .then(() => console.log('mongodb connected'))
    .catch(err => console.log(err));

app.listen(PORT, () => {
    console.log(`listening on ${PORT}...`);
});


app.get('/login', function(req, res, next) {
    res.render('login');
});

app.post('/login', function(req, res, next) {
});

app.get('/signup', function(req, res, next) {
    res.render('signup');
});

app.post('/signup', function(req, res, next) {
});