import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

SettingSchema.index({ type: 1 }, { unique: true });

export default mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
