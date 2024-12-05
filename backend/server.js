require("colors")
const express = require("express")
const cors = require("cors");
const path = require('path')

const usersRoute = require('./routes/usersRoute')
const marketRoute = require('./routes/marketRoute')
const unitsRoute = require('./routes/unitsRoute')

const connect_DB = require("./utils/db")
const logger = require('./middlewares/logger')
const { notFound, errorHandler } = require('./middlewares/error')

const app = express()
const PORT = process.env.PORT || 5000

connect_DB()

// Access-Control-Allow
app.use(cors({
    origin: process.env.CLIENT_URL
}));

// Body Parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Serve Images
app.use('/images', express.static(path.join(__dirname, './uploads')))


// Middlewares
app.use(logger)


// Routes
app.use('/api/users', usersRoute)
app.use('/api/market', marketRoute)
app.use('/api/units', unitsRoute)

app.all("/api/*", notFound)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')))
    app.get('*', (req, res) => res.sendFile( path.join(__dirname, '../frontend/dist/index.html') ))
}

// Error Handlers
app.use(notFound)
app.use(errorHandler)


app.listen(PORT, _ => console.log(`Running At ${PORT}`.bold.brightYellow))

// Handle rejection outside express
process.on('unhandledRejection', (err) => {
    console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
    app.close(() => {
        console.error(`Shutting down....`);
        process.exit(1);
    });
});