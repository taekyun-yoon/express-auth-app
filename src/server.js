const express = require('express');
const path = require('path');
const { default: mongoose } = require('mongoose');

const app = express();
const PORT = 3000;

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(`mongodb+srv://paul:wizen5128@express-auth-project.qvfovwd.mongodb.net/?retryWrites=true&w=majority&appName=express-auth-project`)
    .then(() => console.log('mongodb connected'))
    .catch(err => console.log(err));

app.listen(PORT, () => {
    console.log(`listening on ${PORT}...`);
});
