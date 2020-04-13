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

app.use( require('./routes/index') ); 
// connect to database
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect( process.env.URLDB, {
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