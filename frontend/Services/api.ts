import AsyncStorage from '@react-native-async-storage/async-storage'

// Cambia esta IP por la de tu computadora en la red local
// Para saber tu IP ejecuta ipconfig en CMD y busca IPv4
export const API_URL = 'http://localhost:5000/api'

// peticionPublica se usa para endpoints que no requieren token
// Solo el marcado de asistencia del empleado usa esta función
export const peticionPublica = async (
  endpoint: string,
  metodo:   string = 'GET',
  cuerpo?:  object
) => {
  const respuesta = await fetch(`${API_URL}${endpoint}`, {
    method:  metodo,
    headers: { 'Content-Type': 'application/json' },
    body:    cuerpo ? JSON.stringify(cuerpo) : undefined,
  })
  return respuesta
}

// peticionConToken se usa para todos los endpoints del administrador
// Lee el token JWT guardado en AsyncStorage y lo agrega al header
export const peticionConToken = async (
  endpoint: string,
  metodo:   string = 'GET',
  cuerpo?:  object
) => {
  const token = await AsyncStorage.getItem('token')
  const respuesta = await fetch(`${API_URL}${endpoint}`, {
    method:  metodo,
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  })
  return respuesta
}