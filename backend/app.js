var createError = require('http-errors');
var express = require('express');
const mongoose = require('mongoose');
var cors = require('cors')
var bodyparser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const multer = require('multer');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const Table = require('./model');

var app = express();
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));


mongoose.connect('mongodb+srv://kishore10:kishore10@cluster0.3mooktv.mongodb.net/iquadra10', 
{ 
  useNewUrlParser: true,
   useUnifiedTopology: true 
  });

  mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});



// app.get("/postData",function(req,res){
//   console.log("hi")
// })

const storage = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'public/Images');
  },
  filename:function(req,file,cb){
    console.log(file.mimetype)
    cb(null,req.body.filename+".jpg");
  },
});
const upload = multer({storage: storage});
app.post("/postData",upload.single('file'), (req,res) =>{
  // console.log(req.file)
  var data = req.body;
  try{
  const newData = new Table(
    {
      first_name : data.firstname,
      last_name : data.secondname,
      email : data.email,
      password : data.password,
      phone : data.phone,
      address : data.address,
      // phone : data.phone,
      pic : data.phone,

    })
    newData.save();
    res.send("ok")
  }
  catch(err) {
    res.send("not ok")
  }
  
  // res.send("saved");
})


app.post("/checkUser" , async function(req,res){
  Table.find({email : req.body.email, password : req.body.password})
  .then(data => {
    // console.log(res.length)
    if(data.length >= 1){
      res.send(data)
    }
    else{
      res.send("not ok")
    }
  })
  .catch(err =>{
    console.log(err)
  })
})


app.post("/addTodo" ,function(req,res){
  // console.log("hai")
  var x;
  // console.log(new ObjectId(req.body.id))
  Table.findOne({_id:req.body.id})
  .then(res1 => {
    console.log(res1)
    if(res1.todo != "undefined"){
        var data = {
          "firstname" : req.body.first_name,
          "lastname" : req.body.last_name,
          "address" : req.body.address,
          "email" : req.body.email, 
          "phone_number":req.body.phone_number,
          "socialmedia":req.body.socialmedia
        }
        var Total = res1.todo;
        Total.push(data);
        console.log(Total)
        Table.findOneAndUpdate({_id:req.body.id},{todo :Total})
        .then(response => {
          res.send("done")
        })
        .catch(err => {
          res.send("error")
        })
    }
    else{
      console.log("dfg")
    }
    
  })
  // console.log(x+"sd");

})

app.post("/getcontacts",function(req,res){
  Table.find({_id:req.body.id})
  .then(result => {
    res.send(result[0].todo)
  })
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);



// app.get("/getting",function(req,res){
//   console.log("hai")
//   res.send("hello from backend");
// })




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(8000,function(){
  console.log("server is running on port 8000")
}

)

module.exports = app;
