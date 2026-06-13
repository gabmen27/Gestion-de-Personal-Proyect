import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Location from 'expo-location'
import * as Device from 'expo-device'
import * as Application from 'expo-application'
import { useContextAsistencia } from '../Providers/AsistenciaProvider'


// PantallaMarcar es la pantalla donde el empleado ingresa su DNI y PIN para marcar su entrada o salida

// Recibe el tipo de marcación (entrada o salida) como parámetro de la ruta, y muestra un formulario para ingresar el DNI y PIN,
// junto con un teclado numérico en pantalla para facilitar la entrada de datos. Al presionar el botón de marcar, 
// se validan los datos ingresados y se intenta registrar la marcación, obteniendo la ubicación y el ID del dispositivo para enviar esta información junto con el DNI, PIN y tipo de marcación.
export default function PantallaMarcar({ navigation, route }: any) {

  // Se obtiene el tipo de marcación (entrada o salida) desde los parámetros de la ruta
  const { tipo } = route.params
  const { registrarMarcada, cargando } = useContextAsistencia()

  // Estados locales para el DNI, PIN y el campo activo (para saber cuál campo está siendo editado)
  const [dni, setDni] = useState('')
  const [pin, setPin] = useState('')
  // campoActivo puede ser 'dni' o 'pin', y se usa para resaltar el campo que el usuario está editando actualmente
  const [campoActivo, setCampoActivo] = useState<'dni' | 'pin'>('dni')

  // Variables para mostrar el tipo de marcación con estilos diferentes según si es entrada o salida
  const esTipo = tipo === 'entrada' ? 'Entrada' : 'Salida'
  // colorTipo y bgTipo se usan para definir los colores del badge que indica el tipo de marcación,
  // usando colores distintos para entrada (verde) y salida (rojo)
  const colorTipo = tipo === 'entrada' ? '#0D9488' : '#E53E3E'
  // bgTipo se usa para el fondo del badge, con tonos más claros que el color principal para mantener 
  // una buena legibilidad del texto encima del badge  
  const bgTipo = tipo === 'entrada' ? '#E1F5EE' : '#FFF5F5'


  // Función que se llama al presionar una tecla del teclado numérico en pantalla,
  // agrega la tecla al estado correspondiente (dni o pin) dependiendo de cuál campo está activo
  function presionarTecla(tecla: string) {
    // Si el campo activo es 'dni', se agrega la tecla al estado dni, 
    // pero solo si el largo actual es menor a 13 (formato esperado de DNI)  
    if (campoActivo === 'dni') {
      if (dni.length < 13) setDni(prev => prev + tecla)
    } else {
      if (pin.length < 4) setPin(prev => prev + tecla)
    }
  }

  // Función que se llama al presionar el botón de borrar, elimina el último carácter del campo activo (dni o pin)
  function borrarUltimo() {
    // Si el campo activo es 'dni', se elimina el último carácter del estado dni usando slice,
    // de lo contrario se hace lo mismo con el estado pin
    if (campoActivo === 'dni') 
      setDni(prev => prev.slice(0, -1))
    else                       
      setPin(prev => prev.slice(0, -1))
  }


  // Función que se llama al presionar el botón de marcar, 
  // realiza varias validaciones y luego intenta registrar la marcación 
  async function marcar() {
    // Validación básica para asegurarse de que el 
    // DNI y el PIN estén completos antes de intentar registrar la marcación  
    if (!dni || pin.length < 4) {
      Alert.alert('Datos incompletos', 'Ingresa tu DNI y PIN de 4 dígitos')
      return
    }

    // Si las validaciones pasan, se intenta registrar la marcación,
    // obteniendo primero la ubicación y el ID del dispositivo para enviar esta información junto con el DNI, 
    // PIN y tipo de marcación
    try {
      // Se solicitan permisos para acceder a la ubicación del dispositivo,
      // si el permiso es concedido, se obtiene la ubicación actual (latitud y longitud)
      let latitud  = null
      let longitud = null

      // Location.requestForegroundPermissionsAsync() muestra un cuadro de diálogo solicitando 
      // permiso al usuario para acceder a su ubicación mientras la aplicación está en primer plano.  
      const { status } = await Location.requestForegroundPermissionsAsync()
      // Si el permiso es concedido, se obtiene la ubicación actual del dispositivo usando Location.
      // getCurrentPositionAsync(),
      // y se extraen la latitud y longitud de las coordenadas obtenidas  
      if (status === 'granted') {
        // getCurrentPositionAsync() obtiene la ubicación actual del dispositivo, incluyendo latitud y longitud,
        // y otros datos relacionados con la ubicación. Esta función devuelve un objeto que contiene las coordenadas
        const ubicacion = await Location.getCurrentPositionAsync({})
        // Se extraen la latitud y longitud 
        // de las coordenadas obtenidas y se asignan a las variables correspondientes  
        latitud  = ubicacion.coords.latitude
        longitud = ubicacion.coords.longitude
      }

      // Se obtiene un ID único del dispositivo combinando el modelo del dispositivo y 
      // un ID específico de Android, esto se hace para enviar esta información junto 
      // con la marcación y poder identificar desde qué dispositivo se hizo la marcación
      const androidId = await Application.getAndroidId()
      // Device.modelName proporciona el nombre del modelo del dispositivo 
      // (por ejemplo, "iPhone 12" o "Samsung Galaxy S21"),
      // y se combina con el androidId para crear un ID único para el dispositivo
      const deviceId  = Device.modelName + '_' + androidId

      // Se llama a la función registrarMarcada del contexto de asistencia,
      // enviando el DNI, PIN, tipo de marcación, latitud, longitud y deviceId como parámetros
      await registrarMarcada(dni, pin, tipo, latitud, longitud, deviceId)
      // Si el registro es exitoso, se muestra una alerta de éxito y se navega a la pantalla de confirmación
      navigation.navigate('Confirmacion')
      // Si hay un error durante el registro, se muestra una alerta con el mensaje de error
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo registrar la asistencia')
    }
  }

  // Renderizado principal de la pantalla: encabezado con título y botón para agregar nuevo empleado,
  // y lista de empleados o indicador de carga si está cargando
  return (
    // SafeAreaView asegura que el contenido no quede debajo de la barra de estado o notch en dispositivos móviles  
    <SafeAreaView style={styles.contenedor}>
      {/* KeyboardAvoidingView sube el contenido cuando aparece el teclado */}
      <KeyboardAvoidingView
      // behavior define cómo se ajusta la pantalla cuando aparece el teclado, 
      // usando 'padding' para iOS y 'height' para Android
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // style flex: 1 hace que el KeyboardAvoidingView ocupe toda la pantalla disponible
        style={{ flex: 1 }}
      >
        {/*ScrollView permite que el contenido sea desplazable, 
        especialmente útil cuando el teclado está abierto y puede cubrir parte de la pantalla*/} 
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/*Encabezado de la pantalla con un badge que indica el tipo de marcación (entrada o salida),
          el título "Identificación" y un subtítulo con instrucciones para el usuario*/}
          <View style={styles.encabezado}>
            <View style={[styles.badge, { backgroundColor: bgTipo }]}>
              <Text style={[styles.badgeTexto, { color: colorTipo }]}>{esTipo.toUpperCase()}</Text>
            </View>
            <Text style={styles.titulo}>Identificación</Text>
            <Text style={styles.subtitulo}>Ingresa tu DNI y PIN</Text>
          </View>

          {/* Campos para ingresar el DNI y el PIN, cada uno es un TouchableOpacity que
          cambia el campo activo al ser presionado, y muestra el valor ingresado o un 
          texto de indicación si está vacío. El campo activo se resalta con un borde diferente*/}
          <TouchableOpacity
            style={[styles.campo, campoActivo === 'dni' && styles.campoActivo]}
            onPress={() => setCampoActivo('dni')}
            activeOpacity={0.8}
          >
            {/* El campo de DNI muestra el valor ingresado o un texto de indicación si está vacío */}
            <Text style={styles.campoEtiqueta}>DNI</Text>
            <Text style={styles.campoValor}>{dni || 'Ingrese su DNI'}</Text>
          </TouchableOpacity>

          {/* El campo de PIN muestra puntos que representan los dígitos ingresados,
          y un texto de indicación si no se ha ingresado ningún dígito. 
          El campo activo se resalta con un borde diferente */}
          <TouchableOpacity
          // El campo de PIN es un TouchableOpacity que cambia el campo activo a 'pin' al ser presionado, 
          // y muestra puntos que representan los dígitos ingresados. Si el campo está activo, 
          // se aplica un estilo adicional para resaltar el borde. 
            style={[styles.campo, campoActivo === 'pin' && styles.campoActivo]}
            onPress={() => setCampoActivo('pin')}
            activeOpacity={0.8}
          >

            {/* El campo de PIN muestra un texto de indicación si no se ha ingresado ningún dígito,
            de lo contrario muestra puntos que representan los dígitos ingresados */}
            <Text style={styles.campoEtiqueta}>PIN de 4 dígitos</Text>
            {/* El campo de PIN muestra puntos que representan los dígitos ingresados */}
            <View style={styles.pinPuntos}>
              {/* Se mapean 4 puntos para representar los 4 dígitos del PIN, 
              y se aplica un estilo diferente a los puntos que representan dígitos ingresados */}
              {[0,1,2,3].map(i => (
                // Para cada índice de 0 a 3, se renderiza un punto. 
                // Si el índice es menor que la longitud del PIN ingresado, 
                // se aplica un estilo adicional para mostrar el punto como lleno,
                // de lo contrario se muestra como vacío. 
                // Esto permite visualizar cuántos dígitos del PIN han sido ingresados 
                // sin mostrar el valor real del PIN.  
                <View key={i} style={[styles.pinPunto, i < pin.length && styles.pinPuntoLleno]} />
              ))}
            </View>
          </TouchableOpacity>

          {/* Teclado numérico en pantalla */}
          {/* El teclado numérico se renderiza como una serie de TouchableOpacity que representan 
          las teclas del 1 al 9, un espacio vacío para alinear el 0 en el centro, 
          y una tecla de borrar que elimina el último dígito ingresado */}
          <View style={styles.teclado}>
            {/* Se mapean las teclas del 1 al 9 para renderizarlas como TouchableOpacity,
            cada una con un estilo de tecla y un texto que muestra el número, 
            y al ser presionada llama a la función presionarTecla con el número correspondiente*/}
            {['1','2','3','4','5','6','7','8','9'].map(t => (
              // Para cada número del 1 al 9, se renderiza un TouchableOpacity que representa la tecla,
              // con un estilo definido en styles.tecla, y al ser presionada llama a la función 
              // presionarTecla pasando el número como argumento. y el cero se renderiza por separado para estar centrado, 
              // con un espacio vacío a su izquierda. 
              <TouchableOpacity key={t} style={styles.tecla} onPress={() => presionarTecla(t)} activeOpacity={0.7}>
                {/* El texto de la tecla muestra el número correspondiente, con un estilo definido en styles.teclaTexto */}
                <Text style={styles.teclaTexto}>{t}</Text>
              </TouchableOpacity>
            ))}

            {/* Se renderiza un espacio vacío para alinear el 0 en el centro del teclado,
            seguido de la tecla del 0 y la tecla de borrar */}
            <View style={styles.teclaVacia} />
            {/* La tecla del 0 se renderiza como un TouchableOpacity con el mismo estilo que las demás teclas,
            y al ser presionada llama a la función presionarTecla con '0' como argumento */}
            <TouchableOpacity style={styles.tecla} onPress={() => presionarTecla('0')} activeOpacity={0.7}>
              {/* El texto de la tecla muestra el número 0, con un estilo definido en styles.teclaTexto */}
              <Text style={styles.teclaTexto}>0</Text>
            </TouchableOpacity>
            {/* La tecla de borrar se renderiza como un TouchableOpacity con un estilo diferente 
            para indicar su función de eliminación, y al ser presionada llama a la función borrarUltimo 
            para eliminar el último dígito ingresado */}
            <TouchableOpacity style={styles.teclaBorrar} onPress={borrarUltimo} activeOpacity={0.7}>
              {/* El texto de la tecla de borrar muestra un símbolo de retroceso (⌫), 
              con un estilo definido en styles.teclaTexto */}
              <Text style={styles.teclaTexto}>⌫</Text>
            </TouchableOpacity>
          </View>

          {/* Botón para marcar la entrada o salida, que muestra un indicador de 
          carga si se está procesando la marcación,
          o el botón de marcar si no se está cargando. Al ser presionado, llama a la función marcar */}
          {cargando ? (
            // Si se está cargando, se muestra un ActivityIndicator para indicar que se está procesando 
            // la marcación
            <ActivityIndicator size="large" color="#0D9488" style={{ marginTop: 16 }} />
          ) : (

            // Si no se está cargando, se muestra un botón para marcar la entrada o salida,
            // con un estilo definido en styles.btnMarcar, y al ser presionado llama a la función marcar
            <TouchableOpacity style={styles.btnMarcar} onPress={marcar} activeOpacity={0.8}>
              {/* El texto del botón muestra "Marcar Entrada" o "Marcar Salida" dependiendo del tipo de marcación,
              con un estilo definido en styles.btnTexto */}
              <Text style={styles.btnTexto}>Marcar {esTipo}</Text>
            </TouchableOpacity>
          )}

          {/* Botón para volver a la pantalla anterior, con un estilo definido en styles.btnVolver,
          y al ser presionado llama a navigation.goBack() para regresar a la pantalla anterior */}
          <TouchableOpacity style={styles.btnVolver} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            {/* El texto del botón de volver muestra "Volver", con un estilo definido en styles.btnVolverTexto */}
            <Text style={styles.btnVolverTexto}>Volver</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contenedor:     { flex: 1, backgroundColor: '#F0FAFA' },
  scroll:         { flexGrow: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40 },
  encabezado:     { alignItems: 'center', marginBottom: 24 },
  badge:          { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginBottom: 8 },
  badgeTexto:     { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  titulo:         { fontSize: 20, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
  subtitulo:      { fontSize: 13, color: '#64748B' },
  campo:          { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  campoActivo:    { borderColor: '#0D9488', borderWidth: 2 },
  campoEtiqueta:  { fontSize: 11, color: '#64748B', marginBottom: 4 },
  campoValor:     { fontSize: 16, fontWeight: '600', color: '#1E293B' },
  pinPuntos:      { flexDirection: 'row', gap: 12, marginTop: 4 },
  pinPunto:       { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: '#CBD5E1' },
  pinPuntoLleno:  { backgroundColor: '#0D9488', borderColor: '#0D9488' },
  teclado:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 20 },
  tecla:          { width: '30%', aspectRatio: 2, backgroundColor: '#FFFFFF', borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: '#E2E8F0' },
  
  // La tecla de borrar tiene un estilo diferente para indicar su función de eliminación, 
  // con un fondo rojo claro y bordes del mismo color pero más oscuro para resaltar su función de borrado. 
  teclaBorrar:{ 
    width: '30%', 
    aspectRatio: 2, 
    backgroundColor: '#FFF5F5', 
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 0.5, 
    borderColor: '#FCA5A5' 
  },

  // La tecla vacía se utiliza para alinear el 0 en el centro del teclado,
  // y tiene un estilo que simplemente ocupa espacio sin mostrar ningún contenido, 
  // con un ancho del 30% y una relación de aspecto de 2 para mantener el mismo tamaño que las demás teclas.
  teclaVacia:{ 
    width: '30%', 
    aspectRatio: 2 
  },

  // el estilo de las teclas del teclado numérico se define en styles.tecla, 
  // con un fondo blanco, bordes redondeados y un tamaño adecuado para ser presionadas fácilmente.
  // El texto de las teclas se define en styles.teclaTexto, 
  // con un tamaño de fuente grande y un color oscuro para asegurar una buena legibilidad.
  teclaTexto:{ 
    fontSize: 20, 
    fontWeight: '500', 
    color: '#1E293B' 
  },
  btnMarcar:      { backgroundColor: '#0D9488', borderRadius: 10, paddingVertical: 16, alignItems: 'center', marginBottom: 10 },
  btnTexto:       { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  btnVolver:      { paddingVertical: 12, alignItems: 'center', marginBottom: 20 },
  btnVolverTexto: { fontSize: 14, color: '#64748B' },
})