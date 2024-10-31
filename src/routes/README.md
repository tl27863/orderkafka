# API Routes Documentation

## Base URLs
- Inventory: `/api/inventory`
- Orders: `/api/order`

## Endpoints

### Inventory Management

#### Update Inventory
```http
POST /api/inventory/update/:productId/:quantity
```

Parameters:
- `productId` (UUID): Product identifier
- `quantity` (Integer): Stock quantity

Response:
```json
{
  "message": "Inventory updated"
}
```

#### Get Stock Level
```http
GET /api/inventory/stock?productId={productId}
```

Query Parameters:
- `productId` (UUID): Product identifier

Success Response: (200)
```json
{
  "product_id": "uuid",
  "quantity": 10,
  "reserved_quantity": 2
}
```

### Order Management

#### Create Order
```http
POST /api/order/create
```

Request Body:
```json
{
  "customer_id": "uuid",
  "items": [
    {
      "product_id": "uuid",
      "quantity": 2,
      "price": 10.99
    }
  ]
}
```

Success Response: (200)
```json
{
  "orderId": 1,
  "message": "Order created successfully"
}
```

#### Get Order Details
```http
GET /api/order/:orderId
```

Parameters:
- `orderId` (Integer): Order identifier

Success Response: (200)
```json
{
  "id": 1,
  "customer_id": "uuid",
  "status": "PENDING",
  "orderItems": [...],
  "paymentTransaction": {...}
}
```

#### Update Order Status
```http
PUT /api/order/:orderId?status={status}
```

Parameters:
- `orderId` (Integer): Order identifier
- `status` (String): New status ("CONFIRMED" or "CANCELLED")

Success Response: (200)
```json
{
  "id": 1,
  "status": "CONFIRMED"
}
```

## Error Handling

### Error Response Format
```json
{
  "message": "Error description"
}
```

## Usage Examples

### Update Inventory
```bash
curl -X POST \
  'http://localhost:3000/api/inventory/update/550e8400-e29b-41d4-a716-446655440000/10'
```

### Create Order
```bash
curl -X POST \
  'http://localhost:3000/api/order/create' \
  -H 'Content-Type: application/json' \
  -d '{
    "customer_id": "550e8400-e29b-41d4-a716-446655440000",
    "items": [
      {
        "product_id": "550e8400-e29b-41d4-a716-446655440000",
        "quantity": 2,
        "price": 10.99
      }
    ]
  }'
```

### Update Order Status
```bash
curl -X PUT \
  'http://localhost:3000/api/order/1?status=CONFIRMED'
```
