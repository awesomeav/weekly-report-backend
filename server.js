import express from 'express'
import dotenv from 'dotenv'
// import bodyParser from 'body-parser'
import colors from 'colors'
import { connectDB } from './utils/dbConfig.js'
import { errorHandler, notFound } from './middlewares/errorHandler.js'
// import morgan from 'morgan'

import userRoutes from './routes/userRoutes.js'

// import routes

// configure the dot env
dotenv.config()

// create the express app
const app = express()

// database connection
connectDB()

// middlewares
app.use(express.json())
// app.use(
//   express.urlencoded({
//     extended: true,
//   })

// base route to make sure the backend is running
app.get('/', (req, res) => {
  res.send('Backend is running...')
})

// route middlewares
app.use('/api/users', userRoutes)

// custom middlewares
app.use(notFound)
app.use(errorHandler)

// creating port
const port = process.env.PORT || 5000

// launching the server on the port
app.listen(port, () => {
  console.log(`server is running on port ${port}`.cyan.underline)
})
