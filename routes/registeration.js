const express = require('express');
const router = express.Router();
const Cookies = require('cookies');
const keys = ['keyboard cat'];
const dbModels = require('../models');
const data = require('../controller/data');

//----------------------------------------------------------------------------------------------------------------------

//handle the registration page
router.post('/register', function (req, res,
                                   next) {
    let Email = (data.removeExtraWhiteSpaces(req.body.Email)).toLowerCase();
    dbModels.User.findOne({
        where:{
            email : Email
        }
    }).then(user =>{
        if(user == null){
            req.session.email = Email;
            req.session.firstName = req.body.FirstName;
            req.session.lastName = req.body.LastName;
            const cookies = new Cookies(req, res, {keys:keys});
            cookies.set('timeLimit', new Date().toISOString(),{signed:true, maxAge:60*1000});
            res.redirect('/password');
        }
        else {
            req.session.Error = 'please enter a fresh email!';
            res.redirect('/register');
        }
    })
})

//----------------------------------------------------------------------------------------------------------------------

router.get('/register', function (req, res,
                                  next){
    let message = undefined;
    if(req.session.Error !== undefined) {
        message = req.session.Error;
        req.session.Error = undefined;
    }
    res.render('index', { title4: message });
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------