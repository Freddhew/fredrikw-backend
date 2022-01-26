const credentials = {secretUser:"user" , secretPassword:"password"}
const cors = require("cors")
const express = require("express")
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const path = require('path')
const https = require('https')
const fs = require('fs');
const { homedir } = require("os");


const app = express()
const PORT = process.env.PORT || 80

const sslPORT = 3443

let headers
let body

app.use(function (req, res, next) {
   res.setHeader( 'Content-Security-Policy', "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'");
   // res.send('This is a SSL Server')
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

      console.log("Your token: " + token)
      res.send(path.join(__dirname, '/html/home.html'));
      // res.status(200).send(token)

      // app.get('/', function( req, res ) { //Eget försök för att ge access till ny sida efter login 
      //    console.log("Attempted to open the home page")
      //  });

  }else{
      console.log("Not authorized")
      res.status(200).send({"STATUS":"FAILURE"})
   }
});

const sslServer = https.createServer({
   key: fs.readFileSync(path.join(__dirname, 'certificate', 'key.pem')),
   cert: fs.readFileSync(path.join(__dirname, 'certificate', 'cert.pem')),
}, app)

app.listen(PORT , ()=>{console.log(`Server is up and running on port ${PORT}`)});
sslServer.listen(sslPORT , ()=>{console.log(`Open SSL is up and running on port ${sslPORT}`)});