const express=require("express")
const app=express()
const mysql=require("mysql")
const BodyParser=require("body-parser")
const path=require("path")
const Bcrypt=require("bcrypt")
const session=require("express-session")
const ejs=require("ejs")
require("dotenv").config()
const {DateTime}=require("luxon")

const connection=mysql.createConnection(process.env.MYSQL_CON_STRING)

function createTable(CreateQuerry)
{
    /*
    The function is responsible for creating tables in your database. Do not modify it.

    */
    connection.query(CreateQuerry,
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

// We will be making our Tables here.
const queryForUsersTable = "CREATE TABLE Users(u_userid INT NOT NULL AUTO_INCREMENT, user_type VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, password_hash VARCHAR(255) NOT NULL, PRIMARY KEY(u_userid))";


/*var connectionString = mysql.createConnection(
    {
        host:process.env.host,
        user: process.env.user,
        password:process.env.password,
        database:process.env.database
    }
);*/


app.set("view engine","ejs")

app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))

app.use(express.static("resources"))
app.use(BodyParser.urlencoded({ extended:true }))

const Authenticationmiddleware = (req,res,next)=>{
    if(req.session.hasOwnProperty("user_id")){
        next()
    }
    else{
        res.redirect("/login.html")
    }
}


connection.connect((error)=>{
    if (error) {
        throw error;
    }
    else {
        console.log("Server connected to MySQL Successfully")
        //createTable function will be called here
        //createTable(queryForUsersTable);
    } 
    

})


app.get("/try",(req,res)=>{
    res.send("Hello World")
})

app.get("/",(req,res)=>{
    connection.query(`INSERT INTO Users(name,password,email) VALUES('${req.query.name}','${req.query.password}','${req.query.email}')`,(error,result)=>{
        if(error){
            throw error
            res.sendStatus(404)
        }
        else{
            res.send(`${req.query.name} has been added to the database`)
        }
    })
})

app.post("/signup",(req,res)=>{
    Bcrypt.hash(req.body.password, 10, (error,hashed_password)=>{
        if(error){
            throw error;
            res.sendStatus(404)
        }
        else{
            connection.query(`INSERT INTO Users(name,password_hash,email,user_type) VALUES('${req.body.fullname}','${hashed_password}','${req.body.email}', '${req.body.user_type}')`,(error,result)=>{
                if(error){
                    throw error
                    res.sendStatus(404)
                }
                else{
                    res.send(`${req.body.fullname}'s Sign Up has been successful`)
                }
            })
        }
    })
    
})


app.post("/login",(req,res)=>{
    const email= req.body.email
    const simple_password=req.body.password
    connection.query(`SELECT u_userid, name, password_hash, email, user_type FROM Users WHERE email='${email}'`,(error,result)=>{
        if(error){
            throw error;
            res.sendStatus(500)
        }
        else{
            console.log(result[0])
            const hashed_password=result[0].password_hash
            Bcrypt.compare(simple_password,hashed_password,(error,comparison_result)=>{
                if(error){
                    throw error;
                    res.sendStatus(404);
                }
                else{
                    if(result){
                        req.session.user_id=result[0].id
                        req.session.user_name=result[0].name
                        res.render("feed.ejs",{
                            name : req.session.user_name
                        })
                    }
                    else{
                        res.sendStatus(401)
                    }
                }
                
            })
        }
    })
})


app.get("/myprofile",Authenticationmiddleware,(req,res)=>{
    res.render("myprofile.ejs",{
        name : req.session.user_name
    })
})


app.get("/myfeed",Authenticationmiddleware,(req,res)=>{
    res.render("feed.ejs",{
        name : req.session.user_name
    })
})


app.post("/post/new",Authenticationmiddleware,(req,res)=>{
    if(req.body.hasOwnProperty("content") && req.body.content != ""){
        connection.query("INSERT INTO Posts(content,user_id) VALUES(?,?)",[req.body.content,req.session.user_id],(error,result)=>{
            if (error) throw error
            else res.sendStatus(201)
        })
    }
    
    else{
        res.sendStatus(400)
    } 
    
     
})


app.get("/post/all",Authenticationmiddleware,(req,res)=>{
    connection.query("SELECT Posts.id,Posts.content, Posts.date_posted, Users.name FROM Posts INNER JOIN Users ON Posts.user_id=Users.id",(error,result)=>{
        if (error) res.sendStatus(500)
        else{
            const final = result.map(post=>{
                post.date_posted=DateTime.fromJSDate(post.date_posted).toFormat('yyyy LLL dd')
                return post
            })
            res.json(final)
        } 
        
    })
})


app.get('/logout',Authenticationmiddleware,(req,res)=>{
    req.session.destroy()
    res.redirect("/login.html")
})

app.listen(3000, ()=>{
    console.log("Server is listening at port 3000")
})