// Routes/reportes.ts
import { Router, Response }   from 'express'
import { Asistencia, Empleado, Departamento } from '../Models/Index'
import { consultarVista }     from '../db/helpers'
import verificarToken, { RequestConUsuario } from '../Middlewares/verificarToken'

const router = Router()

router.use(verificarToken)

// Reporte diario usando la vista v_reporte_diario
router.get('/dia', async (req: RequestConUsuario, res: Response) => {
  const fecha = req.query.fecha as string || new Date().toISOString().split('T')[0]
  try {
    const reporte = await consultarVista('v_reporte_diario', 'fecha = ?', [fecha])
    return res.status(200).json(reporte)
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener reporte', error })
  }
})

// Estado en tiempo real usando la vista v_estado_empleados_hoy
router.get('/estado', async (req: RequestConUsuario, res: Response) => {
  try {
    const estado = await consultarVista('v_estado_empleados_hoy')
    return res.status(200).json(estado)
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener estado', error })
  }
})

// Marcadas de hoy con detalle
router.get('/hoy', async (req: RequestConUsuario, res: Response) => {
  const hoy = new Date().toISOString().split('T')[0]
  try {
    const marcadas = await Asistencia.findAll({
      where: { fecha: hoy },
      include: [{
        model: Empleado,
        attributes: ['nombres', 'apellidos', 'dni'],
        include: [{ model: Departamento, attributes: ['nombre'] }],
      }],
      order: [['fecha_hora', 'DESC']],
    })
    return res.status(200).json(marcadas)
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener marcadas', error })
  }
})

export default router