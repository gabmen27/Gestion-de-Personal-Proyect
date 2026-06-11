import { createContext } from "react"
import { Admin } from "../Models/Admin"

export const contextAdmin = createContext({
  admin:         null as Admin | null,
  token:         null as string | null,
  cargando:      false,
  iniciarSesion: async (usuario: string, contrasena: string) => {},
  cerrarSesion:  async () => {},
})