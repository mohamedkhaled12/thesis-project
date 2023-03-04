const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { default: mongoose } = require('mongoose');
const User = require('./models/User.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const app = express();


const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'bkjvbqkjbjbvjkbqjbmvdbhejr';


app.use(express.json());
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin:'http://localhost:5173',
}));

console.log(process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL);

app.get('/test', (req, res) =>{
    res.json('test ok')
    console.log('server listening on port 5000')
});

app.post('/register',async (req,res) =>{
    const {name,email,password} = req.body;
    try
    {
        const userDoc = await User.create({
            name,
            email,
            password:bcrypt.hashSync(password, bcryptSalt),
        });
        res.json(userDoc);
    }
    catch(e){
        res.status(422).json(e);
    }
    
});

app.post('/login', async (req,res) =>{
    mongoose.connect(process.env.MONGO_URL);
    const {email,password} = req.body;
    const userDoc = await User.findOne({email:email});
    if(userDoc){
        const passOK = bcrypt.compareSync(password,userDoc.password)
        if(passOK){
            jwt.sign({
                email:userDoc.email,
                 id:userDoc._id, name:userDoc.name},jwtSecret,{},(err,token) =>{
                if (err) throw err;
                res.cookie('token',token).json(userDoc);
            });
            
        }
        else{
            res.status(422).json('pass not ok')
        }
    }
    else{
        res.json('not found')
    }
})

app.get('/profile', (req, res) =>{
    const {token} = req.cookies;
    if(token){
        jwt.verify(token, jwtSecret, {},(err, user) =>{
            if(err) throw err;
            res.json(user);
        })
    }
    else{
        res.json(null)
    }
    res.json(token)
});

app.post('/logout', (req, res) =>{
    //reseting the token to empty in order to logout
    res.cookie('token','').json(true);
});

app.listen(4000);