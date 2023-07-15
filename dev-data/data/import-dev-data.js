const mongoose = require('mongoose');
const fs = require('fs');
const tour = require('./../../models/tourModel');
const dotenv = require('dotenv')
dotenv.config({path :'./config.env'});


const db = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)
const dbLocal = process.env.DATABASE_LOCAL

mongoose.connect(dbLocal).then(con => {
    //console.log(con.connections);
    console.log('Connected to the Database!');
})



const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'));


const importData = async () =>{
    try{
        await tour.create(tours);
        console.log('Data inserted successfully');
    }catch(err){
        console.log(err);
    }
}

const deleteData = async () =>{
    try{
        await tour.deleteMany();
        console.log('Data deleted successfully');
    }catch(err){
        console.log(err);
    }
}

console.log(process.argv);

if(process.argv[2] === '--import')
    importData();
else if(process.argv[2] === '--delete')
    deleteData();
