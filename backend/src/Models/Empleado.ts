// Models/Empleado.ts
// Representa la tabla empleados
// Depende de Departamento (clave foránea id_departamento)

import { DataTypes, Model } from 'sequelize'
import sequelize from '../db/Connection'

class Empleado extends Model {}

Empleado.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dni: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    nombres: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    apellidos: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    pin: {
      // El PIN llega ya cifrado con bcryptjs desde el API
      // Nunca se guarda en texto plano
      type: DataTypes.CHAR(60),
      allowNull: false,
    },
    id_departamento: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cargo: {
      type: DataTypes.STRING(120),
      defaultValue: '',
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    correo: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    horas_jornada: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 8.00,
    },
    activo: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
    creado_en: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    actualizado_en: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'empleados',
    timestamps: false,
  }
)

export default Empleado