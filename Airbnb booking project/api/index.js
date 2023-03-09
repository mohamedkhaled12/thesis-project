const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { default: mongoose } = require('mongoose');
const User = require('./models/User.js');
const Place = require('./models/place.js')
const bcrypt = require('bcryptjs')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const fs = require('fs');
const imageDownloader = require('image-downloader');
const cookieParser = require('cookie-parser')
const app = express();


const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'bkjvbqkjbjbvjkbqjbmvdbhejr';


app.use(express.json());
app.use(cookieParser());
//this middleware to make the photos visible in the browser
app.use('/uploads', express.static(__dirname +'/uploads'))
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
console.log({__dirname})
app.post('/upload-by-link',async (req,res) =>{
     const {link} = req.body;
     const newName = 'photo' + Date.now() + '.jpg';
     await imageDownloader.image({
        url: link,
        dest: __dirname+'/uploads/' + newName
     });
     res.json(newName)
})

const photosMiddleware = multer({dest:'uploads'});
//100 is the maximum number of photos we can upload
app.post('/upload',photosMiddleware.array('photos',100),(req,res) =>{
    const uploadedFiles = [];
    for(let i=0;i<req.files.length;i++){
        // trying to add the extension to the filename
        const {path, originalname} = req.files[i];
        const parts =originalname.split('.');
        const ext = parts[parts.length-1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads',''));
    }
    res.json(uploadedFiles)
});

app.post('/places', (req, res) =>{
    const {token} = req.cookies;
    const {title,address,addedPhotos,description,
           perks,extraInfo,checkIn,checkOut,maxGuests
        } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) =>{
        if (err) throw err;
        const placeDoc = await Place.create({
            owner: userData.id,
            title,
            address,photos:addedPhotos,description,
           perks,extraInfo,checkIn,checkOut,maxGuests
        });
        res.json(placeDoc);
    })


});

app.get('/places', (req, res) =>{
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {},async (err, userData) =>{
        const {id} = userData;
        res.json(await Place.find({owner:id}));
    })
});


app.listen(4000);