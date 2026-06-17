import React, { useContext, useState } from 'react'
import { Vista } from '../Models/Vista'
import { Empleado } from '../Models/Empleado'
import { contextEmpleado } from '../Context/ContextEmpleado'
import { peticionConToken } from '../Services/api'

export default function EmpleadoProvider(props: Vista) {

  const [listaEmpleados, setListaEmpleados] = useState<Empleado[]>([])
  const [cargando,       setCargando]       = useState(false)

  // Llama al endpoint GET /api/empleados
  // Trae todos los empleados activos con su departamento
  async function cargarEmpleados() {
    setCargando(true)
    try {
      const respuesta = await peticionConToken('/empleados')
      const datos     = await respuesta.json()
      setListaEmpleados(datos)
    } finally {
      setCargando(false)
    }
  }

  // Llama al endpoint POST /api/empleados
  // Registra un nuevo empleado en la base de datos
  async function agregarEmpleado(datos: any) {
    setCargando(true)
    try {
      const respuesta = await peticionConToken('/empleados', 'POST', datos)
      const resultado = await respuesta.json()
      if (!respuesta.ok) throw new Error(resultado.mensaje)
      // Recargamos la lista para mostrar el nuevo empleado
      await cargarEmpleados()
    } finally {
      setCargando(false)
    }
  }

  // Llama al endpoint PUT /api/empleados/:id
  // Edita o desactiva un empleado existente
  async function editarEmpleado(id: number, datos: any) {
    setCargando(true)
    try {
      const respuesta = await peticionConToken(`/empleados/${id}`, 'PUT', datos)
      const resultado = await respuesta.json()
      if (!respuesta.ok) throw new Error(resultado.mensaje)
      // Recargamos la lista para reflejar los cambios
      await cargarEmpleados()
    } finally {
      setCargando(false)
    }
  }

  return (
    <contextEmpleado.Provider value={{ listaEmpleados, cargando, cargarEmpleados, agregarEmpleado, editarEmpleado }}>
      {props.children}
    </contextEmpleado.Provider>
  )
}

export function useContextEmpleado() {
  return useContext(contextEmpleado)
}