import { createConnection, Connection, RowDataPacket } from 'mysql2/promise';
import dotenv from 'dotenv';
import bluebird from 'bluebird';
import { log } from './config';

dotenv.config();

async function getConnection(): Promise<Connection> {
  return await createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DB,
    password: process.env.DB_PASS,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    Promise: bluebird
  });
}

export async function initialConnection() {
  try {
    const conn = await getConnection()
    log.info(`DB Connected to ${process.env.DB_HOST} ${process.env.DB_DB}`)
    conn.end()
  }
  catch (err) {
    log.error(err)
    log.error(`Failed to establish connection to ${process.env.DB_HOST} ${process.env.DB_DB}`)
  }
}


export async function query(payload: string) {
  const conn = await getConnection()
  const [rows, fields] = await (await conn.query(payload))
  return rows;
}

// const [rows, fields] = await conn.execute(`SELECT * FROM products WHERE product_id = 1`);
// console.log(rows)
// return rows

// pool.getConnection((err, conn) => {
//   if (err) {
//     return log.error(`Failed to establish connection to ${process.env.DB_HOST} ${process.env.DB_DB}`)
//   }
//   log.info(`DB Connected to ${process.env.DB_HOST} ${process.env.DB_DB}`)
//   conn.release()
// })

