//const express = require('express')
//const app = express();

const cors = require('cors')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');

const errorMiddleware = require('./middleware/errors');

const whitelist = ["https://livmotestt.web.app/"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))


 //app.use(express.json());
// app.use(bodyParser.json({limit:"30mb" , extended:true}))
// app.use(bodyParser.urlencoded({ limit:"30mb", extended: true }));
// app.use(cors());
// app.use(morgan('tiny'));
// app.use(cookieParser());
// app.use(fileUpload());






// Import all routes
const auth = require('./routes/auth');
const experience = require('./routes/experience');
const lodging = require('./routes/lodging');
const restaurant = require('./routes/restaurant');
const transport = require('./routes/transport');






app.use('/api/v1', transport);
app.use('/api/v1', restaurant);
app.use('/api/v1', lodging);
app.use('/api/v1', experience);
//app.use('/api/v1', auth);



app.use(express.static('client/build'))
app.get('*', (req,res)=>{
    res.sendFile(__dirname+'/client/build/index.html')
})






// Middleware to handle eroors
app.use(errorMiddleware);



module.exports = app;
