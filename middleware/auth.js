const user = require('../models/model')

const express = require('express')
const app = express()
app.set('view engine', 'ejs');

const auth = async (req, res, next)=>{
        if(!req.session.isLoggedIn){
            res.render('login', {title: 'Login'})
        }

        try {
            let getUser = await user.findById(req.session.user._id);
            req.user = getUser;
            next();
        } catch (error) {
            console.log(error)
    }
}

const isUnAuthenticated = async(req, res, next)=>{
    if(req.session.isLoggedIn){
        res.render('index', {title: 'Home'})
    }
    next()
}

module.exports = {auth, isUnAuthenticated};