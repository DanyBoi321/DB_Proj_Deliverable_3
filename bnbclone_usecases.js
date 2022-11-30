const dotenv = require("dotenv");
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs');
const csv = require('csv-parser');
const { count } = require("console");
dotenv.config({path:".env"});
var app = express();
app.use(bodyParser.urlencoded({extended:true}));




var connectionString = mysql.createConnection(
    {
        host:process.env.host,
        user: process.env.user,
        password:process.env.password,
        database:process.env.database
    }
);




function seedData(query)
{
    return new Promise ((resolve, reject) => {
        connectionString.query(query, (err2, result) => {
            if (err2) {
                console.log("Seeding failed");
                reject(err2);
            }
            else {
                resolve();
                //console.log("Seeding done");
            }
        })
    })
}



function createListing(Listing_id , L_Host_id , price , location , availability , description , title , image_url , rating , reviews) {
    let query = `INSERT INTO Listings (Listing_id , L_Host_id , price , location , availability , description , title , image_url , rating , reviews) VALUES (${Listing_id} , ${L_Host_id} , ${price} , '${location}' , '${availability}' , '${description}' , '${title}' , '${image_url}' , ${rating} , ${reviews})`;
    seedData(query);
}



function createBooking(B_User_id , B_Listing_id , start_date , end_date , accepted = false) {
    let query = `INSERT INTO Bookings (B_User_id , B_Listing_id , start_date , end_date , accepted) VALUES (${B_User_id} , ${B_Listing_id} , '${start_date}' , '${end_date}' , ${accepted})`;  
    seedData(query);
}

    


// function that verifies a users old password and updates it to a new password


function updatePassword(User_id , old_password , new_password) {
    let query = `UPDATE Users SET password = '${new_password}' WHERE User_id = ${User_id} AND password = '${old_password}'`;
    return new Promise ((resolve, reject) => {
        connectionString.query
        (query, (err2, result) => {
            if (err2) {
                console.log("Update failed");
                reject(err2);
            }   
            else {
                resolve(result);
            }
        })
    })
}

// function updatePassword(User_id , password) {
//     let query = `UPDATE Users SET password = '${password}' WHERE User_id = ${User_id}`;
//     seedData(query);
// }   


// function to edit a listing
//pre-condition(s): //if host then host must have atleast one listing

function editListing(Listing_id , price , location , availability , description , title , image_url , rating , reviews) {
    let query = `UPDATE Listings SET price = ${price} , location = '${location}' , availability = '${availability}' , description = '${description}' , title = '${title}' , image_url = '${image_url}' , rating = ${rating} , reviews = ${reviews} WHERE Listing_id = ${Listing_id}`;
    seedData(query);
}   


// function to edit bookings if admin is logged in

function editBooking(B_User_id , B_Listing_id , start_date , end_date , accepted) {
    let query = `UPDATE Bookings SET start_date = '${start_date}' , end_date = '${end_date}' , accepted = ${accepted} WHERE B_User_id = ${B_User_id} AND B_Listing_id = ${B_Listing_id}`;
    seedData(query);
}   



connectionString.connect(async (err)=>
{
    if(err)
    {
        console.log(err);
    }
    
});