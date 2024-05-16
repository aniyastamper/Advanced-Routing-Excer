
const express = require('express')
const apiRoutes = require('./api-routes')

const app = express()
const port = process.env.PORT || 3001

app.use(express.json())
app.use('/api/v1', apiRoutes)

app.listen(port, () => console.log(`Server is running http://localhost:${port}`))