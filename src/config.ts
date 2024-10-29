import dotenv from "dotenv";
import path from "path";
import { KafkaConfig } from "kafkajs";

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

const kafkaConfig: KafkaConfig = {
  clientId: process.env.CONFLUENT_ID || "",
  brokers: [process.env.CONFLUENT_HOST || ""],
  ssl: true,
  sasl: {
    mechanism: "plain",
    username: process.env.CONFLUENT_KEY || "",
    password: process.env.CONFLUENT_SECRET || "",
  },
};

export { config as default, kafkaConfig };
