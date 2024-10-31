# Order API with Kafka

A Node.js Express API that handles orders and inventory management with Kafka integration.

## Features

- Express server with TypeScript
- Kafka integration for event streaming
- PostgreSQL database connection using TypeORM

## Prerequisites

- Node.js
- PostgreSQL database
- Confluent Kafka Cluster
- npm

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
SUPABASE_HOST=your_database_host
SUPABASE_DBNAME=your_database_name
SUPABASE_USERNAME=your_database_username
SUPABASE_PASS=your_database_password

# Kafka Configuration
CONFLUENT_ID=your_kafka_client_id
CONFLUENT_HOST=your_kafka_broker
CONFLUENT_KEY=your_kafka_key
CONFLUENT_SECRET=your_kafka_secret
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

## API Endpoints

- `/api/inventory` - Inventory management endpoints
- `/api/order` - Order management endpoints

More detail in routes directory README

## Database

Uses TypeORM with PostgreSQL database including entities for:
- Orders
- Order Items
- Inventory
- Payment Transactions

## Testing

Check tests directory README

## License

[MIT License](LICENSE)
