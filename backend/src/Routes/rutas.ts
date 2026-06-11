// Routes/rutas.ts
// Agrupa todas las rutas del API en un solo lugar
// src/index.ts importa solo este archivo para mantenerlo limpio

import { Router } from 'express'
import authRutas         from './auth'
import empleadosRutas    from './empleados'
import asistenciasRutas  from './asistencias'
import reportesRutas     from './reportes'
import alertasRutas      from './alertas'
import dispositivosRutas from './dispositivos'

const router = Router()

// Cada prefijo agrupa las rutas de su modulo
router.use('/auth',         authRutas)
router.use('/empleados',    empleadosRutas)
router.use('/asistencia',   asistenciasRutas)
router.use('/reportes',     reportesRutas)
router.use('/alertas',      alertasRutas)
router.use('/dispositivos', dispositivosRutas)

export default router