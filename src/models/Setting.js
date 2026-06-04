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

export default mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
