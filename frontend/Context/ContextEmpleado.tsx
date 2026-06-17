import { createContext } from "react"
import { Empleado } from "../Models/Empleado"

export const contextEmpleado = createContext({
  listaEmpleados:  [] as Empleado[],
  cargando:        false,
  cargarEmpleados: async () => {},
  agregarEmpleado: async (datos: any) => {},
  editarEmpleado:  async (id: number, datos: any) => {},
})