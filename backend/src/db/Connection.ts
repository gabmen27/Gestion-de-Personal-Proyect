// src/db/Connection.ts
// Conexión a MySQL usando Sequelize.
// Las credenciales vienen del .env — nunca se escriben aquí directo.

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'mysql',
    logging: false,
  }
);

export default sequelize;