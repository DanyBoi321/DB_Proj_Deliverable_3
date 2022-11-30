const dotenv = require("dotenv");
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser')
dotenv.config({path:".env"});
const app = express();
app.use(bodyParser.urlencoded({extended:true}));

/*
//DO NOT MODIFY ANY PART OF THIS CODE USELESS TOLD TO DO SO.
*/ 
/*Add you connestion details to the env file*/
var connectionString = mysql.createConnection(
    {
        host:process.env.host,
        user: process.env.user,
        password:process.env.password
    }
);
function createTable(CreateQuerry)
{
    /*
    The function is responsible for creating tables in your database. Do not modify it.

    */
    connectionString.query(CreateQuerry,
        (err,result)=>
        {
            if(err)
            {
                console.log("Table creation failed");
                console.log(err);
            }
            else
            {
                console.log("Table created");
                //console.log(result);
            }
        });
}

/*
    Here you will be writing your create table queries and storing them in a const variable.
*/

const Users = `CREATE TABLE IF NOT EXISTS ${process.env.database}.Users ( 
                                                                            User_id INT PRIMARY KEY,
                                                                            User_Name VARCHAR(255),
                                                                            User_Password VARCHAR(255),
                                                                            User_Email VARCHAR(255)
                                                                        )`;

const Guests = `CREATE TABLE IF NOT EXISTS ${process.env.database}.Guests (
                                                                            G_User_id INT PRIMARY KEY,
                                                                            Reviews VARCHAR(255), /*table of reviews?*/
                                                                            Ratings FLOAT,
                                                                            Prev_stay VARCHAR(255)
                                                                        )`;

const Hosts = `CREATE TABLE IF NOT EXISTS ${process.env.database}.Hosts (
                                                                        H_User_id INT PRIMARY KEY,
                                                                        Reviews VARCHAR(255), /*table of reviews?*/
                                                                        Ratings FLOAT,
                                                                        Listings VARCHAR(255) /*table of listings?*/
                                                                    )`;

const Admin = `CREATE TABLE IF NOT EXISTS ${process.env.database}.Admin ( 
                                                                        A_User_id INT PRIMARY KEY
                                                                    )`;

const listings = `CREATE TABLE IF NOT EXISTS ${process.env.database}.listings (
                                                                                Listing_id INT PRIMARY KEY,
                                                                                L_Host_id INT,
                                                                                price FLOAT,
                                                                                location VARCHAR(255),
                                                                                availability VARCHAR(255),
                                                                                rating FLOAT,
                                                                                reviews VARCHAR(255), /*table of reviews?*/
                                                                                capacity INT,
                                                                        
                                                                                wifi boolean,
                                                                                parking boolean
                                                                                )`;

const bookings = `CREATE TABLE IF NOT EXISTS ${process.env.database}.bookings (
                                                                                Booking_id INT PRIMARY KEY,
                                                                                B_Guest_id INT,
                                                                                B_Listing_id INT,
                                                                                start_date VARCHAR(255),
                                                                                end_date VARCHAR(255),
                                                                                accepted boolean

                                                                                )`;

const supportTickets = `CREATE TABLE IF NOT EXISTS ${process.env.database}.supportTickets (
                                                                                            Ticket_id INT PRIMARY KEY,
                                                                                            T_Guest_id INT,
                                                                                            T_booking_id INT,
                                                                                            ticket_type VARCHAR(255),
                                                                                            description VARCHAR(255)
                                                                                            )`;

                                                                                
const reviews = `CREATE TABLE IF NOT EXISTS ${process.env.database}.reviews (
                                                                                Review_id INT PRIMARY KEY,
                                                                                review VARCHAR(255)
                                                                                )`;











connectionString.connect((error)=>
{
    if(!error)
    {
        console.log("Connection has been established");
        connectionString.query(`CREATE DATABASE IF NOT EXISTS ${process.env.database}`, (err2,result) =>
        {
            if(err2)
            {
                console.log(err2);
            }
            else
            {
                console.log("Database Created");
                /*
                Here you will be calling the createTable function to create each table passing the above created 
                variable as a paramter to the function.
                */

                createTable(Users);
                createTable(Guests);
                createTable(Hosts);
                createTable(Admin);
                createTable(listings);
                createTable(bookings);
                createTable(supportTickets);
                createTable(reviews);


                connectionString.end();
            }
        });
    }
    else
    {
        console.log("Connection failed");
        console.log(error);
    }
});