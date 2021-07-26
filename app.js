

const express = require('express');
const bodyparser = require('body-parser');
const port = process.env.PORT || 8000;
const ejs = require('ejs');
const date = require(__dirname+"/date.js");
const daygen = require(__dirname+"/day.js");
const _ = require('lodash');
const https = require('https');

const app = express();
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));


app.set('view engine', 'ejs');

//console.log(date());
//console.log(daygen());

// require mongoose package
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

// DB connection
mongoose.connect("mongodb+srv://admin-taha:taha92basra@cluster0.5spjo.mongodb.net/todolistDB",{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});


//mongoose schema
const itemschema={
  itemvalue: String
};

//mongoose model
const item = mongoose.model("item",itemschema);

// values in // db
const item1 =new item({
  itemvalue:"write in text boox"
});
const item2 =new item({
  itemvalue:"hit the + button to add"
});
const item3 =new item({
  itemvalue:"click checkbox to cut it down"
});

//making an array of items
const defaultitems =[item1,item2,item3];

const listschema ={
  name: String,
  items: [itemschema]
};

const list = mongoose.model("list",listschema);

//reading data from database

app.get("/",function (req,res) {
  item.find({},function (err,founditems) {
    if (founditems.length === 0) {
      //query of inserting data using insertMany() fun
      item.insertMany(defaultitems,function (err) {
        if(err)
        {

          console.log("err");
        }
        else {
          console.log("success");
        }

      });
    }
    else{
      res.render("list",{listtitle: daygen(),ls: founditems});
      //console.log(founditems);
    }
  });
});

app.get("/:customlistname",function (req,res) {
  const customlistname = _.capitalize(req.params.customlistname);
  list.findOne({name: customlistname},function (err,foundlist) {
    if(!err){
      if(!foundlist){
        //create a new list
        const listc = new list({
          name: customlistname,
          items:defaultitems
        });
        listc.save();
        res.redirect("/"+customlistname);
      }
      else{
        //show an existing list
        res.render("list",{listtitle: foundlist.name,ls:foundlist.items});
      }
    }
  });

});

app.post("/",function (req,res) {
  const x= req.body.nm;
  const listname = req.body.list;
    const itemx =new item({
      itemvalue: x
    });
    if (x!="") {
      if(listname ==="today")
      {
        itemx.save();
        res.redirect("/");
      }
      else
      {
          list.findOne({name: listname},function (err,foundlist) {
              foundlist.items.push(itemx);
              foundlist.save();
              res.redirect("/"+listname);
          });
      }

    }
    else {
      console.log("empty string");
    }

});

app.post("/delete",function (req,res) {
  const checkeditemid = req.body.checkbox;
  //console.log(checkeditemid);
  const listname =req.body.listname;
if (listname === "today") {
  item.findByIdAndRemove(checkeditemid, function (err) {
    if (err) {

      console.log(err);
    }
    else {
      console.log("success");
      res.redirect("/");
    }
  });
}
else {
  list.findOneAndUpdate({name:listname},{$pull:{items:{_id: checkeditemid}}},function (err,founlist) {
      if (err) {
        console.log("error");
      }
      else {
        res.redirect("/"+listname);
      }
  });
}

});




app.listen(3001,function () {
  console.log("server running successfully");
});




// app.get("/work",function (req,res) {
//   res.render("list",{listtitle: "worklist",ls: workitems});
// });
