import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useContextEmpleado } from '../Providers/EmpleadoProvider'

// PantallaFormEmpleado sirve tanto para crear como para editar
// Usa agregarEmpleado y editarEmpleado del EmpleadoProvider
export default function PantallaFormEmpleado({ navigation, route }: any) {

  const empleadoExistente                             = route.params?.empleado
  const { agregarEmpleado, editarEmpleado, cargando } = useContextEmpleado()

  const [nombres,        setNombres]        = useState(empleadoExistente?.nombres        || '')
  const [apellidos,      setApellidos]      = useState(empleadoExistente?.apellidos      || '')
  const [dni,            setDni]            = useState(empleadoExistente?.dni            || '')
  const [pin,            setPin]            = useState('')
  const [cargo,          setCargo]          = useState(empleadoExistente?.cargo          || '')
  const [idDepartamento, setIdDepartamento] = useState(empleadoExistente?.id_departamento?.toString() || '')
  const [horasJornada,   setHorasJornada]   = useState(empleadoExistente?.horas_jornada?.toString()   || '8')

  const esEdicion = !!empleadoExistente

  async function guardar() {
    if (!nombres || !apellidos || !dni || !idDepartamento) {
      Alert.alert('Datos incompletos', 'Nombres, apellidos, DNI y departamento son requeridos')
      return
    }
    if (!esEdicion && pin.length !== 4) {
      Alert.alert('PIN inválido', 'El PIN debe tener exactamente 4 dígitos')
      return
    }
    try {
      const datos: any = {
        nombres, apellidos, dni, cargo,
        id_departamento: Number(idDepartamento),
        horas_jornada:   Number(horasJornada),
      }
      if (pin) datos.pin = pin

      // Llama a agregarEmpleado o editarEmpleado del EmpleadoProvider
      // El provider hace el fetch y recarga la lista automáticamente
      if (esEdicion) {
        await editarEmpleado(empleadoExistente.id, datos)
      } else {
        await agregarEmpleado(datos)
      }

      Alert.alert('Listo', esEdicion ? 'Empleado actualizado' : 'Empleado registrado', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ])
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo guardar')
    }
  }

  async function desactivar() {
    Alert.alert('Desactivar empleado', '¿Seguro que deseas desactivar este empleado?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Desactivar', style: 'destructive',
        onPress: async () => {
          try {
            await editarEmpleado(empleadoExistente.id, { activo: 0 })
            navigation.goBack()
          } catch (error: any) {
            Alert.alert('Error', error.message)
          }
        }
      }
    ])
  }

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.encabezado}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Text style={styles.btnVolverTexto}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.titulo}>{esEdicion ? 'Editar empleado' : 'Nuevo empleado'}</Text>
        </View>

        <Text style={styles.etiqueta}>Nombres</Text>
        <TextInput style={styles.input} value={nombres} onChangeText={setNombres} placeholder="Nombres" placeholderTextColor="#94A3B8" />

        <Text style={styles.etiqueta}>Apellidos</Text>
        <TextInput style={styles.input} value={apellidos} onChangeText={setApellidos} placeholder="Apellidos" placeholderTextColor="#94A3B8" />

        <Text style={styles.etiqueta}>DNI</Text>
        <TextInput style={styles.input} value={dni} onChangeText={setDni} placeholder="Número de identidad" placeholderTextColor="#94A3B8" keyboardType="numeric" editable={!esEdicion} />

        <Text style={styles.etiqueta}>{esEdicion ? 'Nuevo PIN (vacío para no cambiar)' : 'PIN de 4 dígitos'}</Text>
        <TextInput style={styles.input} value={pin} onChangeText={setPin} placeholder="4 dígitos" placeholderTextColor="#94A3B8" keyboardType="numeric" maxLength={4} secureTextEntry />

        <Text style={styles.etiqueta}>ID Departamento</Text>
        <TextInput style={styles.input} value={idDepartamento} onChangeText={setIdDepartamento} placeholder="Número del departamento" placeholderTextColor="#94A3B8" keyboardType="numeric" />

        <Text style={styles.etiqueta}>Cargo</Text>
        <TextInput style={styles.input} value={cargo} onChangeText={setCargo} placeholder="Puesto o cargo" placeholderTextColor="#94A3B8" />

        <Text style={styles.etiqueta}>Horas de jornada</Text>
        <TextInput style={styles.input} value={horasJornada} onChangeText={setHorasJornada} placeholder="8" placeholderTextColor="#94A3B8" keyboardType="numeric" />

        {cargando ? (
          <ActivityIndicator size="large" color="#0D9488" style={{ marginTop: 24 }} />
        ) : (
          <>
            <TouchableOpacity style={styles.btnGuardar} onPress={guardar} activeOpacity={0.8}>
              <Text style={styles.btnGuardarTexto}>Guardar</Text>
            </TouchableOpacity>
            {esEdicion && (
              <TouchableOpacity style={styles.btnDesactivar} onPress={desactivar} activeOpacity={0.8}>
                <Text style={styles.btnDesactivarTexto}>Desactivar empleado</Text>
              </TouchableOpacity>
            )}
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contenedor:         { flex: 1, backgroundColor: '#F0FAFA' },
  scroll:             { padding: 20 },
  encabezado:         { marginBottom: 24 },
  btnVolverTexto:     { fontSize: 14, color: '#0D9488', marginBottom: 8 },
  titulo:             { fontSize: 22, fontWeight: '700', color: '#1E293B' },
  etiqueta:           { fontSize: 13, fontWeight: '500', color: '#475569', marginBottom: 6, marginTop: 12 },
  input:              { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, fontSize: 15, color: '#1E293B', borderWidth: 1, borderColor: '#E2E8F0' },
  btnGuardar:         { backgroundColor: '#0D9488', borderRadius: 10, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
  btnGuardarTexto:    { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  btnDesactivar:      { borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: '#FCA5A5' },
  btnDesactivarTexto: { color: '#E53E3E', fontSize: 15, fontWeight: '500' },
})