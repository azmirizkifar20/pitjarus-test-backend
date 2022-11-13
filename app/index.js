'use strict';
require('dotenv').config()
const cors = require('cors')
const http = require('http')
const express = require('express')
const app = express()
const PORT = process.env.APP_PORT
const TIME_ZONE = process.env.TIME_ZONE

// initialize dayjs
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

// initialize router
const { mainRouter } = require('./routes')

// init server
const server = http.createServer(app)

// database connection
const db = require('./models')

async function connectDB() {
    try {
        // db.sequelize.sync()
        await db.sequelize.authenticate()
        console.log('connected to database!')
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}

// start server
startServer({ port: PORT })
    .then(connectDB())
    .catch(err => console.log(err))

function startServer({ port = process.env.PORT } = {}) {
    app.use(express.urlencoded({
        limit: '2mb',
        extended: true
    }))

    // set time zone
    dayjs.extend(utc)
    dayjs.extend(timezone)
    dayjs.tz.setDefault(TIME_ZONE)

    // set utility
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cors({ 
        origin: true, 
        exposedHeaders: ['Content-Disposition'],
        credentials: true
    }))

    // set routing
    app.use('/api/main', mainRouter)

    // service check
    app.get('/', (req, res) => {
        return res.status(200).json({
            success: true,
            code: 200,
            message: 'service is running and connected, current time : ' + dayjs().format('YYYY-MM-DD HH:mm:ss')
        })
    })

    return new Promise((resolve) => {
        const connection = server.listen(port, () => {
            console.log(`Server is running on ports: ${port}`)

            // this block of code turns `server.close` into a promise API
            const originalClose = connection.close.bind(connection)
            connection.close = () => new Promise((resolveClose) => {
                originalClose(resolveClose);
            })
            
            // this ensures that we properly close the server when the program exists
            setupCloseOnExit(connection)
            
            // resolve the whole promise with the express server
            resolve(connection)
        })
    })
}

// ensures we close the server in the event of an error.
function setupCloseOnExit(server) {
    // thank you stack overflow
    // https://stackoverflow.com/a/14032965/971592
    async function exitHandler(options = {}) {
        await server
            .close()
            .then(() => {
                console.log('Server successfully closed')
                generalLogger.info('Server successfully closed')
            })
            .catch((e) => {
                console.log(`Server successfully closed ${e.stack}`)
                errorLogger.error('Something went wrong closing the server', e.stack)
            })

        if (options.exit) {
            if (options.exit) {
                process.exit()
                // throw new Error('Exit process.exit Node JS')
            }
        }
    }

    // do something when app is closing
    process.on('exit', exitHandler)
    // catches ctrl+c event
    process.on('SIGINT', exitHandler.bind(null, { exit: true }))
    // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', exitHandler.bind(null, { exit: true }))
    process.on('SIGUSR2', exitHandler.bind(null, { exit: true }))
    // catches uncaught exceptions
    process.on('uncaughtException', exitHandler.bind(null, { exit: true }))
}