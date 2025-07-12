const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
const userModel = require('./models/user');
const questionModel = require('./models/question');
const answerModel = require('./models/answer');
app.use(express.json());
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


// Register user
app.post('/signup',async(req,res)=>{
    let {name,email,password,role} = req.body;
    let user = await userModel.findOne({email});
    if(user) return res.status(500).send("User already exist!");

    // password encryption
    bcrypt.genSalt(10,(err,salt)=>{
        if (err) return res.status(500).send("Error generating salt");
        bcrypt.hash(password,salt, async(err,hash)=>{
            if (err) return res.status(500).send("Error hashing password");
            let user = await userModel.create({
                name,
                email,
                role,
                password:hash
            });
            let token = jwt.sign({email:email,userId:user._id},"shshhshs");
            res.cookie("token",token);
            return res.redirect('/home')


        })
    })
})

// Login User
app.post('/login',isLoggedIn,async(req,res)=>{
    let {email,password}= req.body;
    let user = await userModel.findOne({email});
    if(!user) return res.status(500).send("User not exist!");

    // password checking
    bcrypt.compare(password,user.password,(err,result)=>{
         if (err) return res.status(500).send("Error checking password");
        if(result){
            let token = jwt.sign({email:email,userID:user._id},"shshhshs");
            return res.status(200).cookie("token", token).render("login");
        }
        else{
            return res.status(401).send("Please retry!");
        } 
    })
})

app.get('/login',(req,res)=>{
    res.render("login")
})
app.get('/',(req,res)=>{
    res.render("signup")
})
app.get("/profile",(req,res)=>{
    res.render("profile")
})

app.get("/home",(req,res)=>{
    res.render("home")
})
// Create Questions
app.post('/questions',isLoggedIn, async(req,res)=>{
    try {
        let user = await userModel.findOne({email:req.user.email});
        if(!user) return res.status(404).send("User not found!");
        let {title,description,tags} = req.body;
        let question = await questionModel.create({
            title,
            description,
            tags,
            createdBy:user._id,

        })
        user.questions.push(question._id);
        await user.save();
        res.redirect('/home')
    } catch (error) {
        console.error("Error while pushing a content: ",error);
        res.status(500).send('Internal Server Error',error);
    }
})

// JWT Middleware
function isLoggedIn(req,res,next){
    if(!req.cookies.token === ""){
        return res.send("You must be logged in!");
        
    } 
    try {
        let data = jwt.verify(req.cookies.token,"shshhshs");
        req.user = data;
        next();
    } catch (error) {
        return res.send("Invalid Token, Please login again!")
    }
}
app.listen(3000);

