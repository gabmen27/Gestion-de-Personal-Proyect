// Routes/configuracionGps.ts
// Maneja la configuracion del perimetro GPS autorizado
// GET  /api/configuracion-gps      - obtiene la configuracion activa
// PUT  /api/configuracion-gps/:id  - actualiza el perimetro

import { Router, Response } from 'express'
import { ConfiguracionGps } from '../Models/Index'
import verificarToken, { RequestConUsuario } from '../Middlewares/verificarToken'

const router = Router()

router.use(verificarToken)

// Obtiene la configuracion activa (solo hay un registro activo a la vez)
router.get('/', async (req: RequestConUsuario, res: Response) => {
  try {
    const config = await ConfiguracionGps.findOne({ where: { activo: 1 } })
    return res.status(200).json(config)
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener configuracion', error })
  }
})

// Actualiza el perimetro autorizado
router.put('/:id', async (req: RequestConUsuario, res: Response) => {
  try {
    await ConfiguracionGps.update(
      {
        nombre:       req.body.nombre,
        latitud:      req.body.latitud,
        longitud:     req.body.longitud,
        radio_metros: req.body.radio_metros,
      },
      { where: { id: Number(req.params.id) } }
    )
    return res.status(200).json({ mensaje: 'Configuracion actualizada' })
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al actualizar configuracion', error })
  }
})

export default router