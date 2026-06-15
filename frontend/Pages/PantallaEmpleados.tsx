import React, { useCallback } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { useContextEmpleado } from '../Providers/EmpleadoProvider'

// PantallaEmpleados usa useContextEmpleado para acceder a la lista y cargarEmpleados
// useFocusEffect recarga la lista cada vez que la pantalla aparece en pantalla
export default function PantallaEmpleados({ navigation }: any) {

  const { listaEmpleados, cargando, cargarEmpleados } = useContextEmpleado()

  // useFocusEffect ejecuta la carga cada vez que esta pantalla recibe el foco
  // Diferente a useEffect que solo corre al montar el componente
  useFocusEffect(
    useCallback(() => {
      cargarEmpleados()
    }, [])
  )

  //funcio que ayuda para mostrar las iniciales del empleado en el avatar circular, 
  // tomando la primera letra de los nombres y apellidos
  function obtenerIniciales(nombres: string, apellidos: string) {
    return (nombres[0] + apellidos[0]).toUpperCase()
  }

  //funcion que renderiza cada item de la lista de empleados, 
  // mostrando su nombre, departamento, dni y estado (activo/inactivo)
  function renderEmpleado({ item }: any) {
    return (
      // Al tocar un empleado, se navega a FormEmpleado pasando el objeto empleado para editar
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('FormEmpleado', { empleado: item })}
        activeOpacity={0.8}>

          {/* Avatar circular con iniciales del empleado */}
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>{obtenerIniciales(item.nombres, item.apellidos)}</Text>
        </View>

        {/* Información del empleado: nombre completo, departamento y dni */}
        <View style={styles.itemInfo}>
          <Text style={styles.itemNombre}>{item.nombres} {item.apellidos}</Text>
          <Text style={styles.itemSub}>{item.Departamento?.nombre} · DNI {item.dni}</Text>
        </View>

        {/* Badge que indica si el empleado está activo o inactivo, con colores distintos */}        
        <View style={[styles.itemBadge, { backgroundColor: item.activo ? '#EAF3DE' : '#F1F5F9' }]}>
          <Text style={[styles.itemBadgeTexto, { color: item.activo ? '#3B6D11' : '#64748B' }]}>
            {item.activo ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  // Renderizado principal de la pantalla: encabezado con título y botón para agregar nuevo empleado,
  // y lista de empleados o indicador de carga si está cargando
  return (
    // SafeAreaView asegura que el contenido no quede debajo de la barra de estado o notch en dispositivos móviles
    <SafeAreaView style={styles.contenedor}>
      <View style={styles.encabezado}>
        <Text style={styles.titulo}>Empleados</Text>
        <TouchableOpacity
          style={styles.btnAgregar}
          onPress={() => navigation.navigate('FormEmpleado', { empleado: null })}
          activeOpacity={0.8}
        >
          <Text style={styles.btnAgregarTexto}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      {cargando ? (
        <ActivityIndicator size="large" color="#0D9488" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={listaEmpleados}
          keyExtractor={item => item.id.toString()}
          renderItem={renderEmpleado}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <Text style={styles.vacio}>No hay empleados registrados</Text>
          }
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contenedor:{ 
    flex: 1, 
    backgroundColor: '#F0FAFA' 
  },

  encabezado:{ 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 40, 
    backgroundColor: '#FFFFFF', 
    borderBottomWidth: 0.5, 
    borderBottomColor: '#E2E8F0' 
  },

  titulo:{ 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#1E293B' 
  },

  btnAgregar:{ 
    backgroundColor: '#0D9488', 
    borderRadius: 8, 
    paddingHorizontal: 14, 
    paddingVertical: 8 
  },

  btnAgregarTexto:{ 
    color: '#FFFFFF', 
    fontSize: 14, 
    fontWeight: '600' 
  },

  lista:{ 
    padding: 16 
  },

  item:{ 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF', 
    borderRadius: 12, 
    padding: 14, 
    marginBottom: 10, 
    borderWidth: 0.5, 
    borderColor: '#E2E8F0' 
  },

  avatar:{ 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#E1F5EE', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12 
  },

  avatarTexto:      { fontSize: 14, fontWeight: '600', color: '#0F6E56' },
  itemInfo:         { flex: 1 },
  itemNombre:       { fontSize: 14, fontWeight: '600', color: '#1E293B', marginBottom: 2 },
  itemSub:          { fontSize: 12, color: '#64748B' },
  itemBadge:        { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  itemBadgeTexto:   { fontSize: 11, fontWeight: '600' },
  vacio:            { textAlign: 'center', color: '#94A3B8', marginTop: 40, fontSize: 14 },
})