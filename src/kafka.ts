import { Kafka, Producer } from "kafkajs";
import { kafkaConfig } from "./config";

export class KafkaService {
  private kafka: Kafka;
  private producer: Producer;

  constructor() {
    this.kafka = new Kafka(kafkaConfig);
    this.producer = this.kafka.producer();
  }

  async connect(): Promise<void> {
    try {
      await this.producer.connect();
      console.log("Connected to Kafka");
    } catch (error) {
      console.error("Error connecting to Kafka:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.producer.disconnect();
      console.log("Disconnected from Kafka");
    } catch (error) {
      console.error("Error disconnecting from Kafka:", error);
      throw error;
    }
  }

  async sendMessage(topic: string, message: any): Promise<void> {
    try {
      await this.producer.send({
        topic,
        messages: [
          {
            value: JSON.stringify(message),
          },
        ],
      });
      console.log("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }
}
