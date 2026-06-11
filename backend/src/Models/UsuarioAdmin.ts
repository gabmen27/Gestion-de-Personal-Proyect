// Models/UsuarioAdmin.ts
// Representa la tabla usuarios_admin
// Cuentas independientes de los empleados para acceder al panel admin

import { DataTypes, Model } from 'sequelize'
import sequelize from '../db/Connection'

class UsuarioAdmin extends Model {}

UsuarioAdmin.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usuario: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: true,
    },
    contrasena: {
      // Contraseña cifrada con bcryptjs, nunca en texto plano
      type: DataTypes.CHAR(60),
      allowNull: false,
    },
    nombre_completo: {
      type: DataTypes.STRING(160),
      allowNull: false,
    },
    rol: {
      // superadmin: acceso total, admin: gestión diaria, viewer: solo lectura
      type: DataTypes.ENUM('superadmin', 'admin', 'viewer'),
      defaultValue: 'admin',
    },
    activo: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
    ultimo_acceso: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    creado_en: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'usuarios_admin',
    timestamps: false,
  }
)

export default UsuarioAdmin