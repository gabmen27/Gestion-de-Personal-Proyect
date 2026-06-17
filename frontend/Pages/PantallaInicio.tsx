import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// Pantalla de inicio donde el usuario selecciona si es empleado o administrador
export default function PantallaInicio({ navigation }: any) {

  // Estado para controlar qué rol ha seleccionado el usuario y así habilitar el botón de continuar
  const [rolSeleccionado, setRolSeleccionado] = useState<'empleado' | 'admin' | null>(null)


  // Función que se ejecuta al presionar el botón de continuar, 
  // navega a la pantalla correspondiente según el rol seleccionado 
  function continuar() {
    if (rolSeleccionado === 'empleado') navigation.navigate('Seleccion')
    if (rolSeleccionado === 'admin')    navigation.navigate('LoginAdmin')
  }

  // Renderizado de la pantalla con estilos modernos y responsivos 
  // para una mejor experiencia de usuario en dispositivos móviles. 
  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* Logo más arriba con menos espacio */}
        <View style={styles.logoArea}>
          {/* Logo circular con las iniciales SC y el nombre de la app debajo, centrados y con colores agradables*/}
          <View style={styles.logoCirculo}>
            {/* Las iniciales SC dentro del círculo del logo, con un estilo moderno y legible */}
            <Text style={styles.logoTexto}>SC</Text>
          </View>
          <Text style={styles.appNombre}>SCAM</Text>
          <Text style={styles.appSub}>Sistema de Control de Asistencia Movil</Text>
        </View>

        <Text style={styles.instruccion}>Selecciona cómo ingresas</Text>

        <TouchableOpacity
          style={[styles.rolBtn, rolSeleccionado === 'empleado' && styles.rolBtnActivo]}
          onPress={() => setRolSeleccionado('empleado')}
          activeOpacity={0.8}
        >
          <Text style={styles.rolIcono}>👤</Text>
          <Text style={[styles.rolTitulo, rolSeleccionado === 'empleado' && styles.rolTituloActivo]}>
            Empleado
          </Text>
          <Text style={styles.rolSub}>Marcar entrada o salida</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.rolBtn, rolSeleccionado === 'admin' && styles.rolBtnActivo]}
          onPress={() => setRolSeleccionado('admin')}
          activeOpacity={0.8}
        >
          <Text style={styles.rolIcono}>🛡️</Text>
          <Text style={[styles.rolTitulo, rolSeleccionado === 'admin' && styles.rolTituloActivo]}>
            Administrador
          </Text>
          <Text style={styles.rolSub}>Panel de gestión</Text>
        </TouchableOpacity>

        {/* Botón continuar con más margen superior */}
        <TouchableOpacity
          style={[styles.btnContinuar, !rolSeleccionado && styles.btnDeshabilitado]}
          onPress={continuar}
          disabled={!rolSeleccionado}
          activeOpacity={0.8}
        >
          <Text style={styles.btnTexto}>Continuar</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contenedor: { 
    flex: 1, 
    backgroundColor: '#F0FAFA' 
  },

  // El scroll tiene un padding horizontal para que el contenido no toque los bordes de la pantalla,
  // un padding top para que el logo esté más arriba y un padding bottom para que el botón de continuar 
  // no quede pegado al borde inferior, además de flexGrow para que el contenido se expanda y se centre 
  // verticalmente si no hay suficiente contenido para llenar la pantalla.
  scroll: { 
    flexGrow: 1, 
    paddingHorizontal: 24, 
    paddingTop: 80, 
    paddingBottom: 60 
  },

  logoArea: { 
    alignItems: 'center', 
    marginBottom: 40
  },
  // Logo circular con las iniciales SC dentro, centrado y con un fondo de color para destacar, 
  // con un margen inferior para separar del nombre de la app y un tamaño adecuado para ser 
  // reconocible sin ocupar demasiado espacio.
  logoCirculo: { 
    width: 72, 
    height: 72, 
    borderRadius: 18, 
    backgroundColor: '#0D9488', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 12 
  },

  logoTexto: { 
    color: '#FFFFFF', 
    fontSize: 26, 
    fontWeight: '700' 
  },

  appNombre: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: '#1E293B' 
  },

  appSub: { 
    fontSize: 13, 
    color: '#64748B', 
    marginTop: 4, 
    textAlign: 'center' 
  },

  instruccion: { 
    fontSize: 14, 
    color: '#64748B', 
    textAlign: 'center', 
    marginBottom: 20 
  },
  rolBtn: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 14, 
    padding: 18, 
    alignItems: 'center', 
    marginBottom: 14, 
    borderWidth: 1, 
    borderColor: '#E2E8F0' 
  },
  rolBtnActivo: { 
    borderColor: '#0D9488', 
    borderWidth: 2, 
    backgroundColor: '#E1F5EE' 
  },
  // Icono representativo del rol, con un tamaño grande y un margen inferior para separar del título
  rolIcono: { 
    fontSize: 32, 
    marginBottom: 8 
  },
  rolTitulo: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#1E293B', 
    marginBottom: 4 
  },
  rolTituloActivo: { 
    color: '#0D9488' 
  },
  rolSub: { 
    fontSize: 12, 
    color: '#64748B' 
  },
  btnContinuar: { 
    backgroundColor: '#0D9488', 
    borderRadius: 10, 
    paddingVertical: 18, 
    alignItems: 'center', 
    marginTop: 20 
  },
  btnDeshabilitado: { 
    backgroundColor: '#94A3B8' 
  },
  btnTexto: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '600' 
  },
})