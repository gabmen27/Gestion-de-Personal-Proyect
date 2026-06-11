// Models/Asistencia.ts
// Representa la tabla asistencias
// Es la tabla mas importante, registra cada marcada de entrada o salida

import { DataTypes, Model } from 'sequelize'
import sequelize from '../db/Connection'

class Asistencia extends Model {}

Asistencia.init(
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
    tipo: {
      // entrada o salida, define el tipo de marcada
      type: DataTypes.ENUM('entrada', 'salida'),
      allowNull: false,
    },
    fecha_hora: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    fecha: {
      // Se guarda por separado para filtros rapidos por dia
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    latitud: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    longitud: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    dentro_perimetro: {
      // 1 = dentro del area autorizada, 0 = fuera, null = sin GPS
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    distancia_metros: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    device_id: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    dispositivo_autorizado: {
      // 1 = dispositivo registrado, 0 = desconocido
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    estado: {
      // valida, alerta o rechazada segun las validaciones del servidor
      type: DataTypes.ENUM('valida', 'alerta', 'rechazada'),
      defaultValue: 'valida',
    },
    observacion: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'asistencias',
    timestamps: false,
  }
)

export default Asistencia