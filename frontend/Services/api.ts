import AsyncStorage from '@react-native-async-storage/async-storage'

// Cambia esta IP por la de tu computadora en la red local
// Para saber tu IP ejecuta ipconfig en CMD y busca IPv4
export const API_URL = 'http://192.168.0.6:5000/api'

// peticionPublica se usa para endpoints que no requieren token
// Solo el marcado de asistencia del empleado usa esta función
export const peticionPublica = async (
  endpoint: string,
  metodo:   string = 'GET',
  cuerpo?:  object
) => {
  // Realiza una petición HTTP al backend usando fetch, con el método y cuerpo especificados y 
  // el header de Content-Type para JSON si se envía un cuerpo. 
  // Devuelve la respuesta del servidor para que la pantalla correspondiente la procese y el backend la valide.
  // El endpoint se concatena con la URL base del API para formar la URL completa de la petición. 
  const respuesta = await fetch(`${API_URL}${endpoint}`, {
    // El método HTTP de la petición, por defecto es GET pero puede ser POST para marcar asistencia o iniciar sesión.
    method:  metodo,
    // El header de la petición, que indica que el cuerpo de la petición es JSON si se envía un cuerpo. 
    headers: { 'Content-Type': 'application/json' },
    // El cuerpo de la petición, que se convierte a JSON si se proporciona un objeto, o se deja como undefined si no hay cuerpo. 
    body:    cuerpo ? JSON.stringify(cuerpo) : undefined,
  })
  return respuesta
}

// peticionConToken se usa para todos los endpoints del administrador
// Lee el token JWT guardado en AsyncStorage y lo agrega al header 
// de Authorization para que el backend pueda validar la autenticidad de la petición y 
// autorizar el acceso a los recursos protegidos.
export const peticionConToken = async (
  // El endpoint del API al que se quiere acceder, por ejemplo /admin/empleados para obtener la lista 
  // de empleados o /admin/marcar para marcar asistencia como administrador.
  endpoint: string,
  // El método HTTP de la petición, por defecto es GET pero puede ser POST para marcar asistencia o iniciar sesión. 
  metodo:   string = 'GET',
  // El cuerpo de la petición, que se convierte a JSON si se proporciona un objeto, o se deja como undefined si no hay cuerpo. 
  cuerpo?:  object
  // La función es asíncrona porque primero debe leer el token de AsyncStorage, luego realizar 
  // la petición HTTP al backend usando fetch, con el método, cuerpo y header de Authorization que 
  // incluye el token.
) => {
  // Lee el token JWT guardado en AsyncStorage bajo la clave 'token'.
  const token = await AsyncStorage.getItem('token')
  // Realiza una petición HTTP al backend usando fetch, con el método, 
  // cuerpo y header de Authorization que incluye el token. 
  // El header de Content-Type para JSON se incluye si se envía un cuerpo.
  const respuesta = await fetch(`${API_URL}${endpoint}`, {
    method:  metodo,
    // El header de la petición, que incluye el token JWT para autorización y el Content-Type para 
    // JSON si se envía un cuerpo. 
    // El backend validará el token para autorizar el acceso a los recursos protegidos.
    headers: {
      // El header de Content-Type para JSON se incluye si se envía un cuerpo, o se omite si no hay cuerpo. 
      'Content-Type':  'application/json',
      // El header de Authorization que incluye el token JWT en formato Bearer, para que el backend pueda 
      // validar la autenticidad de la petición y autorizar el acceso a los recursos protegidos.
      'Authorization': `Bearer ${token}`,
      // El header de Authorization que incluye el token JWT en formato Bearer, para que el backend pueda 
      // validar la autenticidad de la petición y autorizar el acceso a los recursos protegidos.
    },
    // El cuerpo de la petición, que se convierte a JSON si se proporciona un objeto, 
    // o se deja como undefined si no hay cuerpo. 
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    // El cuerpo de la petición, que se convierte a JSON si se proporciona un objeto, 
    // o se deja como undefined si no hay cuerpo.
  })
  // Devuelve la respuesta del servidor para que la pantalla correspondiente la procese y el backend la valide.
  return respuesta
}