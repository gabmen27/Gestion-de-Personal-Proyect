import AdminProvider from './Providers/AdminProvider'
import AsistenciaProvider from './Providers/AsistenciaProvider'
import EmpleadoProvider from './Providers/EmpleadoProvider'
import NavBar from './Componets/NavBar'

// App.tsx es el punto de entrada de la aplicación
// Envuelve todo con los tres providers para que cualquier
// pantalla pueda acceder a los datos sin pasar props manualmente
export default function App() {
  return (
    <AdminProvider>
      <AsistenciaProvider>
        <EmpleadoProvider>
          <NavBar />
        </EmpleadoProvider>
      </AsistenciaProvider>
    </AdminProvider>
  )
}