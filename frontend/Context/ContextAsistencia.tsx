import { createContext } from "react"
import { Asistencia } from "../Models/Asistencia"

export const contextAsistencia = createContext({
  ultimaMarcada:    null as Asistencia | null,
  cargando:         false,
  registrarMarcada: async (
    dni:      string,
    pin:      string,
    tipo:     string,
    latitud:  number | null,
    longitud: number | null,
    deviceId: string
  ) => {},
})