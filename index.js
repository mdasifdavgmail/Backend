const express = require("express");
const mongoose = require("mongoose");
const hbs = require('hbs');
const path = require('path');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.set('view engine', 'hbs');
const templatePath = path.join(__dirname, "/public");
app.set('views', templatePath);


mongoose.connect("mongodb://localhost:27017/backend")
    .then(() => console.log("Mongo connected"))
    .catch(err => console.log("Failed to connect", err));
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['student', 'instructor']
    }
});

const User = mongoose.model("User", UserSchema);


app.get("/", (req, res) => {
    res.send(`
        <a href="/Student">student</a>
        <a href="/admin">admin</a>
        <a href="/instructor">Instructor</a>
    `);
});

app.get("/Student", (req, res) => {
    res.render("login");
});

app.get("/admin", (req, res) => {
    res.send("Welcome to admin page")
});

app.get("/instructor", (req, res) => {
    res.render('login1');
});

app.get("/signup1", (req, res) => {
    res.render("signup1");
});

app.get("/signup", (req, res) => {
    res.render('signup');
});
app.get('/studentdetails',async(req,res)=>{
   
    const result=await User.find({$and:[{name:{$exists:true}},{role:"student"}]})
     res.send(`Welcome to students details<br> ${result.map((x)=>x.name)}`)
})

app.post("/signup", async (req, res) => {
    const {name, password} = req.body;
        const newUser = new User({ name, password, role: 'student' });
        await newUser.save();
        res.render("Student",{name:user.name});
});


app.post("/signup1", async (req,res) => {
    const {name, password} = req.body;
        const newUser = new User({ name, password, role: 'instructor' });
        await newUser.save();
        res.render("instructor");
});


app.post("/login", async (req,res) => {
   
        const user = await User.findOne({ name: req.body.name, role: 'student' });
        if (user && user.password === req.body.password) {
            res.render("Student",{name:user.name});
        } else {
            res.status(400).send("Wrong password");
        }
   
});


app.post("/login1", async (req, res) => {
        const user = await User.findOne({ name: req.body.name, role: 'instructor' });
        if (user && user.password === req.body.password) {
            res.render("instructor");
        } else {
            res.status(400).send("Wrong password");
        }
    
});

app.listen(1300, () => console.log("Server running on port 1300"));
