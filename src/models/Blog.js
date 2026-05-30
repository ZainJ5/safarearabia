import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    image: String,
    category: {
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
      slug: String,
    },
    tags: [String],
    seo: {
      meta_title: String,
      meta_keyward: String,
      meta_description: String,
    },
    translations: {
      en: { title: String, description: String },
      sa: { title: String, description: String },
      bd: { title: String, description: String },
    },
    comments: [
      {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        parent_id: { type: mongoose.Schema.Types.ObjectId },
        comment: String,
        status: { type: Number, default: 1 },
        created_at: { type: Date, default: Date.now },
      },
    ],
    enable_seo: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
