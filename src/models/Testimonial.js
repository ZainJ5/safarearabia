import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    designation: String,
    image: String,
    comment: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    serial: { type: Number, default: 0 },
    status: { type: Number, default: 1 }, // 1=Active, 0=Inactive
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
