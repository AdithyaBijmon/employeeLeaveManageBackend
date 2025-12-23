import "reflect-metadata"
import express from "express"
import { AppDataSource } from "./config/data-source"

const app = express()
const PORT = 3000

app.use(express.json())

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
