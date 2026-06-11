// Routes/dispositivos.ts
// Rutas para gestión de dispositivos autorizados (solo administrador)
// POST /api/dispositivos      — registra un dispositivo para un empleado
// PUT  /api/dispositivos/:id  — desactiva un dispositivo

import { Router, Response } from 'express'
import { Dispositivo } from '../Models/Index'
import verificarToken, { RequestConUsuario } from '../Middlewares/verificarToken'

const router = Router()

router.use(verificarToken)

// Registrar un dispositivo autorizado para un empleado
router.post('/', async (req: RequestConUsuario, res: Response) => {
  const { id_empleado, device_id, plataforma, modelo } = req.body

  if (!id_empleado || !device_id) {
    return res.status(400).json({ mensaje: 'id_empleado y device_id son requeridos' })
  }

  try {
    // Desactivamos el dispositivo anterior del empleado si existe
    await Dispositivo.update(
      { activo: 0 },
      { where: { id_empleado, activo: 1 } }
    )

    // Registramos el nuevo dispositivo como activo
    await Dispositivo.create({
      id_empleado,
      device_id,
      plataforma: plataforma || null,
      modelo:     modelo || null,
      activo:     1,
    })

    return res.status(201).json({ mensaje: 'Dispositivo registrado correctamente' })

  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al registrar dispositivo', error })
  }
})

// Desactivar un dispositivo
router.put('/:id', async (req: RequestConUsuario, res: Response) => {
  try {
    const dispositivo = await Dispositivo.findByPk(Number(req.params.id))

    if (!dispositivo) {
      return res.status(404).json({ mensaje: 'Dispositivo no encontrado' })
    }

    await Dispositivo.update(
      { activo: 0 },
      { where: { id: req.params.id } }
    )

    return res.status(200).json({ mensaje: 'Dispositivo desactivado correctamente' })

  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al desactivar dispositivo', error })
  }
})

export default router