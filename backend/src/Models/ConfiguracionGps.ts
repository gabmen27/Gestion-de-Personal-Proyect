// Models/ConfiguracionGps.ts
// Representa la tabla configuracion_gps
// Define el perimetro autorizado donde los empleados pueden marcar asistencia

import { DataTypes, Model } from 'sequelize'
import sequelize from '../db/Connection'

class ConfiguracionGps extends Model {}

ConfiguracionGps.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    latitud: {
      // Coordenada del centro del perimetro autorizado
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },
    longitud: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
    radio_metros: {
      // Radio en metros del circulo permitido, por defecto 200
      type: DataTypes.INTEGER,
      defaultValue: 200,
    },
    activo: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: 'configuracion_gps',
    timestamps: false,
  }
)

export default ConfiguracionGps