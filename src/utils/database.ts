
import { Pool } from 'pg';

// Environment variables would typically be loaded via .env
const databaseUrl = "postgresql://upload_owner:npg_oTN35eElIuDj@ep-soft-dawn-a1pbesfl-pooler.ap-southeast-1.aws.neon.tech/invite_sys?sslmode=require";

// Create a connection pool
export const pool = new Pool({
  connectionString: databaseUrl,
});

// Initialize the database with required tables
export const initDatabase = async () => {
  try {
    // Create the history table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS prediction_history (
        id SERIAL PRIMARY KEY,
        prediction_type VARCHAR(50) NOT NULL,
        input_data JSONB NOT NULL,
        result JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

// Save a prediction to history
export const savePrediction = async (
  predictionType: string,
  inputData: any,
  result: any
) => {
  try {
    const query = `
      INSERT INTO prediction_history (prediction_type, input_data, result)
      VALUES ($1, $2, $3)
      RETURNING id;
    `;
    const values = [predictionType, JSON.stringify(inputData), JSON.stringify(result)];
    const res = await pool.query(query, values);
    console.log(`Prediction saved with ID: ${res.rows[0].id}`);
    return res.rows[0].id;
  } catch (error) {
    console.error("Error saving prediction:", error);
    return null;
  }
};

// Get all prediction history
export const getAllPredictions = async () => {
  try {
    const query = `
      SELECT * FROM prediction_history
      ORDER BY created_at DESC;
    `;
    const res = await pool.query(query);
    return res.rows;
  } catch (error) {
    console.error("Error fetching predictions:", error);
    return [];
  }
};

// Get prediction history by type
export const getPredictionsByType = async (predictionType: string) => {
  try {
    const query = `
      SELECT * FROM prediction_history
      WHERE prediction_type = $1
      ORDER BY created_at DESC;
    `;
    const values = [predictionType];
    const res = await pool.query(query, values);
    return res.rows;
  } catch (error) {
    console.error(`Error fetching ${predictionType} predictions:`, error);
    return [];
  }
};

// Delete a prediction by ID
export const deletePrediction = async (id: number) => {
  try {
    const query = `
      DELETE FROM prediction_history
      WHERE id = $1;
    `;
    const values = [id];
    await pool.query(query, values);
    console.log(`Prediction with ID ${id} deleted`);
    return true;
  } catch (error) {
    console.error(`Error deleting prediction ${id}:`, error);
    return false;
  }
};
