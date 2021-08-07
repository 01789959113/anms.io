require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
require('./db/connect');
const user = require('./models/model');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const  {auth, isUnAuthenticated} = require('./middleware/auth')
const local = require('./middleware/setLocal')


const hostname = '127.0.0.1'
const port = process.env.PORT || 3000;

// serving static file
app.use(express.static(path.join(__dirname, 'public')))


const store = new MongoDBStore({
    uri: process.env.DB_HOST,
    collection: 'mySessions'
});

// using middleware 
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000
    },
    store: store
}))
app.use(local)

// setting Template engine as 'ejs' 
app.set('view engine', 'ejs')

// home page
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' })
})

// blog page 
app.get('/blog',auth, (req, res) => {
    res.render('blog', { title: 'Blog' })
})

// about page
app.get('/about', auth,  (req, res) => {
    res.render('about', { title: 'About' })
})

// service page
app.get('/service', auth, (req, res) => {
    res.render('service', { title: 'Service' })
})

// register page
app.get('/register', isUnAuthenticated, (req, res) => {
    res.render('register', { title: 'Register' })
})

// login page
app.get('/login',isUnAuthenticated, (req, res) => {
    res.render('login', { title: 'Login' })
})


// post request for register page
app.post('/register', isUnAuthenticated, async (req, res) => {
    try {
        const userList = new user(req.body)
        const { name, email, phone, password, confirmpassword } = req.body;
        let errors = []

        if (!name || !email || !phone || !password || !confirmpassword) {
            errors.push({ msg: "Please fill all the field" })
        }
        if (password !== confirmpassword) {
            errors.push({ msg: "Password doesn't match " })
        }
        if (password.length < 6) {
            errors.push({ msg: "Password should be at least 6 characters " })
        }
        // if user is already registerd
        let isRegisterd = await user.findOne({ email: email })
        if (isRegisterd) {
            errors.push({ msg: 'Email is already registered' })
            res.render('register', {
                title: 'Register',
                errors,
                name,
                email,
                phone,
                password,
                confirmpassword
            })
        }

        if (errors.length > 0) {
            res.render('register', {
                title: 'Register',
                errors,
                name,
                email,
                phone,
                password,
                confirmpassword
            })
        } else {
            // hashing password before saving

            // saving user data into database
            const saveUser = await userList.save()
            res.render('login', { title: 'Login' })
        }


    } catch (error) {
        console.log(error)
    }
})

// post request for login page 
app.post('/login', isUnAuthenticated,  async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const message = []

    let findUser = await user.findOne({ email: email })
    if (!findUser) {
        message.push({ msg: 'Inavalid Login Informatin...Try Again' })
        res.render('login', {
            title: 'Login',
            message,
            email,
            password
        })
    }

    let userPassword = await bcrypt.compare(password, findUser.password)

    if (!userPassword) {
        message.push({ msg: 'Inavalid Login Informatin...Try Again' })
        res.render('login', {
            title: 'Login',
            message,
            email,
            password
        })
    }

    req.session.isLoggedIn = true;
    req.session.user = findUser;
    // console.log(req.session.isLoggedIn)
    // console.log(req.session.user)
    
    if (findUser || userPassword) {
        res.redirect('/')
    }

})

// logout page
app.get('/logout', auth,(req, res)=>{
    req.session.destroy(err=>{
        if(err){
            console.log(err)
        } 
        return res.redirect('/login')
    })
})


app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});