const credentials = {secretUser:"user" , secretPassword:"password"}
const cors = require("cors")
const express = require("express")
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const path = require('path')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate")

const app = express()
process.env.PORT = 5500
const PORT = process.env.PORT

let headers
let body

app.use(function (req, res, next) {
   res.setHeader( 'Content-Security-Policy', "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'");
   next();
});

app.use('/healthcheck', require('./routes/healthcheck.routes')); // CARE! routes/healthcheck var tidigare /healthcheck (only)
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.get("/", ( req, res ) => {
   headers={"http_status":200, "cache-control":  "no-cache"}
   body={"status": "available"}
   res.status(200).send(body)
})

app.get("/health", (req ,res)=>{
   headers={"http_status":200, "cache-control":  "no-cache"}
   body={"status": "available"}
   res.status(200).send(body)
})

app.post('/authorize', ( req, res ) => {
   let user = req.body.user;
   let password = req.body.password;

   if(user===credentials.secretUser && password===credentials.secretPassword){
      console.log("Successfully logged in!")
      console.log("Authorized")
      const token = jwt.sign({
            data: 'foobar'
      }, 'your-secret-key-here', { 
         expiresIn: 60 * 60 
      }); 

      console.log(token)
      res.status(200).send(token)

      app.get('/', function( req, res ) { //Eget försök för att ge access till ny sida efter login 
         console.log("Attempted to open the home page")
         res.sendFile(path.join(__dirname, '/html/home.html'));
       });

  }else{
      console.log("Not authorized")
      res.status(200).send({"STATUS":"FAILURE"})
   }
});

app.listen(PORT , ()=>{
     console.log(`Server is up and running on port ${PORT}`)
});