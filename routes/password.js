const express = require('express');
const router = express.Router();
const data = require('../controller/data');
const bcrypt = require('bcrypt');
const Cookies = require('cookies');
const {showAlert} = require("../controller/data");
const dbModels = require("../models");
const keys = ['keyboard cat']


//----------------------------------------------------------------------------------------------------------------------

//go to the password page
router.post("/password", async (req, res
    , next) => {
    const cookies = new Cookies(req, res, {keys: keys});
    const Limit = cookies.get('timeLimit', {signed: true})
    if (!Limit) {
        cookies.set('timeLimit', new Date().toISOString(), {signed: true, maxAge: 60 * 1000});
        req.session.Error = 'Register failed, you took to long to register';
        res.redirect('/logIn');
    } else {
        let f = data.checkPassword(req.body.Password, req.body.PasswordConfirmation);
        if (f) {
            let hashedPassword = await bcrypt.hash(req.body.Password, 10)
            dbModels.User.findOne({
                where:{
                    email : req.session.email
                }
            }).then(user =>{
                if(user == null){
                    let USER = dbModels.User.create({
                        email:req.session.email,
                        firstName:data.removeExtraWhiteSpaces(req.session.firstName),
                        lastName:data.removeExtraWhiteSpaces(req.session.lastName),
                        password:hashedPassword});
                    req.session.isSigningIn = true;
                    req.session.Error = 'Congrats ' + req.session.firstName + ' ,you are registered successfully!';
                    res.redirect('/nasaAPI');
                }
                else {
                    req.session.Error = 'please make sure that your email is fresh';
                    res.redirect('/register')
                }
            })

        }else {
            req.session.Error = 'please enter a valid password';
            res.redirect('/password');
        }
    }
})

//----------------------------------------------------------------------------------------------------------------------

router.get('/password', function(req, res,
                              next) {
    let message = undefined;
    if(req.session.Error !== undefined) {
        message = req.session.Error;
        req.session.Error = undefined;
    }
    res.render('password',{title3:message});
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------