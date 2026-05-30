import mongoose from 'mongoose';

const TransportCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    icon: { type: String, default: '' },
    status: { type: Number, default: 1 },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.models.TransportCategory ||
  mongoose.model('TransportCategory', TransportCategorySchema);
