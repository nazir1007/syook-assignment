const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

mongoose.connect('mongodb://localhost:27017/timeseries', {
  useNewUrlParser: "true",
  useUnifiedTopology: "true"
});

const db = mongoose.connection;

db.on('error',  console.error.bind(console, 'error connecting to db'));

db.once('open', () => {
    console.log('Successfully connected to the database');
})
