const User = require('../models/User')

//show the list of the employees
const select=(req,res,next)=>
{
    User.find()
    .then(response=>
        {
            res.json({response})
            
        })
    .catch(error=>
        {
            res.json({message :'Error has been occured'})
        })    
}
// store a new user in the data base
const insert =(req,res,next)=>
{
 let user=new User({    
 username:req.body.username,
 email:req.body.email,
 password:req.body.password
 })
 user.save()
 .then(response=>
    {
        res.json({message:'User added sucussfully'})
       
    })
  .catch(error=>
    {
    
        res.json({message:'Error has been occured'})
    })   
}

//login
const login=(req,res,next)=>
{
 
    let promise = User.findOne({username:req.body.username}).exec();

    promise.then(function(doc){
     if(doc) {
       if(doc.isValid(req.body.password)){
           // generate token
           let token = jwt.sign({username:doc.username},'secret', {expiresIn : '3h'});
 
           return res.status(200).json(token);
 
       } else {
         return res.status(501).json({message:' Invalid Credentials'});
       }
     }
     else {
       return res.status(501).json({message:'User email is not registered.'})
     }
    });
 
    promise.catch(function(err){
      return res.status(501).json({message:'Some internal error'});
    })
 }


module.exports={ select , insert,login}