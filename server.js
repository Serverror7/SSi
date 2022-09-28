const express = require("express");
const bodyParser = require("body-parser");
const {v4 : uuidv4} = require("uuid");
const e = require("express");
const port = 3000;
const app = express();

app.use(bodyParser.json());


app.listen(port, async ()=>{
    console.log('Listening on port '+ port);
});


app.get("/", (req,res)=>{
    res.send("Hello World!")
});

app.post("/login", (req,res)=>{
    const loginEmail = req.body.userName;
    console.log(JSON.stringify(req.body));
    console.log("loginEmail", loginEmail);
    const loginPassword = req.body.password;
    console.log("loginPassword", loginPassword);
    res.send("Who are you");

    if (loginEmail == "mar22043@byui.edu" && loginPassword == "st6@nG"){
        const token = uuidv4();
    } else{
        res.status(401);
        res.send("Invalid user or password");
    }    
})
