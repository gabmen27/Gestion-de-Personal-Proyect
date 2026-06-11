// Routes/empleados.ts
// Rutas para gestión de empleados (solo el administrador puede acceder)
// GET    /api/empleados       — lista todos los empleados activos
// GET    /api/empleados/:id   — obtiene un empleado por id
// POST   /api/empleados       — registra un nuevo empleado
// PUT    /api/empleados/:id   — edita datos de un empleado

import { Router, Response } from 'express'
import bcrypt from 'bcryptjs'
import { Empleado, Departamento } from '../Models/Index'
import verificarToken, { RequestConUsuario } from '../Middlewares/verificarToken'

const router = Router()

// Todas las rutas de empleados requieren token válido
router.use(verificarToken)

// Listar todos los empleados activos con su departamento
router.get('/', async (req: RequestConUsuario, res: Response) => {
  try {
    const empleados = await Empleado.findAll({
      where: { activo: 1 },
      // Incluimos el departamento para no hacer una segunda consulta
      include: [{ model: Departamento, attributes: ['nombre'] }],
      // No devolvemos el PIN por seguridad
      attributes: { exclude: ['pin'] },
    })
    return res.status(200).json(empleados)
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener empleados', error })
  }
})

// Obtener un empleado por su id
router.get('/:id', async (req: RequestConUsuario, res: Response) => {
  try {
    const empleado = await Empleado.findOne({
      where: { id: req.params.id, activo: 1 },
      include: [{ model: Departamento, attributes: ['nombre'] }],
      attributes: { exclude: ['pin'] },
    })

    if (!empleado) {
      return res.status(404).json({ mensaje: 'Empleado no encontrado' })
    }

    return res.status(200).json(empleado)
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener empleado', error })
  }
})

// Registrar un nuevo empleado
router.post('/', async (req: RequestConUsuario, res: Response) => {
  const { dni, nombres, apellidos, pin, id_departamento, cargo, telefono, correo, horas_jornada } = req.body

  if (!dni || !nombres || !apellidos || !pin || !id_departamento) {
    return res.status(400).json({ mensaje: 'DNI, nombres, apellidos, PIN y departamento son requeridos' })
  }

  try {
    // Verificamos que el DNI no esté ya registrado
    const existe = await Empleado.findOne({ where: { dni } })
    if (existe) {
      return res.status(400).json({ mensaje: 'Ya existe un empleado con ese DNI' })
    }

    // Ciframos el PIN antes de guardarlo en la BD
    const pinCifrado = await bcrypt.hash(pin, 10)

    const nuevoEmpleado = await Empleado.create({
      dni,
      nombres,
      apellidos,
      pin:            pinCifrado,
      id_departamento,
      cargo:          cargo || '',
      telefono:       telefono || null,
      correo:         correo || null,
      horas_jornada:  horas_jornada || 8.00,
    })

    return res.status(201).json({
      mensaje: 'Empleado registrado correctamente',
      id: (nuevoEmpleado.toJSON() as any).id,
    })

  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al registrar empleado', error })
  }
})

// Editar datos de un empleado
router.put('/:id', async (req: RequestConUsuario, res: Response) => {
  const { nombres, apellidos, pin, id_departamento, cargo, telefono, correo, horas_jornada, activo } = req.body

  try {
    const empleado = await Empleado.findByPk(Number(req.params.id))

    if (!empleado) {
      return res.status(404).json({ mensaje: 'Empleado no encontrado' })
    }

    // Si viene un PIN nuevo lo ciframos antes de guardar
    let pinActualizado = undefined
    if (pin) {
      pinActualizado = await bcrypt.hash(pin, 10)
    }

    await Empleado.update(
      {
        nombres:         nombres,
        apellidos:       apellidos,
        pin:             pinActualizado,
        id_departamento: id_departamento,
        cargo:           cargo,
        telefono:        telefono,
        correo:          correo,
        horas_jornada:   horas_jornada,
        activo:          activo,
        actualizado_en:  new Date(),
      },
      { where: { id: req.params.id } }
    )

    return res.status(200).json({ mensaje: 'Empleado actualizado correctamente' })

  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al actualizar empleado', error })
  }
})

export default router