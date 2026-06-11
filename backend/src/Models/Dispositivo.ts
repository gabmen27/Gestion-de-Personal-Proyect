// Models/Dispositivo.ts
// Representa la tabla dispositivos_autorizados
// Vincula cada empleado con su dispositivo para control anti-fraude

import { DataTypes, Model } from 'sequelize'
import sequelize from '../db/Connection'

class Dispositivo extends Model {}

Dispositivo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    device_id: {
      // Identificador unico del celular capturado con expo-device
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    plataforma: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    modelo: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    activo: {
      // Solo puede haber 1 dispositivo activo por empleado
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
    registrado_en: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'dispositivos_autorizados',
    timestamps: false,
  }
)

export default Dispositivo