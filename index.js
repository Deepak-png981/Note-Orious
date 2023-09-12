const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const notesRoutes = require('./routes/notes');

const app = express();
const PORT = 3000;

//connection to mongoDB
connectDB();

//middleware
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/notes', notesRoutes);


app.listen(PORT, () => {
    console.log(`Server is running fine on port : ${PORT} `);
})