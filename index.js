const express = require('express');
const port = 8080;
const app = express();
const db = require('./config/mongoose');

app.set('view engine', 'ejs'); 
app.use(express.static(__dirname + '/views'));

app.use('/', require('./routes'));

app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
