const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');
const secret = require('../config/secrets')
const router = require("express").Router();

const Users = require("../users/users-model.js");
const { isValid } = require("../users/users-service.js");

router.post('/register', (req, res) => {

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
 const credentials = req.body;

 if (isValid(credentials)) {
   const rounds = process.env.BCRYPT_ROUNDS || 8;

   // hash the password
   const hash = bcryptjs.hashSync(credentials.password, rounds);

   credentials.password = hash;

   // save the user to the database
   Users.add(credentials)
     .then(user => {
       res.status(201).json({ data: user });
     })
     .catch(error => {
       res.status(500).json({ message: error.message });
     });
 } else {
   res.status(400).json({
     message: "username and password required",
   });
 }


});

router.post('/login', (req, res) => {
  res.end('implement login, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */

 const { username, password } = req.body;

 if (isValid(req.body)) {
   Users.findBy({ username: username })
     .then(([user]) => {
       // compare the password the hash stored in the database
       if (user && bcryptjs.compareSync(password, user.password)) {
         const token = generateToken(user)
         res.status(200).json({ 
           message: "Welcome to our API",
           token: token
         });
       } else {
         res.status(401).json({ message: "Invalid credentials" });
       }
     })
     .catch(error => {
       res.status(500).json({ message: error.message });
     });
 } else {
   res.status(400).json({
     message: "please provide username and password and the password shoud be alphanumeric",
   });
 }
});

function generateToken(user) {
  
  const payload = {
    subject: user.id,
    username: user.username,
    role: user.role,
  }

  const options = {
    expiresIn: "1d"
  }

  const token = jwt.sign(payload, secret.jwSecret, options);

  return token;
  
}

module.exports = router;
