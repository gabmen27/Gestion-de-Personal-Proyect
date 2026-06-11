// Routes/alertas.ts
// Rutas para gestión de alertas (solo administrador)
// GET /api/alertas            — lista alertas pendientes
// PUT /api/alertas/:id        — marca una alerta como revisada

import { Router, Response } from 'express'
import { Alerta, Empleado } from '../Models/Index'
import verificarToken, { RequestConUsuario } from '../Middlewares/verificarToken'

const router = Router()

router.use(verificarToken)

// Listar alertas pendientes de revisión
router.get('/', async (req: RequestConUsuario, res: Response) => {
  try {
    const alertas = await Alerta.findAll({
      where: { revisada: 0 },
      include: [{
        model: Empleado,
        attributes: ['nombres', 'apellidos', 'dni'],
      }],
      order: [['creada_en', 'DESC']],
    })
    return res.status(200).json(alertas)
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener alertas', error })
  }
})

// Marcar una alerta como revisada
router.put('/:id', async (req: RequestConUsuario, res: Response) => {
  try {
    const alerta = await Alerta.findByPk(Number(req.params.id))

    if (!alerta) {
      return res.status(404).json({ mensaje: 'Alerta no encontrada' })
    }

    await Alerta.update(
      {
        revisada:    1,
        // Guardamos quién revisó la alerta y cuándo
        revisada_por: req.usuario?.id,
        revisada_en:  new Date(),
      },
      { where: { id: req.params.id } }
    )

    return res.status(200).json({ mensaje: 'Alerta marcada como revisada' })

  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al actualizar alerta', error })
  }
})

export default router