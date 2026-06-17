import React, { useContext, useState } from 'react'
import { Vista } from '../Models/Vista'
import { Admin } from '../Models/Admin'
import { contextAdmin } from '../Context/ContextAdmin'
import { peticionPublica } from '../Services/api'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function AdminProvider(props: Vista) {

  const [admin,    setAdmin]    = useState<Admin | null>(null)
  const [token,    setToken]    = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  // Llama al endpoint POST /api/auth/login
  // Si es exitoso guarda el token y los datos del admin en AsyncStorage
  async function iniciarSesion(usuario: string, contrasena: string) {
    setCargando(true)
    try {
      const respuesta = await peticionPublica('/auth/login', 'POST', { usuario, contrasena })
      const datos     = await respuesta.json()

      if (!respuesta.ok) throw new Error(datos.mensaje)

      // Guardamos el token en AsyncStorage para que persista
      await AsyncStorage.setItem('token', datos.token)
      await AsyncStorage.setItem('admin', JSON.stringify(datos.admin))

      setToken(datos.token)
      setAdmin(datos.admin)

    } finally {
      setCargando(false)
    }
  }

  // Elimina el token y los datos del admin de AsyncStorage
  async function cerrarSesion() {
    await AsyncStorage.removeItem('token')
    await AsyncStorage.removeItem('admin')
    setToken(null)
    setAdmin(null)
  }

  return (
    <contextAdmin.Provider value={{ admin, token, cargando, iniciarSesion, cerrarSesion }}>
      {props.children}
    </contextAdmin.Provider>
  )
}

export function useContextAdmin() {
  return useContext(contextAdmin)
}