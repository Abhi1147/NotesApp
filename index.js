const express=require("express");
var app=express();
var bodyParser=require("body-parser");
const mongoose=require("mongoose");
const ObjectId = require('mongodb').ObjectId;
var _=require("lodash");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

mongoose.connect("mongodb+srv://admin-abhishweta:JJc5XcgooAfenv3P@cluster0.fxijpz7.mongodb.net/notes",{useNewUrlParser:true});

const notesSchema=new mongoose.Schema({
    notesContent:{
        type:String,
        required: [true,"please write some content before"]
    }
});

const Note=mongoose.model("Note",notesSchema);
app.get("/",function(req,res){
    Note.find({}).then(function(elem) {
        res.render("home",{notes:elem});
    })
});

app.post("/addNote",function(req,res){
    res.render("card");
})

app.post("/delete",function(req,res) {
    Note.findByIdAndRemove(req.body.deleted).exec();
    res.redirect("/");
})

app.post("/edit",function(req,res){
    const docId=new ObjectId(req.body.editable);
    Note.findById(docId).exec().then(doc =>{
        res.render("edit",{content:doc});
    });
    
})

app.post("/",function(req,res){
    const item=new Note({
        notesContent:req.body.Content
    });
    item.save();
    res.redirect("/");
});

app.post("/editSave",function(req,res){
    var temp=req.body.Content;
    Note.updateOne({ _id: req.body.id }, { notesContent: temp }).exec();
    res.redirect("/");
})


app.listen(process.env.PORT || 3000);