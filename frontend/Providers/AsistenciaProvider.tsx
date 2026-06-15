import React, { useContext, useState } from 'react'
import { Vista } from '../Models/Vista'
import { Asistencia } from '../Models/Asistencia'
import { contextAsistencia } from '../Context/ContextAsistencia'
import { peticionPublica } from '../Services/api'

export default function AsistenciaProvider(props: Vista) {

  const [ultimaMarcada, setUltimaMarcada] = useState<Asistencia | null>(null)
  const [cargando,      setCargando]      = useState(false)

  // Llama al endpoint POST /api/asistencia
  // Envía DNI, PIN, tipo, GPS y Device ID al servidor
  async function registrarMarcada(
    dni:      string,
    pin:      string,
    tipo:     string,
    latitud:  number | null,
    longitud: number | null,
    deviceId: string
  ) {
    setCargando(true)
    try {
      const respuesta = await peticionPublica('/asistencia', 'POST', {
        dni,
        pin,
        tipo,
        latitud,
        longitud,
        device_id: deviceId,
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) throw new Error(datos.mensaje)

      // Guardamos la última marcada para mostrarla en la pantalla de confirmación
      setUltimaMarcada({
        nombre:     datos.nombre,
        tipo:       datos.tipo,
        fecha_hora: datos.fecha_hora,
        estado:     datos.estado,
      })

    } finally {
      setCargando(false)
    }
  }

  return (
    <contextAsistencia.Provider value={{ ultimaMarcada, cargando, registrarMarcada }}>
      {props.children}
    </contextAsistencia.Provider>
  )
}

export function useContextAsistencia() {
  return useContext(contextAsistencia)
}