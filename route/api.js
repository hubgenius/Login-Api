 const express= require("express");
 const user = require("../model/user");
 const Login = require("../model/user")
 const router = express.Router();
 const jwt = require('jsonwebtoken');
 var secret = 'harrypotter';
//  router.get("/",(req,res)=>{
//      res.send("helloo")
//  })

 
 router.post("/",async(req,res)=>{
     let user = new Login();
     user.username=req.body.username
     user.email=req.body.email
     user.password=req.body.password
     user.phonenumber=req.body.phonenumber
     user.save();
     res.send(req.body)
 })
//  router.post("/add",async(req,res)=>{
//     let user = new Login();
//     user.username=req.body.username
//     user.email=req.body.email
//     // user.password=req.body.password
//     user.phonenumber=req.body.phonenumber
//     user.save();
//     res.send(req.body)
// })
 router.post('/login', function(req, res){
    Login.findOne({ email: req.body.email }).select('email password').exec(function(err, user) {
        if (err) throw err;
        else {
            if (!user) {
                res.json({ success: false, message: 'email and password not provided !!!' });
            } else if (user) {
                if (!req.body.password) {
                    res.json({ success: false, message: 'No password provided' });
                } else {
                    var validPassword = user.comparePassword(req.body.password);
                    if (!validPassword) {
                        res.json({ success: false, message: 'Could not authenticate password' });
                    } else{
                        //res.send(user);
                        var token = jwt.sign({ email: user.email, id: user._id }, secret, { expiresIn: '1h' }); 
                        res.json({ success: true, message: 'User authenticated!',token: token });
                    }             
                }
            }
        }   
    });
});
router.put('/forget', function(req, res) {
    Login.findOne({email:req.body.email}, function(err, user) {
        if (err) throw err;
        if (!user) {
            res.json({ success: false, message: 'No user found' });
        } else{
            // user.username=req.body.username
            // user.email=req.body.email
            user.password=req.body.password
            // user.phonenumber=req.body.phonenumber
            user.save(function(err) {
                if (err) {
                    console.log(err); 
                } else {
                    res.json({ success: true, message: 'Details has been updated!' });
                }
            });
        }
    });
})
router.use(function(req, res, next) {

    var token = req.body.token || req.body.query || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, secret, function(err, decoded) {
            if (err) {
                res.json({ success: false, message: 'Token invalid' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.json({ success: false, message: 'No token provided' });
    }
});
router.get('/', function(req, res) { 
    Login.find({}, function(err, user) {
        if (err) throw err;
        if (!user) {
            res.json({ success: false, message: 'No user found' });
        } else {
            res.json({ success: true, user: user });
        }
    });
   
});
router.get('/api/:id', function(req, res) { 
    Login.findById({_id:req.params.id}, function(err, user) {
        if (err) throw err;
        if (!user) {
            res.json({ success: false, message: 'No user found' });
        } else {
            res.json({ success: true, user: user });
        }
    });
   
});

router.delete('/:id', function(req, res) {
    Login.findByIdAndRemove({ _id: req.params.id }, function(err, user) {
        if(err) throw err;
        if(!user) {
            res.json({ success: false, message: 'No user found' });
        } else {
            res.json({ success: true, message: 'Your Account has been delete now !!!' });
        }
    })
});

router.put('/edit/:id', function(req, res) {
    Login.findById({ _id: req.params.id }, function(err, user) {
        if (err) throw err;
        if (!user) {
            res.json({ success: false, message: 'No user found' });
        } else{
            user.username=req.body.username
            user.email=req.body.email
            // user.password=req.body.password
            user.phonenumber=req.body.phonenumber
            user.save(function(err) {
                if (err) {
                    console.log(err); 
                } else {
                    res.json({ success: true, message: 'Details has been updated!' });
                }
            });
        }
    });
})
router.post('/add', async (req, res) => {
    console.log("Hello");
    let data = new Login()
    data.username = req.body.username
    data.email = req.body.email
    data.phonenumber = req.body.phonenumber
    data.password = 'Test@1234'

    data.save((err) => {
        if (err) {
            console.log(err)
        }
    })
    res.send(req.body);
}
)
 module.exports=router