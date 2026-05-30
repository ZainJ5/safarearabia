import mongoose from 'mongoose';

const VisaCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    status: { type: Number, default: 1 },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.models.VisaCategory || mongoose.model('VisaCategory', VisaCategorySchema);
