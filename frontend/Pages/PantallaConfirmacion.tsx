import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
// SafeAreaView es un componente que asegura que el contenido no quede tapado por la barra de estado o el notch
import { SafeAreaView } from 'react-native-safe-area-context'
import { useContextAsistencia } from '../Providers/AsistenciaProvider'

// PantallaConfirmacion lee los datos de la última marcada desde el contexto
// No necesita route.params porque los datos vienen del AsistenciaProvider
export default function PantallaConfirmacion({ navigation }: any) {

  // useContextAsistencia es el hook que exporta AsistenciaProvider
  // Siguiendo el patrón del Ing., las pantallas nunca hacen fetch directo
  const { ultimaMarcada } = useContextAsistencia()

  if (!ultimaMarcada) return null

  const esEntrada  = ultimaMarcada.tipo === 'entrada'
  const colorTipo  = esEntrada ? '#0D9488' : '#E53E3E'
  const bgTipo     = esEntrada ? '#E1F5EE' : '#FFF5F5'

  const fecha = new Date(ultimaMarcada.fecha_hora)
  const hora  = fecha.toLocaleTimeString('es-HN', { hour: '2-digit', minute: '2-digit' })
  const dia   = fecha.toLocaleDateString('es-HN',  { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <SafeAreaView style={styles.contenedor}>

      <View style={styles.iconoCirculo}>
        <Text style={styles.iconoTexto}>✅</Text>
      </View>

      <Text style={styles.titulo}>Asistencia registrada</Text>

      <View style={[styles.badge, { backgroundColor: bgTipo }]}>
        <Text style={[styles.badgeTexto, { color: colorTipo }]}>
          {ultimaMarcada.tipo.toUpperCase()}
        </Text>
      </View>

      <View style={styles.tarjeta}>
        <View style={styles.fila}>
          <Text style={styles.etiqueta}>Empleado</Text>
          <Text style={styles.valor}>{ultimaMarcada.nombre}</Text>
        </View>
        <View style={styles.fila}>
          <Text style={styles.etiqueta}>Hora</Text>
          <Text style={styles.valor}>{hora}</Text>
        </View>
        <View style={styles.fila}>
          <Text style={styles.etiqueta}>Fecha</Text>
          <Text style={styles.valor}>{dia}</Text>
        </View>
        <View style={[styles.fila, { borderBottomWidth: 0 }]}>
          <Text style={styles.etiqueta}>Estado</Text>
          <View style={[styles.estadoBadge, { backgroundColor: ultimaMarcada.estado === 'valida' ? '#EAF3DE' : '#FAEEDA' }]}>
            <Text style={[styles.estadoTexto, { color: ultimaMarcada.estado === 'valida' ? '#3B6D11' : '#854F0B' }]}>
              {ultimaMarcada.estado === 'valida' ? 'Válida' : 'Con alerta'}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.btnNueva}
        onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Inicio' }] })}
        activeOpacity={0.8}
      >
        <Text style={styles.btnTexto}>Nueva marcada</Text>
      </TouchableOpacity>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contenedor:   { flex: 1, backgroundColor: '#F0FAFA', paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' },
  iconoCirculo: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#E1F5EE', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  iconoTexto:   { fontSize: 32 },
  titulo:       { fontSize: 22, fontWeight: '700', color: '#1E293B', marginBottom: 10 },
  badge:        { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, marginBottom: 24 },
  badgeTexto:   { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  tarjeta:      { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 20, width: '100%', marginBottom: 24, borderWidth: 0.5, borderColor: '#E2E8F0' },
  fila:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#F1F5F9' },
  etiqueta:     { fontSize: 14, color: '#64748B' },
  valor:        { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  estadoBadge:  { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  estadoTexto:  { fontSize: 12, fontWeight: '600' },
  btnNueva:     { backgroundColor: '#0D9488', borderRadius: 10, paddingVertical: 16, paddingHorizontal: 48, alignItems: 'center' },
  btnTexto:     { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
})