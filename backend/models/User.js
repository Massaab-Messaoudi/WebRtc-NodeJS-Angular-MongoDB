const mongoose = require('mongoose')
const Schema = mongoose.Schema
var bcrypt = require('bcrypt');
const usershema = new Schema({
    username:
    {
        type: String
    },
    email:
    {
        type: String
    },
    password:
    {
        type: String
    }

},{timestamps:true}) // timestamps : true => tose feilds will automaticly created
usershema.statics.hashPassword = function hashPassword(password){
    return bcrypt.hashSync(password,10);
}

usershema.methods.isValid = function(hashedpassword){
    return  bcrypt.compareSync(hashedpassword, this.password);
}
/*usershema.methods.isValid = function(hashedpassword){
    return this.password.localeCompare(hashedpassword);
}*/
const User= mongoose.model('User',usershema)
module.exports = User