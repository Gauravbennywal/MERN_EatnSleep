const express = require('express');
const app = express();
const port = 5000;
const connectDB = require('./db');

connectDB(); // Call the connectDB function to connect to MongoDB

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Allow requests from any origin))
  res.header(
    'Access-Control-Allow-Headers', // Allow any headers
    'Origin, X-Requested-With, Content-Type, Accept'
    ); 
  next();
})

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use(express.json());
app.use('/api', require('./Routes/CreateUser'));
app.use('/api', require('./Routes/DisplayData'));
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});








// const express = require('express')
// const app = express()
// const port = 5000
// const mongoDB = require('./db');
// mongoDB();
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })