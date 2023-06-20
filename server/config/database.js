const mongoose = require("mongoose");
//connect data
const connectDatabase = () => {

//mongoose.set('useFindAndModify', false)
mongoose.connect(process.env.DB_USER, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
}).then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Failed to connect to MongooDB', err));
  // to avoid the warning after running npm start
}
module.exports = connectDatabase;
