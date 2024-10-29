import { Request, Response, NextFunction } from "express";
import { KafkaService } from "../kafka";

export const kafkaLogger = (kafkaService: KafkaService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const requestStartTime = new Date().toISOString();
    const originalSend = res.send;

    // Capture request details
    const requestLog = {
      timestamp: requestStartTime,
      method: req.method,
      path: req.path,
      query: req.query,
      body: req.body,
      headers: req.headers,
    };

    // Override send
    res.send = function (body: any): Response {
      const parsedBody = typeof body === "string" ? JSON.parse(body) : body;
      const responseLog = {
        ...requestLog,
        responseTimestamp: new Date().toISOString(),
        statusCode: res.statusCode,
        responseBody: parsedBody,
        processingTime:
          new Date().getTime() - new Date(requestStartTime).getTime(),
      };

      kafkaService
        .sendMessage("log", responseLog)
        .catch((err) => console.error("Failed to send log to Kafka:", err));

      return originalSend.call(this, body);
    };
    next();
  };
};
