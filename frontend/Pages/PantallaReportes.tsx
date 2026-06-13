import React, { useCallback, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { peticionConToken } from '../Services/api'

// PantallaReportes consulta la vista v_reporte_diario del servidor
// Usa peticionConToken directamente porque no necesita estado global
export default function PantallaReportes() {

  const [reporte,  setReporte]  = useState<any[]>([])
  const [cargando, setCargando] = useState(true)
  const [fecha,    setFecha]    = useState(new Date().toISOString().split('T')[0])

  useFocusEffect(
    useCallback(() => {
      cargarReporte()
    }, [fecha])
  )

  async function cargarReporte() {
    setCargando(true)
    try {
      const respuesta = await peticionConToken(`/reportes/dia?fecha=${fecha}`)
      const datos     = await respuesta.json()
      setReporte(datos)
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el reporte')
    } finally {
      setCargando(false)
    }
  }

  function cambiarFecha(dias: number) {
    const nueva = new Date(fecha)
    nueva.setDate(nueva.getDate() + dias)
    setFecha(nueva.toISOString().split('T')[0])
  }

  function renderFila({ item }: any) {
    return (
      <View style={styles.fila}>
        <View style={styles.filaInfo}>
          <Text style={styles.filaNombre}>{item.nombre_completo}</Text>
          <Text style={styles.filaDep}>{item.departamento}</Text>
          <Text style={styles.filaHorario}>
            {item.hora_entrada || '--:--'} · {item.hora_salida || 'Sin salida'}
          </Text>
        </View>
        <View style={styles.filaHoras}>
          <Text style={styles.filaHorasNum}>
            {item.horas_laboradas ? Number(item.horas_laboradas).toFixed(1) + 'h' : '--'}
          </Text>
          {item.horas_extras > 0 && (
            <View style={styles.extraBadge}>
              <Text style={styles.extraTexto}>+{Number(item.horas_extras).toFixed(1)}h</Text>
            </View>
          )}
          <View style={[styles.estadoBadge, { backgroundColor: item.estado_jornada === 'completa' ? '#EAF3DE' : '#FAEEDA' }]}>
            <Text style={[styles.estadoTexto, { color: item.estado_jornada === 'completa' ? '#3B6D11' : '#854F0B' }]}>
              {item.estado_jornada === 'completa' ? 'OK' : 'Revisar'}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.contenedor}>
      <View style={styles.selectorFecha}>
        <TouchableOpacity onPress={() => cambiarFecha(-1)} style={styles.btnFecha} activeOpacity={0.7}>
          <Text style={styles.btnFechaTexto}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.fechaTexto}>{fecha}</Text>
        <TouchableOpacity onPress={() => cambiarFecha(1)} style={styles.btnFecha} activeOpacity={0.7}>
          <Text style={styles.btnFechaTexto}>▶</Text>
        </TouchableOpacity>
      </View>

      {cargando ? (
        <ActivityIndicator size="large" color="#0D9488" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={reporte}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderFila}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={<Text style={styles.vacio}>Sin registros para esta fecha</Text>}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contenedor:    { flex: 1, backgroundColor: '#F0FAFA' },
  selectorFecha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#FFFFFF', borderBottomWidth: 0.5, borderBottomColor: '#E2E8F0' },
  btnFecha:      { padding: 8 },
  btnFechaTexto: { fontSize: 18, color: '#0D9488' },
  fechaTexto:    { fontSize: 16, fontWeight: '600', color: '#1E293B' },
  lista:         { padding: 16 },
  fila:          { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 0.5, borderColor: '#E2E8F0' },
  filaInfo:      { flex: 1 },
  filaNombre:    { fontSize: 14, fontWeight: '600', color: '#1E293B', marginBottom: 2 },
  filaDep:       { fontSize: 11, color: '#64748B', marginBottom: 4 },
  filaHorario:   { fontSize: 11, color: '#94A3B8' },
  filaHoras:     { alignItems: 'flex-end', gap: 4 },
  filaHorasNum:  { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  extraBadge:    { backgroundColor: '#FAEEDA', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  extraTexto:    { fontSize: 10, fontWeight: '600', color: '#854F0B' },
  estadoBadge:   { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  estadoTexto:   { fontSize: 11, fontWeight: '600' },
  vacio:         { textAlign: 'center', color: '#94A3B8', marginTop: 40, fontSize: 14 },
})