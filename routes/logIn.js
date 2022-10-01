const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const data = require('../controller/data');


//----------------------------------------------------------------------------------------------------------------------
/**
 * handles the login submit.
 */
router.post('/logIn', async (req, res,
                                next) => {
    let Email = data.removeExtraWhiteSpaces(req.body.logEmail.toLowerCase());
    data.getUser(Email)
        .then(async (user)=>{
        if(user == null || !(await bcrypt.compare(req.body.logPassword, user.password))) {
            req.session.Error = "please make sure that you entered the correct email or password!";
            res.redirect('/logIn');
        }
        else {
            req.session.isSigningIn = true;
            req.session.email = Email;
            req.session.firstName = user.firstName;
            req.session.lastName = user.lastName;
            res.redirect('/nasaAPI');
        }
    })
})

//----------------------------------------------------------------------------------------------------------------------
/**
 * handle the get event of the login submit.
 */
router.get('/logIn', function(req, res,
                              next) {
    let message = undefined;
    if(req.session.Error !== undefined) {
        message = req.session.Error;
        req.session.Error = undefined;
    }

    res.render('login', { title: message });
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------