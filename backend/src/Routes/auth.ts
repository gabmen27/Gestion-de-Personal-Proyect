// Routes/auth.ts
// Ruta de autenticación del administrador
// POST /api/auth/login — recibe usuario y contraseña, devuelve token JWT

import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UsuarioAdmin, SesionAdmin } from '../Models/Index'

const router = Router()

router.post('/login', async (req: Request, res: Response) => {

  const { usuario, contrasena } = req.body

  if (!usuario || !contrasena) {
    return res.status(400).json({ mensaje: 'Usuario y contraseña son requeridos' })
  }

  try {
    // Buscamos el administrador por su nombre de usuario
    const admin = await UsuarioAdmin.findOne({ where: { usuario, activo: 1 } })

    if (!admin) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' })
    }

    const adminData = admin.toJSON() as any

    // bcrypt.compare verifica la contraseña contra el hash guardado en la BD
    const contrasenaValida = await bcrypt.compare(contrasena, adminData.contrasena)

    if (!contrasenaValida) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' })
    }

    // Generamos el token JWT con el id y rol del administrador
    const secret  = process.env.JWT_SECRET as string
    const expira  = process.env.JWT_EXPIRES_IN || '8h'

    // El token vence según lo configurado en JWT_EXPIRES_IN del .env
    const token = jwt.sign(
      { id: adminData.id, rol: adminData.rol },
      secret,
      { expiresIn: expira as any }
    ) as string

    // Guardamos la sesion en la BD para auditoria
    const fechaExpira = new Date()
    fechaExpira.setHours(fechaExpira.getHours() + 8)

    await SesionAdmin.create({
      id_usuario:  adminData.id,
      // Guardamos solo la firma del token (tercera parte) como identificador unico
      token_jti:   token.split('.')[2],
      ip_origen:   req.ip,
      dispositivo: req.headers['user-agent'] || '',
      expira_en:   fechaExpira,
    })

    // Actualizamos el ultimo acceso del administrador
    await UsuarioAdmin.update(
      { ultimo_acceso: new Date() },
      { where: { id: adminData.id } }
    )

    return res.status(200).json({
      mensaje: 'Login exitoso',
      token,
      admin: {
        id:              adminData.id,
        nombre_completo: adminData.nombre_completo,
        rol:             adminData.rol,
      }
    })

  } catch (error) {
    return res.status(500).json({ mensaje: 'Error en el servidor', error })
  }
})

export default router