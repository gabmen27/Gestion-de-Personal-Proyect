import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useContextAdmin } from '../Providers/AdminProvider'

// Pantalla de login para el panel de administración, 
// donde el admin ingresa su usuario y contraseña para acceder al panel
export default function PantallaLoginAdmin({ navigation }: any) {

  // useContextAdmin proporciona la función iniciarSesion y el estado de cargando para manejar el proceso de login
  const { iniciarSesion, cargando } = useContextAdmin()

  // Estados locales para almacenar el usuario, contraseña y si se muestra la contraseña
  const [usuario,    setUsuario]    = useState('')
  const [contrasena, setContrasena] = useState('')

  // Estado para controlar si la contraseña se muestra o se oculta en el TextInput
  const [verClave,   setVerClave]   = useState(false)

  // Función que se ejecuta al presionar el botón de ingresar, valida que los campos no estén vacíos,
  // luego llama a iniciarSesion del contexto y maneja la navegación o errores
  async function login() {
    // Validación simple para asegurarse de que el usuario y contraseña 
    // no estén vacíos antes de intentar iniciar sesión
    if (!usuario || !contrasena) {
      Alert.alert('Datos incompletos', 'Ingresa usuario y contraseña')
      return
    }

    // Intentar iniciar sesión con las credenciales proporcionadas
    try {
      // Si iniciarSesion es exitoso, se navega al PanelAdmin y 
      // se resetea el stack de navegación para evitar volver al login
      await iniciarSesion(usuario, contrasena)
      //navigation es un objeto proporcionado por React Navigation que permite controlar 
      // la navegación entre pantallas
      // esta parte del codigo index: 0, routes: [{ name: 'PanelAdmin' }] }) 
      // resetea el stack de navegación y establece PanelAdmin como la única pantalla en el stack,
      //PanelAdmin es el nombre de la pantalla a la que se navega después de un login exitoso, 
      // la cual se define en el archivo de navegación (probablemente en App.tsx o Navigation.tsx)
      // y es la pantalla principal del panel de administración donde el admin puede gestionar empleados, 
      // departamentos, etc.
      navigation.reset({ index: 0, routes: [{ name: 'PanelAdmin' }] })
      // Si hay un error durante el inicio de sesión, se muestra una alerta con el mensaje de error
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Credenciales incorrectas')
    }
  }

  // Renderizado principal de la pantalla: formulario de login con campos para usuario y contraseña,
  // botón para mostrar/ocultar contraseña, nota sobre seguridad y botones para ingresar o volver
  return (

    // SafeAreaView asegura que el contenido no quede debajo de la barra de estado o notch en dispositivos móviles
    <SafeAreaView style={styles.contenedor}>

      {/*KeyboardAvoidingView ajusta la posición del contenido cuando el teclado está abierto, 
      para evitar que los campos queden ocultos*/}
      <KeyboardAvoidingView

      // En iOS se usa 'padding' para mover el contenido hacia arriba, 
      // en Android se usa 'height' para ajustar la altura del contenedor
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}

        // El estilo flex: 1 hace que el KeyboardAvoidingView ocupe toda la pantalla para funcionar correctamente
        style={{ flex: 1 }}
      >

        {/*ScrollView permite que el contenido sea desplazable, 
        especialmente útil en dispositivos con pantallas pequeñas o cuando el teclado está abierto*/}
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/*Encabezado con ícono, título y subtítulo para el login del panel admin*/}
          <View style={styles.encabezado}>
            <View style={styles.iconoCirculo}>
              <Text style={styles.iconoTexto}>🛡️</Text>
            </View>
            <Text style={styles.titulo}>Login admin</Text>
            <Text style={styles.subtitulo}>Ingresa tu usuario y contraseña</Text>
          </View>

          {/*Etiqueta y campo de texto para el nombre de usuario, con estilos para mejorar la apariencia*/}
          <Text style={styles.etiqueta}>Usuario</Text>
          <TextInput
            style={styles.input}
            value={usuario}
            onChangeText={setUsuario}
            placeholder="Nombre de usuario"
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/*Etiqueta y campo de texto para la contraseña, con estilos para mejorar la apariencia*/}
          <Text style={styles.etiqueta}>Contraseña</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, styles.inputConIcono]}
              value={contrasena}
              onChangeText={setContrasena}
              placeholder="Contraseña"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!verClave}
              autoCapitalize="none"
            />

              {/*Botón para mostrar u ocultar la contraseña, cambia el estado verClave al presionarlo*/}
            <TouchableOpacity style={styles.btnVerClave} onPress={() => setVerClave(!verClave)} activeOpacity={0.7}>
              <Text style={styles.btnVerClaveTexto}>{verClave ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          {/*Nota sobre seguridad de la sesión*/}
          <View style={styles.nota}>
            <Text style={styles.notaTexto}>🔒 Sesión protegida con token JWT</Text>
          </View>

          {/*Si se está cargando, se muestra un indicador de actividad, 
          de lo contrario se muestra el botón para ingresar*/}
          {cargando ? (
            <ActivityIndicator size="large" color="#0D9488" style={{ marginTop: 24 }} />
          ) : (

            // Botón para ingresar, que llama a la función login al presionarlo, 
            // con estilos para mejorar la apariencia
            <TouchableOpacity style={styles.btnIngresar} onPress={login} activeOpacity={0.8}>
              <Text style={styles.btnTexto}>Ingresar</Text>
            </TouchableOpacity>
          )}

          {/*Botón para volver a la pantalla anterior, que llama a navigation.goBack() al presionarlo,
          con estilos para mejorar la apariencia*/}
          <TouchableOpacity style={styles.btnVolver} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Text style={styles.btnVolverTexto}>Volver</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

// Estilos para la pantalla de login admin, utilizando StyleSheet para organizar los estilos de manera eficiente
const styles = StyleSheet.create({

  // Estilo para el contenedor principal de la pantalla, con fondo claro y ocupando toda la pantalla
  contenedor:{ 
    flex: 1, 
    backgroundColor: '#F0FAFA' 
  },

  // Estilo para el contenedor del ScrollView, con padding para separar el contenido de los bordes
  scroll:{ 
    flexGrow: 1, 
    paddingHorizontal: 24, 
    paddingTop: 60, 
    paddingBottom: 40 
  },

  // Estilo para el encabezado del login, centrando los elementos y separándolos con margin
  encabezado:{ 
    alignItems: 'center', 
    marginBottom: 32 
  },

  // Estilos para el ícono circular del encabezado, con fondo claro y centrado
  iconoCirculo:{ 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    backgroundColor: '#E1F5EE', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 12 
  },

  // Estilo para el texto del ícono, con tamaño grande para que sea visible dentro del círculo
  iconoTexto:{ 
    fontSize: 28 
  },

  // Estilos para el título y subtítulo del encabezado, con colores y tamaños para diferenciar jerarquía
  titulo:{ 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#1E293B', 
    marginBottom: 4 
  },

  // Estilo para el subtítulo, con tamaño más pequeño y color más suave para complementar el título
  subtitulo:{ 
    fontSize: 14, 
    color: '#64748B' 
  },

  // Estilos para las etiquetas de los campos de texto, con tamaño y color para que sean legibles y estén separados del campo
  etiqueta:{ 
    fontSize: 13, 
    fontWeight: '500', 
    color: '#475569', 
    marginBottom: 6, 
    marginTop: 12 
  },

  // Estilos para los campos de texto, con fondo blanco, bordes redondeados, 
  // padding para separar el texto del borde y color para el texto y el placeholder
  input:{ 
    backgroundColor: '#FFFFFF', 
    borderRadius: 10, 
    padding: 14, 
    fontSize: 15, 
    color: '#1E293B', 
    borderWidth: 1, 
    borderColor: '#E2E8F0' 
  },

  // Estilos para el contenedor del campo de contraseña, 
  // con posición relativa para colocar el botón de mostrar contraseña
  inputRow:{ 
    position: 'relative' 
  },

  // Estilo para el campo de texto cuando tiene un ícono dentro, 
  // con padding adicional a la derecha para no superponer el texto con el ícono
  inputConIcono:{ 
    paddingRight: 48 
  },

  // Estilos para el botón de mostrar u ocultar la contraseña, 
  // con posición absoluta para colocarlo dentro del campo de texto
  btnVerClave:{ 
    position: 'absolute', 
    right: 14, top: 0, 
    bottom: 0, 
    justifyContent: 'center' 
  },

  // Estilo para el texto del botón de mostrar contraseña, con tamaño grande para que sea visible
  btnVerClaveTexto:{ 
    fontSize: 18 
  },

  // Estilos para la nota sobre seguridad, con fondo claro, 
  // borde izquierdo destacado y padding para separar el texto del borde
  nota:{ 
    backgroundColor: '#EFF6FF', 
    borderRadius: 10, padding: 12, 
    marginTop: 16, 
    marginBottom: 24, 
    borderLeftWidth: 3, 
    borderLeftColor: '#0D9488' 
  },

  // Estilo para el texto de la nota, con tamaño pequeño y color suave para complementar el fondo claro
  notaTexto:{ 
    fontSize: 12, 
    color: '#475569' 
  },

  // Estilos para el botón de ingresar, con fondo destacado, 
  // bordes redondeados, padding para aumentar el área de toque y centrado del texto
  btnIngresar:{ 
    backgroundColor: '#0D9488', 
    borderRadius: 10, 
    paddingVertical: 16, 
    alignItems: 'center', 
    marginBottom: 10 
  },

  // Estilo para el texto del botón de ingresar, con color blanco para contrastar con el fondo y tamaño legible
  btnTexto:{ 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '600' 
  },

  // Estilos para el botón de volver, con padding para aumentar el área de toque,
  // centrado del texto y margin para separarlo del botón de ingresar
  btnVolver:{ 
    paddingVertical: 12, 
    alignItems: 'center', 
    marginBottom: 20 
  },

  // Estilo para el texto del botón de volver, con tamaño pequeño y 
  // color suave para indicar que es una acción secundaria
  btnVolverTexto:{ 
    fontSize: 14, 
    color: '#64748B' 
  },
})