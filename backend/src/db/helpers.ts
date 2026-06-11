// src/db/helpers.ts
// Funciones reutilizables para consultar la base de datos
// Una sola función sirve para cualquier vista o consulta SQL

import sequelize from './Connection'
import { QueryTypes } from 'sequelize'

// consultarVista ejecuta cualquier vista o consulta SQL pura
// nombreVista: nombre de la vista en MySQL
// condicionWhere: condicion opcional, ejemplo: 'fecha = ?'
// valores: arreglo con los valores que reemplazan los ?
const consultarVista = async (nombreVista: string, condicionWhere: string = '', valores: any[] = []) => {

  // Si viene condicion agrega el WHERE, si no trae todo
  const sql = condicionWhere
    ? `SELECT * FROM \`${nombreVista}\` WHERE ${condicionWhere}`
    : `SELECT * FROM \`${nombreVista}\``

  // QueryTypes.SELECT le dice a Sequelize que solo devuelva las filas
  // sin los metadatos adicionales
  const filas = await sequelize.query(sql, {
    replacements: valores,
    type: QueryTypes.SELECT,
  })

  return filas
}

// calcularDistancia calcula la distancia en metros entre dos coordenadas GPS
// Se usa en asistencias.ts para verificar si el empleado esta dentro del perimetro
// Usa la formula Haversine que calcula distancia real sobre la superficie terrestre
const calcularDistancia = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {

  const R   = 6371000
  const rad = (grados: number) => (grados * Math.PI) / 180

  const dLat = rad(lat2 - lat1)
  const dLon = rad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return Math.round(R * c)
}

export { consultarVista, calcularDistancia }