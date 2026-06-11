// Models/Index.ts
// Importa todos los modelos y define las relaciones entre ellos
// Desde cualquier parte del proyecto solo se importa este archivo

import Departamento    from './Departamento'
import Empleado        from './Empleado'
import UsuarioAdmin    from './UsuarioAdmin'
import Asistencia      from './Asistencia'
import ResumenDiario   from './ResumenDiario'
import Alerta          from './Alerta'
import Dispositivo     from './Dispositivo'
import SesionAdmin     from './SesionAdmin'
import ConfiguracionGps from './ConfiguracionGps'

// Un departamento tiene muchos empleados
// Un empleado pertenece a un departamento
Departamento.hasMany(Empleado, { foreignKey: 'id_departamento' })
Empleado.belongsTo(Departamento, { foreignKey: 'id_departamento' })

// Un empleado tiene muchas asistencias
// Una asistencia pertenece a un empleado
Empleado.hasMany(Asistencia, { foreignKey: 'id_empleado' })
Asistencia.belongsTo(Empleado, { foreignKey: 'id_empleado' })

// Un empleado tiene muchos resumenes diarios
// Un resumen diario pertenece a un empleado
Empleado.hasMany(ResumenDiario, { foreignKey: 'id_empleado' })
ResumenDiario.belongsTo(Empleado, { foreignKey: 'id_empleado' })

// Un empleado tiene muchas alertas
// Una alerta pertenece a un empleado
Empleado.hasMany(Alerta, { foreignKey: 'id_empleado' })
Alerta.belongsTo(Empleado, { foreignKey: 'id_empleado' })

// Una asistencia puede generar una alerta
// Una alerta proviene de una asistencia especifica
Asistencia.hasMany(Alerta, { foreignKey: 'id_asistencia' })
Alerta.belongsTo(Asistencia, { foreignKey: 'id_asistencia' })

// Un empleado tiene un dispositivo autorizado
// Un dispositivo pertenece a un empleado
Empleado.hasMany(Dispositivo, { foreignKey: 'id_empleado' })
Dispositivo.belongsTo(Empleado, { foreignKey: 'id_empleado' })

// Un usuario admin tiene muchas sesiones
// Una sesion pertenece a un usuario admin
UsuarioAdmin.hasMany(SesionAdmin, { foreignKey: 'id_usuario' })
SesionAdmin.belongsTo(UsuarioAdmin, { foreignKey: 'id_usuario' })

// Un usuario admin puede revisar muchas alertas
// Una alerta fue revisada por un usuario admin
UsuarioAdmin.hasMany(Alerta, { foreignKey: 'revisada_por' })
Alerta.belongsTo(UsuarioAdmin, { foreignKey: 'revisada_por', as: 'revisor' })

// Exportamos todos los modelos desde un solo lugar
export {
  Departamento,
  Empleado,
  UsuarioAdmin,
  Asistencia,
  ResumenDiario,
  Alerta,
  Dispositivo,
  SesionAdmin,
  ConfiguracionGps,
}