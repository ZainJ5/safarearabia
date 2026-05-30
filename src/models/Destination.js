import mongoose from 'mongoose';

const DestinationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: String,
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
    galleries: [String],
    translations: {
      en: { title: String, content: String },
      sa: { title: String, content: String },
      bd: { title: String, content: String },
    },
    seo: {
      enable_seo: Boolean,
      meta_title: String,
      meta_desc: String,
      meta_keyward: String,
      meta_img: String,
    },
    status: { type: Number, default: 1 },
    view: { type: Number, default: 0 },
    is_featured: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.models.Destination || mongoose.model('Destination', DestinationSchema);
