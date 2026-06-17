import React, { useState } from 'react'
import {View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// PantallaSeleccion permite elegir si la marcada es entrada o salida
// El tipo seleccionado se pasa como parámetro a PantallaMarcar
export default function PantallaSeleccion({ navigation }: any) {

  const [tipoSeleccionado, setTipoSeleccionado] = useState<'entrada' | 'salida' | null>(null)

  function continuar() {
    if (tipoSeleccionado) {
      // navigation.navigate pasa el tipo como parámetro a la siguiente pantalla
      navigation.navigate('Marcar', { tipo: tipoSeleccionado })
    }
  }

  return (
    <SafeAreaView style={styles.contenedor}>

      <View style={styles.encabezado}>
        <Text style={styles.titulo}>¿Qué deseas realizar?</Text>
        <Text style={styles.subtitulo}>Seleccione si desea marcar entrada o salida</Text>
      </View>

      <View style={styles.tarjetasRow}>

        <TouchableOpacity
          style={[styles.tarjeta, tipoSeleccionado === 'entrada' && styles.tarjetaEntradaActiva]}
          onPress={() => setTipoSeleccionado('entrada')}
          activeOpacity={0.8}
        >
          <Text style={styles.tarjetaIcono}>🔵</Text>
          <Text style={[styles.tarjetaTitulo, tipoSeleccionado === 'entrada' && styles.tituloEntrada]}>
            Entrada
          </Text>
          <Text style={styles.tarjetaSub}>Inicio de jornada</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tarjeta, tipoSeleccionado === 'salida' && styles.tarjetaSalidaActiva]}
          onPress={() => setTipoSeleccionado('salida')}
          activeOpacity={0.8}
        >
          <Text style={styles.tarjetaIcono}>🔴</Text>
          <Text style={[styles.tarjetaTitulo, tipoSeleccionado === 'salida' && styles.tituloSalida]}>
            Salida
          </Text>
          <Text style={styles.tarjetaSub}>Fin de jornada</Text>
        </TouchableOpacity>

      </View>

      <View style={styles.nota}>
        <Text style={styles.notaTexto}>
          📍 El GPS y el identificador del dispositivo se capturan automáticamente
        </Text>
      </View>

      {/* Botón para continuar a la pantalla de marcado, habilitado solo si se ha seleccionado un tipo,
      con un estilo destacado para incentivar al usuario a avanzar, y un margen inferior para separarlo 
      de la nota. */}
      <TouchableOpacity
      // El botón de continuar se habilita solo si se ha seleccionado un tipo (entrada o salida),
      // de lo contrario se muestra deshabilitado con un estilo diferente para indicar que no se puede presionar.
        style={[styles.btnContinuar, !tipoSeleccionado && styles.btnDeshabilitado]}
        onPress={continuar}
        disabled={!tipoSeleccionado}
        activeOpacity={0.8}
      >
        <Text style={styles.btnTexto}>Siguiente</Text>
      </TouchableOpacity>

      {/* Botón para volver a la pantalla anterior, 
      con un estilo más discreto y un margen superior para separarlo del botón de continuar.  */}
      <TouchableOpacity 
      // El botón de volver siempre está habilitado, con un estilo más discreto y 
      // un margen superior para separarlo del botón de continuar. 
      style={styles.btnVolver} onPress={() => navigation.goBack()} activeOpacity={0.8}>
        <Text style={styles.btnVolverTexto}> ◄ Volver</Text>
      </TouchableOpacity>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1, backgroundColor: '#F0FAFA',
    paddingHorizontal: 24, justifyContent: 'center',
  },
  encabezado: { alignItems: 'center', marginBottom: 32 },
  titulo: { fontSize: 20, fontWeight: '700', color: '#1E293B', marginBottom: 6 },
  subtitulo: { fontSize: 14, color: '#64748B' },
  tarjetasRow: { flexDirection: 'row', gap: 14, marginBottom: 20 },
  tarjeta: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14,
    paddingVertical: 24, alignItems: 'center',
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  tarjetaEntradaActiva: { borderColor: '#0D9488', borderWidth: 2, backgroundColor: '#E1F5EE' },
  tarjetaSalidaActiva: { borderColor: '#E53E3E', borderWidth: 2, backgroundColor: '#FFF5F5' },
  tarjetaIcono: { fontSize: 32, marginBottom: 10 },
  tarjetaTitulo: { fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 4 },
  tituloEntrada: { color: '#0D9488' },
  tituloSalida: { color: '#E53E3E' },
  tarjetaSub: { fontSize: 12, color: '#64748B' },
  nota: {
    backgroundColor: '#EFF6FF', borderRadius: 10,
    padding: 12, marginBottom: 24,
    borderLeftWidth: 3, borderLeftColor: '#0D9488',
  },
  notaTexto: { fontSize: 12, color: '#475569', lineHeight: 18 },

  btnContinuar: { 
    backgroundColor: '#0D9488', 
    borderRadius: 10, 
    paddingVertical: 16, 
    alignItems: 'center', 
    marginBottom: 10 
  },

  btnDeshabilitado: { backgroundColor: '#94A3B8' },
  btnTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },

  btnVolver: { 
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF0000',
    paddingVertical: 12, 
    alignItems: 'center' 
  },

  btnVolverTexto: { fontSize: 14, color: '#64748B' },
})