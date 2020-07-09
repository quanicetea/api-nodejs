const User = require('../models/User');
const Deck = require('../models/Deck');
const JWT = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/index')
const randomstring = require('randomstring')
const encodeToken = (userId) => {
    return JWT.sign({
        iss: 'quân thái',
        sub: userId,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate()+ 3)
    },JWT_SECRET)
}

// Promise
// const index = (req, res, next) =>{
//     User.find({}).then((users)=>{
//         return res.status(200).json({users});
//     }).catch((err) => {
//         next(err);
//     });
// }


// const createUser = (req, res, next) =>{
//     console.log('req.body content ',req.body);
//     const newUser = new User(req.body);
//     console.log(newUser);
//     newUser.save().then(users => {
//         console.log('User: ',users);
//         return res.status(201).json({users});
//     }).catch(err => next(err));
// }

// const createUser = (req, res, next) =>{
//     console.log('req.body content ',req.body);
//     const newUser = new User(req.body);
//     console.log(newUser);
//     newUser.save((err,user) =>{
//         console.error('Error: ',err);
//         console.log('User: ',user);
//         return res.status(201).json({user});
//     })
// }


// dùng async await kèm pkg express promise router (ko cần catch để bắt lỗi)
const index = async (req, res, next) => {
    const users = await User.find({});
    return res.status(200).json({users});
}
const createUser = async (req, res, next) => {
    const newUser = new User(req.body);
    await newUser.save();
    return res.status(201).json({newUser});   
}
const show = async (req, res, next) => {
    const {userId} = req.params;
    const user = await User.findById(userId);
    if(user) return res.status(200).json({user})
    return res.status(404).json({message: 'user not found'})
}
const replace = async (req, res, next) =>{
    // replace toàn bộ các trường user 
    const { userId } = req.params; // tìm id của user hiện tại
    const newUser = req.body; // lấy các thông tin truyền lên
    const result = await User.findByIdAndUpdate(userId,newUser);
    return res.status(200).json({success: true});
}
const update = async (req, res, next) =>{
    // update 1 vài fields
    const { userId } = req.params; // tìm id của user hiện tại
    const newUser = req.body; // lấy các thông tin truyền lên
    const result = await User.findByIdAndUpdate(userId,newUser);
    return res.status(200).json({success: true});
}
const destroy = async (req, res, next) => {
    console.log("destroy")
    const {userId} = req.params;
    const user = await User.findById(userId);

    if(user){
        const result = await User.remove({_id:userId})
        return  res.status(200).json({message: success})
    }
    return res.status(404).json({message: 'user not found'})
    
}

const getUserDeck = async (req, res, next) => {
    const {userId} = req.params;
    const user = await User.findById(userId).populate('decks');
    console.log(user)
    return res.status(200).json({deck: user.decks});

}

const createUserDeck = async (req, res, next) => {
    const { userId } = req.params;
    const newDeck = new Deck(req.body);
    const user = await User.findById(userId);
    newDeck.owner = user;
    await newDeck.save();
    user.decks.push(newDeck._id);
    await user.save();
    return res.status(201).json({newDeck});
}

const register = async (req, res, next) => {
    const { firstName, lastName, email, password} = req.body
    const newUser = new User({ firstName, lastName, email, password});
    await newUser.save();
    const token = encodeToken(newUser._id)
    res.setHeader('Authorization',token);
    return res.status(201).json({success: true})
}

const login = async (req, res, next) => {
    const token = encodeToken(req.user._id)
    res.setHeader('Authorization',token)
    res.status(200).json({message:'success'})
}

const forgotpassword = async (req, res, next) => {
    console.log("forgotpassword")
    
    const { email } = req.body;
    console.log(email)
    const user = await User.findOne({ email });
    
    if(user){ 
        
        const hashcode = await randomstring.generate(10)
        user.hashcode = hashcode
        user.save();
        return res.status(200).json({ url: 'localhost:3000/user/resetpassword/'+user.hashcode})
    }
    return res.status(404).json({message:'user not found'})
   
}

const resetpassword = async (req, res, next) => {
    console.log("resetpassword")

    const { hashcode } = req.params
    const user = await User.findOne({hashcode})

    if(user){
        const {password} = req.body
        user.password = password
        user.hashcode = ''
        user.save()
        return res.status(200).json({message: 'success'})
    }
    return res.status(404).json({message: 'invalid code or expired'})
}

const secret = async (req, res, next) =>{
    return res.status(200).json( {resource: true} )
}


module.exports = {
    login,
    secret,
    register,
    index,
    createUser,
    show,
    replace,
    update,
    getUserDeck,
    createUserDeck,
    destroy,
    resetpassword,
    forgotpassword
}