import React, { useState, useCallback } from 'react'
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { peticionConToken } from '../Services/api'

// PantallaDispositivos muestra las alertas de "dispositivo no registrado"
// y permite autorizar ese Device ID para el empleado con un solo toque
export default function PantallaDispositivos({ navigation }: any) {

  const [pendientes, setPendientes] = useState<any[]>([])
  const [autorizados, setAutorizados] = useState<any[]>([])
  const [cargando,   setCargando]   = useState(true)

  useFocusEffect(
    useCallback(() => {
      cargarTodo()
    }, [])
  )

  async function cargarTodo() {
    setCargando(true)
    try {
      // Alertas de tipo dispositivo_no_registrado aun sin revisar
      const respAlertas = await peticionConToken('/alertas')
      const alertas     = await respAlertas.json()
      const noRegistradas = alertas.filter((a: any) => a.tipo_alerta === 'dispositivo_no_registrado')
      setPendientes(noRegistradas)

      // Dispositivos ya autorizados
      const respDisp = await peticionConToken('/dispositivos')
      const disp      = await respDisp.json()
      setAutorizados(disp)
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la información')
    } finally {
      setCargando(false)
    }
  }

  // Extrae el device_id completo desde el texto de la alerta
  // La descripcion tiene el formato: "Device ID no registrado: <id>"
  function extraerDeviceId(descripcion: string) {
    return descripcion.replace('Device ID no registrado: ', '').replace('...', '')
  }

  // Autoriza el dispositivo para el empleado y marca la alerta como revisada
  async function autorizar(item: any) {
    const deviceId = extraerDeviceId(item.descripcion)
    try {
      await peticionConToken('/dispositivos', 'POST', {
        id_empleado: item.id_empleado,
        device_id:   deviceId,
        plataforma:  'android',
        modelo:      item.Empleado ? `${item.Empleado.nombres} ${item.Empleado.apellidos}` : '',
      })
      // Marca la alerta como revisada para que no vuelva a salir
      await peticionConToken(`/alertas/${item.id}`, 'PUT')

      Alert.alert('Listo', 'Dispositivo autorizado correctamente')
      cargarTodo()
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo autorizar el dispositivo')
    }
  }

  // Desactiva un dispositivo ya autorizado
  async function desactivar(id: number) {
    try {
      await peticionConToken(`/dispositivos/${id}`, 'PUT')
      cargarTodo()
    } catch (error) {
      Alert.alert('Error', 'No se pudo desactivar')
    }
  }

  function renderPendiente({ item }: any) {
    const deviceId = extraerDeviceId(item.descripcion)
    return (
      <View style={styles.tarjetaPendiente}>
        <Text style={styles.pendienteTitulo}>Dispositivo nuevo detectado</Text>
        <Text style={styles.pendienteNombre}>
          {item.Empleado?.nombres} {item.Empleado?.apellidos}
        </Text>
        <Text style={styles.pendienteId} numberOfLines={1}>{deviceId}</Text>
        <TouchableOpacity style={styles.btnAutorizar} onPress={() => autorizar(item)} activeOpacity={0.8}>
          <Text style={styles.btnAutorizarTexto}>Autorizar este dispositivo</Text>
        </TouchableOpacity>
      </View>
    )
  }

  function renderAutorizado({ item }: any) {
    return (
      <View style={styles.tarjetaAutorizada}>
        <View style={{ flex: 1 }}>
          <Text style={styles.autorizadoNombre}>
            {item.Empleado?.nombres} {item.Empleado?.apellidos}
          </Text>
          <Text style={styles.autorizadoId} numberOfLines={1}>{item.device_id}</Text>
        </View>
        <TouchableOpacity onPress={() => desactivar(item.id)} activeOpacity={0.7}>
          <Text style={styles.btnDesactivar}>Quitar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.contenedor}>
      <View style={styles.encabezado}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.btnVolverTexto}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Dispositivos</Text>
      </View>

      {cargando ? (
        <ActivityIndicator size="large" color="#0D9488" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={[]}
          keyExtractor={() => 'x'}
          ListHeaderComponent={
            <View style={{ paddingHorizontal: 20 }}>

              <Text style={styles.seccionTitulo}>Pendientes de autorizar</Text>
              {pendientes.length === 0 ? (
                <Text style={styles.vacio}>No hay dispositivos pendientes</Text>
              ) : (
                pendientes.map(item => <View key={`pend-${item.id}`}>{renderPendiente({ item })}</View>)
              )}

              <Text style={[styles.seccionTitulo, { marginTop: 24 }]}>Dispositivos autorizados</Text>
              {autorizados.length === 0 ? (
                <Text style={styles.vacio}>No hay dispositivos autorizados</Text>
              ) : (
                autorizados.map(item => <View key={`autor-${item.id}`}>{renderAutorizado({ item })}</View>)
              )}

            </View>
          }
          renderItem={null}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contenedor:        { flex: 1, backgroundColor: '#F0FAFA' },
  encabezado:        { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 0.5, borderBottomColor: '#E2E8F0' },
  btnVolverTexto:    { fontSize: 14, color: '#0D9488', marginBottom: 6 },
  titulo:            { fontSize: 20, fontWeight: '700', color: '#1E293B' },
  seccionTitulo:     { fontSize: 13, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 16, marginBottom: 10 },
  vacio:             { fontSize: 13, color: '#94A3B8', marginBottom: 10 },
  tarjetaPendiente:  { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, marginBottom: 10, borderLeftWidth: 3, borderLeftColor: '#EF9F27', borderWidth: 0.5, borderColor: '#E2E8F0' },
  pendienteTitulo:   { fontSize: 11, fontWeight: '700', color: '#854F0B', textTransform: 'uppercase', marginBottom: 4 },
  pendienteNombre:   { fontSize: 14, fontWeight: '600', color: '#1E293B', marginBottom: 2 },
  pendienteId:       { fontSize: 11, color: '#94A3B8', marginBottom: 10 },
  btnAutorizar:      { backgroundColor: '#0D9488', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  btnAutorizarTexto: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  tarjetaAutorizada: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 0.5, borderColor: '#E2E8F0' },
  autorizadoNombre:  { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  autorizadoId:      { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  btnDesactivar:     { fontSize: 12, color: '#E53E3E', fontWeight: '600' },
})