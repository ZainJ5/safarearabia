import mongoose from 'mongoose';

const SliderSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: String,
    description: String,
    image: { type: String, required: true },
    btn_text: { type: String, default: 'View Packages' },
    btn_link: { type: String, default: '/tours' },
    serial: { type: Number, default: 0 },
    status: { type: Number, default: 1 }, // 1=Active, 0=Inactive
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.models.Slider || mongoose.model('Slider', SliderSchema);
