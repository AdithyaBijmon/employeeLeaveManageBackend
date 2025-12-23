import "reflect-metadata"
import express from "express"
import cors from 'cors'
import { AppDataSource } from "./config/data-source"
import userRoutes from './routes/user.route'

const app = express()

app.use(cors())
app.use(express.json())


const PORT = 3000

app.use('/api/users',userRoutes)


AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected")

    app.listen(PORT, () => {
      console.log(`Server Started`)
    })
  })
  .catch((err) => {
    console.error("❌ Database connection failed", err)
  })
