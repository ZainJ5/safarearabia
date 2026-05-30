import mongoose from 'mongoose';

const VisaSchema = new mongoose.Schema(
  {
    author_id: { type: mongoose.Schema.Types.Mixed },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
    },
    maximum_stay: String,
    processing: String,
    validity: String,
    visa_mode: String,
    cost: Number,
    cost_summary: String,
    country: String,
    country_id: Number,
    agent_setting: String,
    allow_seo: { type: Boolean, default: false },
    banner_img: String,
    features_image: String,
    faqs: [{ title: String, content: String }],
    includes: [{ title: String }],
    required_documents: [{ title: String }],
    seo: {
      enable_seo: Boolean,
      meta_title: String,
      meta_desc: String,
      meta_keyward: String,
      meta_img: String,
    },
    translations: {
      en: { title: String, includes: mongoose.Schema.Types.Mixed, faqs: mongoose.Schema.Types.Mixed },
      sa: { title: String, includes: mongoose.Schema.Types.Mixed, faqs: mongoose.Schema.Types.Mixed },
      bd: { title: String, includes: mongoose.Schema.Types.Mixed, faqs: mongoose.Schema.Types.Mixed },
    },
    status: { type: Number, default: 1 },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.models.Visa || mongoose.model('Visa', VisaSchema);
