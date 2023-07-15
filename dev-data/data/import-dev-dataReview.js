const mongoose = require('mongoose');
const fs = require('fs');
const review = require('./../../models/review');
const dotenv = require('dotenv')
dotenv.config({path :'./config.env'});


const db = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)
const dbLocal = process.env.DATABASE_LOCAL

mongoose.connect(dbLocal).then(con => {
    //console.log(con.connections);
    console.log('Connected to the Database!');
})



const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,'utf-8'));


const importData = async () =>{
    try{
        await review.create(reviews);
        console.log('Data inserted successfully');
    }catch(err){
        console.log(err);
    }
}

const deleteData = async () =>{
    try{
        await review.deleteMany();
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
