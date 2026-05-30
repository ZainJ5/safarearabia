import mongoose from 'mongoose';

const TransportInquirySchema = new mongoose.Schema(
  {
    transport_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Transport' },
    transport_title: { type: String, required: true },
    transport_slug: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    passengers: { type: String },
    travel_date: { type: String },
    vehicle_type: { type: String },
    message: { type: String },
    status: { type: String, enum: ['new', 'contacted', 'confirmed', 'cancelled'], default: 'new' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.models.TransportInquiry || mongoose.model('TransportInquiry', TransportInquirySchema);
