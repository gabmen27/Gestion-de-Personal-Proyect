// Models/Alerta.ts
// Representa la tabla alertas
// El trigger de MySQL inserta aqui automaticamente cuando detecta anomalias

import { DataTypes, Model } from 'sequelize'
import sequelize from '../db/Connection'

class Alerta extends Model {}

Alerta.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    id_asistencia: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipo_alerta: {
      type: DataTypes.ENUM(
        'gps_fuera_perimetro',
        'dispositivo_no_registrado',
        'dispositivo_compartido',
        'doble_entrada',
        'sin_salida_fin_dia'
      ),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    revisada: {
      // 0 = pendiente, 1 = el admin ya la revisó
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    revisada_por: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    revisada_en: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    creada_en: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'alertas',
    timestamps: false,
  }
)

export default Alerta