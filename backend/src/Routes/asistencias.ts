// Routes/asistencias.ts
// POST /api/asistencia — registra una marcada de entrada o salida
// Esta es la ruta principal que usa la app móvil
// No requiere token JWT porque el empleado se autentica con DNI y PIN

import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { Empleado, Asistencia, Dispositivo, ConfiguracionGps } from '../Models/Index'
import { calcularDistancia } from '../db/helpers'

const router = Router()

router.post('/', async (req: Request, res: Response) => {

  const { dni, pin, tipo, latitud, longitud, device_id } = req.body

  if (!dni || !pin || !tipo) {
    return res.status(400).json({ mensaje: 'DNI, PIN y tipo son requeridos' })
  }

  if (!['entrada', 'salida'].includes(tipo)) {
    return res.status(400).json({ mensaje: 'El tipo debe ser entrada o salida' })
  }

  try {
    // Buscamos el empleado por DNI
    const empleado = await Empleado.findOne({ where: { dni, activo: 1 } })

    if (!empleado) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' })
    }

    const empleadoData = empleado.toJSON() as any

    // Verificamos el PIN contra el hash guardado en la BD
    const pinValido = await bcrypt.compare(pin, empleadoData.pin)

    if (!pinValido) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' })
    }

    const hoy = new Date().toISOString().split('T')[0]

    // Verificamos si hay una marcada previa del mismo tipo hoy
    // No se puede marcar entrada dos veces sin haber marcado salida
    const marcadaPrevia = await Asistencia.findOne({
      where: {
        id_empleado: empleadoData.id,
        tipo,
        fecha: hoy,
        estado: ['valida', 'alerta'],
      },
    })

    if (marcadaPrevia) {
      return res.status(400).json({
        mensaje: `Ya tienes una marcada de ${tipo} registrada hoy`
      })
    }

    // Verificamos si el dispositivo está autorizado para este empleado
    let dispositivoAutorizado = null
    if (device_id) {
      const dispositivo = await Dispositivo.findOne({
        where: { id_empleado: empleadoData.id, device_id, activo: 1 }
      })
      dispositivoAutorizado = dispositivo ? 1 : 0
    }

    // Calculamos la distancia al perímetro GPS si vienen coordenadas
    let dentroPerimetro = null
    let distanciaMetros = null

    if (latitud && longitud) {
      const config = await ConfiguracionGps.findOne({ where: { activo: 1 } })

      if (config) {
        const configData = config.toJSON() as any
        distanciaMetros = calcularDistancia(
          latitud, longitud,
          configData.latitud, configData.longitud
        )
        dentroPerimetro = distanciaMetros <= configData.radio_metros ? 1 : 0
      }
    }

    // Determinamos el estado de la marcada
    // Si hay alguna anomalia el estado es alerta pero se registra igual
    let estado = 'valida'
    let observacion = null

    if (dentroPerimetro === 0) {
      estado = 'alerta'
      observacion = `Marcada a ${distanciaMetros} m del perimetro autorizado`
    } else if (dispositivoAutorizado === 0) {
      estado = 'alerta'
      observacion = 'Dispositivo no registrado para este empleado'
    }

    // Registramos la marcada en la BD
    // El trigger de MySQL se encarga del resumen_diario y las alertas automaticamente
    const marcada = await Asistencia.create({
      id_empleado:            empleadoData.id,
      tipo,
      fecha:                  hoy,
      latitud:                latitud || null,
      longitud:               longitud || null,
      dentro_perimetro:       dentroPerimetro,
      distancia_metros:       distanciaMetros,
      device_id:              device_id || null,
      dispositivo_autorizado: dispositivoAutorizado,
      estado,
      observacion,
    })

    return res.status(201).json({
      mensaje:  `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} registrada correctamente`,
      nombre:   `${empleadoData.nombres} ${empleadoData.apellidos}`,
      tipo,
      fecha_hora: (marcada.toJSON() as any).fecha_hora,
      estado,
    })

  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al registrar asistencia', error })
  }
})

export default router