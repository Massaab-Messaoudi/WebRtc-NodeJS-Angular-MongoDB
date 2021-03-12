const express =require('express')
var jwt = require('jsonwebtoken');
const router = express.Router()
const AuthController =require('../Controllers/AuthController')
router.get('/',AuthController.select)
//router.get('/username',AuthController.username)
router.post('/register',AuthController.register)
router.post('/login',AuthController.login)
router.get('/username', verifyToken, function(req,res,next){
    return res.status(200).json(decodedToken.username);
  })
  
  var decodedToken='';
  function verifyToken(req,res,next){
    let token = req.query.token;
  
    jwt.verify(token,'secret', function(err, tokendata){
      if(err){
        return res.status(400).json({message:' Unauthorized request'});
      }
      if(tokendata){
        decodedToken = tokendata;
        next();
      }
    })}


module.exports = router