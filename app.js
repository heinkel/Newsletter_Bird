const express = require('express');
const request = require('request');
const app = express();
const bodyParser = require('body-parser');
const myAPI = require('./config');
const API_KEY = myAPI.config(); // API KEY 
 


const port = process.env.PORT; //this is a Heroku resolved address previous I was posting in local 3000 now Heroku decide for me.

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get('/',  (req, res) =>  res.sendFile(__dirname + "/" + "signup.html"));

app.post('/errorMessage.html',(req,res) => res.sendFile(__dirname + "/" +"signup.html") );

app.post('/',  (req, res) => {
    var firstName = req.body.FName;
    var lastName = req.body.LName;
    var email = req.body.Email;

    var data = {   //this Object  will content the body information to sent to mailchimp sever
        members : [
            {email_address :email,
             status : "subscribed",
             merge_fields: {
                 FNAME: firstName,
                 LNAME: lastName
             }   
            }
        ]
    }

   
    var options = {
        url: "https://us4.api.mailchimp.com/3.0/lists/f27907fe33",  //last number is the mailchimp list ID
        method: "POST",
        headers: {
       
          "Authorization": `JapanAllBrands ${API_KEY}`  
            //just a number to get  Authorization
        },
        body: JSON.stringify(data)  //data JSON element will be convert to string and store into jsonData

    };
 

    request(options, (error,response,body)=> {
        if(error) {
            console.log(error);
            res.sendFile(__dirname + "/" + "errorMessage.html");
        }
        else{
            if (response.statusCode === 200)
              res.sendFile(__dirname + "/" +"success.html");
            else
                res.sendFile(__dirname + "/" +"errorMessage.html");
            console.log(response.statusCode);
            //allows to know if there are any error conection while attempting to connect with server , when the are no local errors.
        }
    });

});

   
app.listen(port || 3000, () => console.log(`Server is running. Port determined by Heroku | if localhost port :3000`));

// API key: 
//check .env file
//last tree numbers represent the sever where my api key is allocated and processed

// unique ID for mailchimp List : check audience settings listID


//HEROKU GUIDE
//to let Heroku know that we will use this file as JS file as server we should create file Procfile inside project folder
//1) writing -> web: node app.js   / where app.js is the name of server file.

//2) update all final changes in a git repositoty and commit the last changes.

//3)Deploy the app using command: heroku create, previously should be log in heroku using your account
//If nothing looks red , your heroku server container should be created.

//4) final step.command:  git push heroku master
//this send your repo to heroku's servers and uplaod project online, in the given address from heroku
// this project for example will be posted in 
//     https://salty-basin-43606.herokuapp.com/ deployed to Heroku
