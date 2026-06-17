export interface Empleado {
  id:              number
  dni:             string
  nombres:         string
  apellidos:       string
  cargo:           string
  id_departamento: number
  horas_jornada:   number
  activo:          number
  Departamento?:   { nombre: string }
}