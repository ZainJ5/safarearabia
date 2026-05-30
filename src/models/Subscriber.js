import mongoose from 'mongoose';

const SubscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: { type: Number, default: 1 }, // 1=Active, 0=Unsubscribed
    ip: String,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.models.Subscriber || mongoose.model('Subscriber', SubscriberSchema);
