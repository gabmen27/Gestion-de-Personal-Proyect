import React, { useState, useCallback } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import * as Location from 'expo-location'
import { peticionConToken } from '../Services/api'

// PantallaConfigGps permite ver y editar el perimetro autorizado
// guardado en la tabla configuracion_gps
export default function PantallaConfigGps({ navigation }: any) {

  const [id,          setId]          = useState<number | null>(null)
  const [nombre,      setNombre]      = useState('')
  const [latitud,     setLatitud]     = useState('')
  const [longitud,    setLongitud]    = useState('')
  const [radioMetros, setRadioMetros] = useState('')
  const [cargando,    setCargando]    = useState(true)
  const [guardando,   setGuardando]   = useState(false)

  useFocusEffect(
    useCallback(() => {
      cargarConfiguracion()
    }, [])
  )

  async function cargarConfiguracion() {
    setCargando(true)
    try {
      const respuesta = await peticionConToken('/configuracion-gps')
      const datos     = await respuesta.json()
      if (datos) {
        setId(datos.id)
        setNombre(datos.nombre)
        setLatitud(String(datos.latitud))
        setLongitud(String(datos.longitud))
        setRadioMetros(String(datos.radio_metros))
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la configuración GPS')
    } finally {
      setCargando(false)
    }
  }

  // usarUbicacionActual llama a expo-location para llenar lat/lon
  // con la posición actual del dispositivo del administrador
  async function usarUbicacionActual() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Activa el permiso de ubicación')
        return
      }
      const ubicacion = await Location.getCurrentPositionAsync({})
      setLatitud(String(ubicacion.coords.latitude))
      setLongitud(String(ubicacion.coords.longitude))
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la ubicación')
    }
  }

  async function guardar() {
    if (!nombre || !latitud || !longitud || !radioMetros) {
      Alert.alert('Datos incompletos', 'Completa todos los campos')
      return
    }
    setGuardando(true)
    try {
      const respuesta = await peticionConToken(`/configuracion-gps/${id}`, 'PUT', {
        nombre,
        latitud:      Number(latitud),
        longitud:     Number(longitud),
        radio_metros: Number(radioMetros),
      })
      const datos = await respuesta.json()
      if (!respuesta.ok) throw new Error(datos.mensaje)
      Alert.alert('Listo', 'Perímetro actualizado correctamente')
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo guardar')
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) {
    return (
      <SafeAreaView style={styles.contenedor}>
        <ActivityIndicator size="large" color="#0D9488" style={{ marginTop: 60 }} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.contenedor}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <View style={styles.encabezado}>
            <Text style={styles.titulo}>Perímetro GPS</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Dispositivos')} activeOpacity={0.7}>
              <Text style={styles.linkDispositivos}>Dispositivos →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.nota}>
            <Text style={styles.notaTexto}>
              📍 El sistema usa este punto y radio para verificar que los empleados marquen dentro del área autorizada.
            </Text>
          </View>

          <Text style={styles.etiqueta}>Nombre del lugar</Text>
          <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Edificio Municipal" placeholderTextColor="#94A3B8" />

          <Text style={styles.etiqueta}>Latitud</Text>
          <TextInput style={styles.input} value={latitud} onChangeText={setLatitud} placeholder="14.0265" placeholderTextColor="#94A3B8" keyboardType="numeric" />

          <Text style={styles.etiqueta}>Longitud</Text>
          <TextInput style={styles.input} value={longitud} onChangeText={setLongitud} placeholder="-86.5781" placeholderTextColor="#94A3B8" keyboardType="numeric" />

          <Text style={styles.etiqueta}>Radio permitido (metros)</Text>
          <TextInput style={styles.input} value={radioMetros} onChangeText={setRadioMetros} placeholder="200" placeholderTextColor="#94A3B8" keyboardType="numeric" />

          <TouchableOpacity style={styles.btnUbicacion} onPress={usarUbicacionActual} activeOpacity={0.8}>
            <Text style={styles.btnUbicacionTexto}>📍 Usar mi ubicación actual</Text>
          </TouchableOpacity>

          {guardando ? (
            <ActivityIndicator size="large" color="#0D9488" style={{ marginTop: 20 }} />
          ) : (
            <TouchableOpacity style={styles.btnGuardar} onPress={guardar} activeOpacity={0.8}>
              <Text style={styles.btnGuardarTexto}>Guardar perímetro</Text>
            </TouchableOpacity>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contenedor:        { flex: 1, backgroundColor: '#F0FAFA' },
  scroll:            { padding: 20, paddingBottom: 60 },
  encabezado:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  titulo:            { fontSize: 22, fontWeight: '700', color: '#1E293B' },
  linkDispositivos:  { fontSize: 13, color: '#0D9488', fontWeight: '600' },
  nota:              { backgroundColor: '#EFF6FF', borderRadius: 10, padding: 12, marginBottom: 20, borderLeftWidth: 3, borderLeftColor: '#0D9488' },
  notaTexto:         { fontSize: 12, color: '#475569', lineHeight: 18 },
  etiqueta:          { fontSize: 13, fontWeight: '500', color: '#475569', marginBottom: 6, marginTop: 12 },
  input:             { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, fontSize: 15, color: '#1E293B', borderWidth: 1, borderColor: '#E2E8F0' },
  btnUbicacion:      { backgroundColor: '#FFFFFF', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 16, borderWidth: 1, borderColor: '#0D9488' },
  btnUbicacionTexto: { color: '#0D9488', fontSize: 14, fontWeight: '600' },
  btnGuardar:        { backgroundColor: '#0D9488', borderRadius: 10, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
  btnGuardarTexto:   { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
})