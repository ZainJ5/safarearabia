import mongoose from 'mongoose';

const FunFactSchema = new mongoose.Schema(
  {
    number: { type: String, required: true },
    suffix: { type: String, default: '+' },
    label: { type: String, required: true },
    icon: { type: String, default: 'bi-award' },
    serial: { type: Number, default: 0 },
    status: { type: Number, default: 1 },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.models.FunFact || mongoose.model('FunFact', FunFactSchema);
