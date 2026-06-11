// Models/Departamento.ts
// Representa la tabla departamentos en la base de datos
// Cada empleado pertenece a un departamento

import { DataTypes, Model } from 'sequelize'
import sequelize from '../db/Connection'

// La clase extiende Model para que Sequelize sepa que es un modelo
class Departamento extends Model {}

Departamento.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    activo: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
    creado_en: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'departamentos', // nombre exacto de la tabla en MySQL
    timestamps: false,          // la tabla ya tiene su propio campo creado_en
  }
)

export default Departamento