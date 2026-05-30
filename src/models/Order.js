import mongoose from 'mongoose';

// Schema mirrors the MySQL orders table exactly (flat fields, not nested)
const OrderSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    merchant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    order_number: { type: String, required: true, unique: true },
    product_id: { type: String, required: true },
    product_type: {
      type: String,
      enum: ['tour', 'hotel', 'transport', 'activity', 'visa'],
      required: true,
    },
    transport_type: String,
    start_date: String,
    end_date: String,
    days: String,
    // Flat adult fields (matches DB: adult_unit_price, adult_qty, adult_total_price)
    adult_unit_price: { type: Number, default: 0 },
    adult_qty: { type: Number, default: 0 },
    adult_total_price: { type: Number, default: 0 },
    // Flat child fields
    child_unit_price: { type: Number, default: 0 },
    child_qty: { type: Number, default: 0 },
    child_total_price: { type: Number, default: 0 },
    services: mongoose.Schema.Types.Mixed,
    total_amount: { type: Number, default: 0 },
    tax_rate: { type: Number, default: 0 },
    tax_amount: { type: Number, default: 0 },
    total_with_tax: { type: Number, default: 0 },
    // Customer info (flat)
    first_name: String,
    last_name: String,
    phone: String,
    email: String,
    address: String,
    street_address: String,
    postal_code: String,
    notes: String,
    status: { type: Number, default: 1 }, // 1=Pending, 2=Processing, 3=Approved, 4=Cancel
    payment_status: { type: Number, default: 2 }, // 1=Paid, 2=Unpaid
    view: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
