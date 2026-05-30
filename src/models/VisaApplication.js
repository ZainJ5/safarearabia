import mongoose from 'mongoose';

const VisaApplicationSchema = new mongoose.Schema(
  {
    visa_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Visa' },
    visa_title: { type: String, required: true },
    visa_slug: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    nationality: { type: String },
    passport_number: { type: String },
    travel_date: { type: String },
    message: { type: String },
    status: { type: String, enum: ['pending', 'processing', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.models.VisaApplication || mongoose.model('VisaApplication', VisaApplicationSchema);
