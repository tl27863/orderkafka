import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "..", ".env") });

interface Config {
  database: {
    username: string;
    password: string;
  };
}

const config: Config = {
  database: {
    username: process.env.DB_USER || "",
    password: process.env.DB_PASS || "",
  },
};

export default config;
