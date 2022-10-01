const express = require('express');
const router = express.Router();
const dbModels = require('../models');

//----------------------------------------------------------------------------------------------------------------------

router.post('/add', function (req, res,
                              next) {
    dbModels.MarsImage.findOne({
        where: {
            email: req.session.email,
            imageId: req.body.imageId
        }
    }).then(photo => {
        if (photo === null) {
            dbModels.MarsImage.create({
                url: req.body.Src,
                sol: req.body.Sol,
                Earth_Date: req.body.EarthDate,
                email: req.session.email,
                imageId: req.body.imageId,
                camera: req.body.Camera
            }).then((user) => {
                res.sendStatus(200);
            }).catch((error) => {
                req.session.isSigningIn = false; //removes the session ID cookie
                res.redirect('/');
            });
        }

    }).catch(err => {
        req.session.isSigningIn = false; //removes the session ID cookie
        res.redirect('/');
    });
});

//----------------------------------------------------------------------------------------------------------------------

router.delete("/delete", function (req, res,
                                   next){
    dbModels.MarsImage.destroy({
        where: {
            email:req.session.email,
            url: req.body.Url}
    }).then((user) => {
        res.sendStatus(200);
    }).catch((error)=>{
        req.session.isSigningIn = false; //removes the session ID cookie
        res.redirect('/');
    });
});

//----------------------------------------------------------------------------------------------------------------------

router.delete("/reset", function (req, res,
                                  next){
    dbModels.MarsImage.destroy({
        where: {email:req.session.email}
    }).then((user) => {
        res.sendStatus(200);
    }).catch((error)=>{
        req.session.isSigningIn = false; //removes the session ID cookie
        res.redirect('/');
    });
});

//----------------------------------------------------------------------------------------------------------------------

router.get("/getList", function (req, res,
                                 next){
    dbModels.MarsImage.findAll({
        where: {
            email: req.session.email
        }
    }).then(photos => {
            res.send(photos);

    }).catch(err => {
        req.session.isSigningIn = false; //removes the session ID cookie
        res.redirect('/');

    });
});

//----------------------------------------------------------------------------------------------------------------------

router.get("/logOut", function (req, res,
                                 next){
    req.session.isSigningIn = false;
    res.redirect('/');
});

//----------------------------------------------------------------------------------------------------------------------

router.get('/nasaAPI', function(req, res,
                                next) {
    if(req.session.isSigningIn) {
        let message = undefined;
        if (req.session.Error !== undefined) {
            message = req.session.Error;
            req.session.Error = undefined;
        }
        res.render('NasaAPI', {
            title1: "UserName: " + req.session.firstName + " " + req.session.lastName,
            title2: message
        });
    }
    else
        res.render('login', {title:"Please login first!"});
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------