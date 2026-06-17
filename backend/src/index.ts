require('dotenv').config()

import express   from 'express'
import sequelize from './db/Connection'
import rutas     from './Routes/rutas'

const app  = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use('/api', rutas)

sequelize.authenticate()
  .then(() => {
    console.log('Conexion a MySQL exitosa')
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`)
    })
  })
  .catch((error: Error) => {
    console.error('Error al conectar a MySQL:', error.message)
  })
