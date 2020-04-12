// get constants
require('./config/config');

const mongoose = require('mongoose');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use( require('./routes/usuario') ); 
// connect to database
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/cafe', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
    if(err) {
        console.log(err);
    }
    console.log('DB connected');
});

app.listen(process.env.PORT, () => {
    console.log('Listening port: ', process.env.PORT);
});