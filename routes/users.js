const express = require('express');

// const router = express.Router();
const router = require('express-promise-router')();

const userController = require('../controllers/users')

const passport = require('passport')

const passportConfig = require('../middlewares/passport')

// Authentication 
router.route('/register').post(userController.register)

router.route('/login').post(passport.authenticate('local',{session:false}),userController.login)

router.route('/secret').get(passport.authenticate('jwt', {session: false}),userController.secret)

// CRUD User 
router.route('/users')
    .get(userController.index)
    .post(userController.createUser)

router.route('/:userId')
    .get(userController.show)
    .put(userController.replace)
    .patch(userController.update)
    .delete(userController.destroy)

router.route('/forgotpassword').post(userController.forgotpassword)
router.route('/resetpassword/:hashcode').post(userController.resetpassword)

router.route('/:userId/decks')
    .get(userController.getUserDeck)
    .post(userController.createUserDeck)





module.exports = router;