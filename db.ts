import mysql, { ResultSetHeader } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
interface QueryResult extends ResultSetHeader {
  [key: string]: any;
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});


export async function query(
  sqlString: string,
  params: any[] = []
): Promise<QueryResult[]> {
  try {
    const [rows] = await pool.execute<QueryResult[]>(sqlString, params);
    return rows;
  } catch (error) {
    console.error("Erreur lors de l'exécution de la requête SQL :", error);
    throw error;
  }
}
