const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

<<<<<<< HEAD
module.exports = connectDB;
=======
module.exports = connectDB;
>>>>>>> 72013941db107fbe5324f851cececbb36dff5b68
