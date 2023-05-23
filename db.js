const mongoose = require('mongoose');

const connectDB = async () => {
    const URI = process.env.DATABASE_URI;
    const connectionParams = {
      useUnifiedTopology: true,
    };
  
    mongoose.set("strictQuery", false);
  
    mongoose
      .connect(URI, connectionParams)
      .then(() => console.info("Connection established"))
      .catch((err) => console.error("Error" + err.message));
  };

module.exports = connectDB;