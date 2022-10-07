const express = require("express");
const bodyParser = require("body-parser");
const {v4 : uuidv4} = require("uuid");
const e = require("express");
const port = 3000;
const app = express();
const {createClient} = require('redis');
const md5 = require('md5');

const redisClient = createClient(
{
    Url:"redis://default@localhost:6379",
}
);

app.use(bodyParser.json());

app.listen(port, async ()=>{
    await redisClient.connect();
    console.log('Listening on port '+port);
});


app.get("/", (req,res)=>{
    res.send("Hello World!")
});

app.post('/user', async (req,res)=>{
    const newUserRequestObject = req.body;
    console.log('New User:',JSON.stringify(newUserRequestObject));
    newUserRequestObject.password = md5(newUserRequestObject.password);
    redisClient.hSet('users',req.body.email,JSON.stringify(newUserRequestObject));
    res.send('New User'+newUserRequestObject.email+'added');
});

app.post("/login", async (req,res)=>{
    
    const loginEmail = req.body.userName;
    console.log(JSON.stringify(req.body));
    console.log("loginEmail", loginEmail);
    const loginPassword = req.body.password;
    console.log("loginPassword", loginPassword);
    const userString = await redisClient.hGet("users", loginEmail);
    const userObject = JSON.parse(userString);
    if (userString == "" || userString == null){
        res.status(404);
        res.send("User not found");
    }
    else if (md5(loginPassword) == userObject.password){
        const token = uuidv4();
        res.send(token)
        // if there is no status change it is all ok or 200
    } else{
        res.status(401);
        res.send("Invalid user or password");
    }    
});
