import React, { useCallback, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { peticionConToken } from '../Services/api'

// PantallaAlertas lista las alertas pendientes del sistema
// El administrador puede marcar cada alerta como revisada
export default function PantallaAlertas() {

  const [alertas,  setAlertas]  = useState<any[]>([])
  const [cargando, setCargando] = useState(true)

  useFocusEffect(
    useCallback(() => {
      cargarAlertas()
    }, [])
  )

  async function cargarAlertas() {
    setCargando(true)
    try {
      const respuesta = await peticionConToken('/alertas')
      const datos     = await respuesta.json()
      setAlertas(datos)
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar las alertas')
    } finally {
      setCargando(false)
    }
  }

  async function marcarRevisada(id: number) {
    try {
      await peticionConToken(`/alertas/${id}`, 'PUT')
      cargarAlertas()
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la alerta')
    }
  }

  function colorAlerta(tipo: string) {
    if (tipo === 'gps_fuera_perimetro')       return '#EF9F27'
    if (tipo === 'dispositivo_compartido')    return '#E24B4A'
    if (tipo === 'dispositivo_no_registrado') return '#E24B4A'
    return '#EF9F27'
  }

  function renderAlerta({ item }: any) {
    const color = colorAlerta(item.tipo_alerta)
    return (
      <View style={[styles.alerta, { borderLeftColor: color }]}>
        <View style={styles.alertaEncabezado}>
          <Text style={[styles.alertaTipo, { color }]}>
            {item.tipo_alerta.replace(/_/g, ' ').toUpperCase()}
          </Text>
          <Text style={styles.alertaFecha}>
            {new Date(item.creada_en).toLocaleDateString('es-HN')}
          </Text>
        </View>
        <Text style={styles.alertaNombre}>
          {item.Empleado?.nombres} {item.Empleado?.apellidos}
        </Text>
        <Text style={styles.alertaDesc}>{item.descripcion}</Text>
        <TouchableOpacity style={styles.btnRevisar} onPress={() => marcarRevisada(item.id)} activeOpacity={0.8}>
          <Text style={styles.btnRevisarTexto}>Marcar como revisada</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.contenedor}>
      <View style={styles.encabezado}>
        <Text style={styles.titulo}>Alertas</Text>
        {alertas.length > 0 && (
          <View style={styles.contadorBadge}>
            <Text style={styles.contadorTexto}>{alertas.length} pendientes</Text>
          </View>
        )}
      </View>

      {cargando ? (
        <ActivityIndicator size="large" color="#0D9488" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={alertas}
          keyExtractor={item => item.id.toString()}
          renderItem={renderAlerta}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <View style={styles.sinAlertas}>
              <Text style={styles.sinAlertasIcono}>✅</Text>
              <Text style={styles.sinAlertasTexto}>Sin alertas pendientes</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contenedor:       { flex: 1, backgroundColor: '#F0FAFA' },
  encabezado:       { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 0.5, borderBottomColor: '#E2E8F0' },
  titulo:           { fontSize: 20, fontWeight: '700', color: '#1E293B' },
  contadorBadge:    { backgroundColor: '#FAEEDA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  contadorTexto:    { fontSize: 12, fontWeight: '600', color: '#854F0B' },
  lista:            { padding: 16 },
  alerta:           { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, marginBottom: 10, borderLeftWidth: 3, borderWidth: 0.5, borderColor: '#E2E8F0' },
  alertaEncabezado: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  alertaTipo:       { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  alertaFecha:      { fontSize: 11, color: '#94A3B8' },
  alertaNombre:     { fontSize: 14, fontWeight: '600', color: '#1E293B', marginBottom: 4 },
  alertaDesc:       { fontSize: 12, color: '#64748B', marginBottom: 10 },
  btnRevisar:       { alignSelf: 'flex-end', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#0D9488' },
  btnRevisarTexto:  { fontSize: 12, color: '#0D9488', fontWeight: '500' },
  sinAlertas:       { alignItems: 'center', marginTop: 60 },
  sinAlertasIcono:  { fontSize: 40, marginBottom: 12 },
  sinAlertasTexto:  { fontSize: 15, color: '#94A3B8' },
})