import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Text, TouchableOpacity, Alert } from 'react-native'

import PantallaInicio       from '../Pages/PantallaInicio'
import PantallaSeleccion    from '../Pages/PantallaSeleccion'
import PantallaMarcar       from '../Pages/PantallaMarcar'
import PantallaConfirmacion from '../Pages/PantallaConfirmacion'
import PantallaLoginAdmin   from '../Pages/PantallaLoginAdmin'
import PantallaEmpleados    from '../Pages/PantallaEmpleados'
import PantallaFormEmpleado from '../Pages/PantallaFormEmpleado'
import PantallaReportes     from '../Pages/PantallaReportes'
import PantallaAlertas      from '../Pages/PantallaAlertas'
import PantallaConfigGps    from '../Pages/PantallaConfigGps'
import PantallaDispositivos from '../Pages/PantallaDispositivos'
import { useContextAdmin }  from '../Providers/AdminProvider'

const Stack = createNativeStackNavigator()
const Tab   = createBottomTabNavigator()

function EmpleadosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ListaEmpleados" component={PantallaEmpleados} />
      <Stack.Screen name="FormEmpleado"   component={PantallaFormEmpleado} />
    </Stack.Navigator>
  )
}

// PanelAdmin agrupa las pantallas del admin en bottom tabs
// Incluye un botón de cerrar sesión en el header
function PanelAdmin({ navigation }: any) {

  const { cerrarSesion } = useContextAdmin()

  function confirmarSalida() {
    Alert.alert('Cerrar sesión', '¿Deseas cerrar tu sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión', style: 'destructive',
        onPress: async () => {
          // cerrarSesion borra el token de AsyncStorage y limpia el contexto
          await cerrarSesion()
          // reset limpia el historial para que no pueda volver con "atrás"
          navigation.reset({ index: 0, routes: [{ name: 'Inicio' }] })
        }
      }
    ])
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor:   '#0D9488',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: { borderTopWidth: 0.5, borderTopColor: '#E2E8F0' },
        headerShown:  true,
        headerStyle:  { backgroundColor: '#FFFFFF', elevation: 0, shadowOpacity: 0 },
        headerTintColor: '#1E293B',
        // Botón de cerrar sesión en la esquina superior derecha de cada pestaña
        headerRight: () => (
          <TouchableOpacity onPress={confirmarSalida} style={{ marginRight: 16, padding: 4 }}>
            <Text style={{ color: '#E53E3E', fontSize: 13, fontWeight: '600' }}>Salir</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Tab.Screen
        name="TabEmpleados" component={EmpleadosStack}
        options={{ title: 'Empleados', tabBarLabel: 'Empleados', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👥</Text> }}
      />
      <Tab.Screen
        name="TabReportes" component={PantallaReportes}
        options={{ title: 'Reportes', tabBarLabel: 'Reportes', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📊</Text> }}
      />
      <Tab.Screen
        name="TabAlertas" component={PantallaAlertas}
        options={{ title: 'Alertas', tabBarLabel: 'Alertas', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🔔</Text> }}
      />
      <Tab.Screen
        name="TabConfig" component={ConfigStack}
        options={{ title: 'Configuración', tabBarLabel: 'Config', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>⚙️</Text> }}
      />
    </Tab.Navigator>
  )
}

// ConfigStack agrupa las dos pantallas de configuración
function ConfigStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ConfigGps"     component={PantallaConfigGps} />
      <Stack.Screen name="Dispositivos"  component={PantallaDispositivos} />
    </Stack.Navigator>
  )
}

export default function NavBar() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Inicio"       component={PantallaInicio} />
        <Stack.Screen name="Seleccion"    component={PantallaSeleccion} />
        <Stack.Screen name="Marcar"       component={PantallaMarcar} />
        <Stack.Screen name="Confirmacion" component={PantallaConfirmacion} />
        <Stack.Screen name="LoginAdmin"   component={PantallaLoginAdmin} />
        <Stack.Screen name="PanelAdmin"   component={PanelAdmin} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}