// Models/SesionAdmin.ts
// Representa la tabla sesiones_admin
// Registra cada acceso al panel de administracion para auditoria

import { DataTypes, Model } from 'sequelize'
import sequelize from '../db/Connection'

class SesionAdmin extends Model {}

SesionAdmin.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    token_jti: {
      // Identificador unico del JWT para poder invalidarlo si es necesario
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    ip_origen: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    dispositivo: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    iniciada_en: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    expira_en: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    invalidada: {
      // 1 = el token fue cerrado antes de vencer
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'sesiones_admin',
    timestamps: false,
  }
)

export default SesionAdmin