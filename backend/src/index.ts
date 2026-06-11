// src/index.ts
// Punto de entrada del servidor Express
// Carga las variables del .env, configura Express y levanta el servidor

import express   from 'express'
import dotenv    from 'dotenv'
import sequelize from './db/Connection'
import rutas     from './Routes/rutas'

// Carga las variables del .env antes de cualquier otra cosa
dotenv.config()

const app  = express()
const PORT = process.env.PORT || 5000

// Permite que Express lea JSON en el cuerpo de las peticiones
app.use(express.json())

// Todas las rutas del API arrancan con /api
app.use('/api', rutas)

// Verifica la conexion a MySQL y luego levanta el servidor
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