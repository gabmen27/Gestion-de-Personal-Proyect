// Models/ResumenDiario.ts
// Representa la tabla resumen_diario
// El trigger de MySQL lo actualiza automaticamente al registrar cada marcada

import { DataTypes, Model } from 'sequelize'
import sequelize from '../db/Connection'

class ResumenDiario extends Model {}

ResumenDiario.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    hora_entrada: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    hora_salida: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    horas_laboradas: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    horas_extras: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00,
    },
    estado_jornada: {
      // completa, sin_salida, sin_entrada o dia_libre
      type: DataTypes.ENUM('completa', 'sin_salida', 'sin_entrada', 'dia_libre'),
      defaultValue: 'sin_salida',
    },
    calculado_en: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'resumen_diario',
    timestamps: false,
  }
)

export default ResumenDiario