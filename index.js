// importing module
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const session = require('express-session');

// Init
const app = express();
const PORT = process.env.PORT || 3000;
//Middle wear

app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(mongoSanitize());

//connection to database 

mongoose.connect(`mongodb+srv://caspi:${process.env.DB_PASSWORD}@cluster0.wtmkx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,{ 
    useNewUrlParser: true ,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(()=>{
    console.log('connected');
}).catch(err =>{
    console.log(err);
})

const conn = mongoose.connection.then( ()=>{
    console.log('connection');
}).catch(err=>{
    console.log(err);
});

//Importing schema

//routers
// Importing admin router
const AdminRoutes = require('./routes/admin');
const ClinetRoutes = require('./routes/client')

app.use('/admin',AdminRoutes);
app.use('/',ClinetRoutes);

// Listing to server
app.use((req, res)=> {
    res.render("notFound.ejs")
});
app.listen(PORT,()=>{
    console.log(`localhost:${PORT}`);
})
