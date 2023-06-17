// const app = require('./app');
const express = require('express')
const connectDatabase = require('./config/database');
const app = express();
const cors = require('cors')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');


app.use(express.json());
app.use(bodyParser.json({limit:"30mb" , extended:true}))
app.use(bodyParser.urlencoded({ limit:"30mb", extended: true }));
app.use(cors());
app.use(morgan('tiny'));
app.use(cookieParser());
app.use(fileUpload());


// app.use(userRoutes);
// app.use(taskRoute)
const dotenv = require('dotenv');

const cloudinary = require('cloudinary');
const auth = require('./routes/auth');

app.use('/api/v1', auth);  //***************** SIGNUP and LOGIN ********************** */

// Prevent Nosql Injection Sanitize Data
const mongoSanitize = require('express-mongo-sanitize');

//XSS Protection "Security Headers"
const helmet = require("helmet");

//
var xss = require('xss-clean')
//import xss from 'xss-clean';

//Setting up config file
dotenv.config({ path: 'config.env'});

//Use to limit repeated requests to public APIs and/or endpoints such as password reset. 
const rateLimit = require('express-rate-limit')

// Express middleware to protect against HTTP Parameter Pollution attacks
var hpp = require('hpp');

// Setting up cloudinary configuration
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})



// Connecting to database
connectDatabase();
// app.use(express.json({ extended: false }));
//app.use(express.urlencoded({ extended: true} ));
const server = app.listen(process.env.PORT || 10000, ()=>{
    console.log(`Server Started on PORT: ${process.env.PORT || 10000} in ${process.env.NODE_ENV} mode. `);
});

// Handle Unhandled Promise rejections
process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down the server due to Unhandled Promise rejection');
    server.close(() => {
        process.exit(1)
    })
})

// Handle Uncaught exceptions
process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.stack}`);
    console.log('Shutting down due to uncaught exception');
    process.exit(1)
})

//Sanitize Data
app.use(mongoSanitize());

//Helmet
app.use(helmet());

//(XSS) is a type of injection attack in which a threat actor inserts data, such as a malicious script
app.use(xss());

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

//Express middleware to protect against HTTP Parameter Pollution attacks
app.use(hpp())
// backend : 3000
// frontend : 3001

// npm install --ignore-scripts
// npm install -g npm 
// npm install --legacy-peer-deps
