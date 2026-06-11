export interface Asistencia {
  nombre:     string
  tipo:       'entrada' | 'salida'
  fecha_hora: string
  estado:     'valida' | 'alerta' | 'rechazada'
}