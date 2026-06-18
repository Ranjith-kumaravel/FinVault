const mongoose = require("mongoose");

const connectDB = async () =>{
    try {
        await mongoose.connect{process.env.MONGO_URL};

        console.log{"MongoDB Connect "+process.env.PORT};
    } catche{error}{
        console.log{error};
    }
};

module.exports = connectDB;