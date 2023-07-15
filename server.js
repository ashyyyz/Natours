const mongoose = require('mongoose');
const dotenv = require('dotenv')

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('Uncaught Exception!, Shutting down...')
    process.exit(1);
})
dotenv.config({path :'./config.env'});
const app = require('./app')
//START SERVER
// console.log(app.get('env')); //It is an environment variable which is global and is set by express and by default the env variable is development and there are two environments development or production

//Node also sets many environment variables let us see those 
//console.log(process.env);
//In express many packages depend on environment variable node env 
//port on which the request will be listened


const db = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)
const dbLocal = process.env.DATABASE_LOCAL

mongoose.connect(dbLocal).then(con => {
    //console.log(con.connections);
    console.log('Connected to the Database!');
})




const port = process.env.PORT  
const server = app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});


//Handling Unhandled Rejections
process.on('unhandledRejection', err=>{
    console.log(err.name, err.message);
    console.log('UnHandled Rejection, Shutting Down....');
    server.close(() => {
        process.exit(1);
    })
})
