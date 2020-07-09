;const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcryptjs = require('bcryptjs')
const UserSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password:{
        type: String,
        require: true,
    },
    hashcode:{
        type: String
    },
    decks: [{
        type: Schema.Types.ObjectId,
        ref: 'Deck',

    }]
});
UserSchema.pre('save', async function(next){
    console.log("password: ", this.password)
    // gen a salt
    const salt = await bcryptjs.genSalt(10)
    console.log("salt: ", salt)
    // hash password
    const passwordBcrypt = await bcryptjs.hash(this.password,salt)
    console.log("passwordBcrypt: ", passwordBcrypt)
    // assign password
    this.password = passwordBcrypt
    next();
})

UserSchema.methods.isValidPassword = async function(password){
    try {
        return await bcryptjs.compare(password,this.password)
    } catch (error) {
        throw new Error(error)
    }
}


const User = mongoose.model('User',UserSchema);

module.exports = User;