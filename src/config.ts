import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "..", ".env") });

interface Config {
  database: {
    host: string;
    dbname: string;
    username: string;
    password: string;
  };
}

const config: Config = {
  database: {
    host: process.env.SUPABASE_HOST || "",
    dbname: process.env.SUPABASE_DBNAME || "",
    username: process.env.SUPABASE_USERNAME || "",
    password: process.env.SUPABASE_PASS || "",
  },
};

export default config;
