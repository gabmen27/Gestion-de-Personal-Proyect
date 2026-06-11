// Middlewares/verificarToken.ts
// Verifica que el token JWT sea válido antes de permitir acceso a rutas protegidas
// Se usa en todas las rutas del administrador

import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// Extendemos el tipo Request de Express para agregarle el campo usuario
// Así cualquier ruta protegida puede acceder a los datos del admin autenticado
export interface RequestConUsuario extends Request {
  usuario?: {
    id:  number
    rol: string
  }
}

const verificarToken = (req: RequestConUsuario, res: Response, next: NextFunction) => {

  // El token viene en el encabezado Authorization con el formato: Bearer <token>
  const authHeader = req.headers['authorization']

  if (!authHeader) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' })
  }

  // Separamos la palabra Bearer del token real
  const token = authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ mensaje: 'Formato de token invalido' })
  }

  try {
    // jwt.verify lanza un error si el token venció o fue alterado
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id:  number
      rol: string
    }

    // Guardamos los datos del admin en el request para usarlos en la ruta
    req.usuario = decoded
    next()

  } catch (error) {
    return res.status(401).json({ mensaje: 'Token invalido o expirado' })
  }
}

export default verificarToken