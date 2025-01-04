const mongoose = require("mongoose")

async function connect_DB() {
    try {
        console.log(process.env.MONGO_URI);
        
        const { connection } = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MogoDB Connected: ${connection.host}`.cyan.underline);
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

module.exports = connect_DB