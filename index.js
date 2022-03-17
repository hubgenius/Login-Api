const express =require("express")
const app = express();
const router = express.Router();
const cors=require("cors")
const appRoutes = require("./route/api");
const bodyParser = require('body-parser');

const mongoose = require('mongoose')
const DB ="mongodb+srv://mern:kju5566@cluster0.ql0e8.mongodb.net/genius?retryWrites=true&w=majority";
mongoose.connect(DB)
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false}));
app.use("/",appRoutes);
app.listen(8080)