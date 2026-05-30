import mongoose from 'mongoose';

const TransportSchema = new mongoose.Schema(
  {
    author_id: { type: mongoose.Schema.Types.Mixed },  // Can be ObjectId or Number from legacy data
    title: { type: String, required: true },
    shoulder: String,
    slug: { type: String, required: true, unique: true },
    content: String,
    category: {
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
      slug: String,
    },
    car_type: String,
    car_person: Number,
    distance_km: Number,
    car_price: Number,
    train_price: Number,
    bus_price: Number,
    boat_price: Number,
    faqs: [
      {
        title: String,
        content: String,
      },
    ],
    pricing: {
      enable_extra_price: Boolean,
      extra_prices: mongoose.Schema.Types.Mixed,
      enable_service_fee: Boolean,
      service_fees: [
        {
          name: String,
          price: Number,
          unit: String,
          price_type: String,
        },
      ],
    },
    location: {
      address: String,
      country_id: Number,
      state_id: Number,
      city_id: Number,
      zip_code: String,
      coordinates: { lat: Number, lng: Number },
    },
    attribute_terms: [Number],
    galleries: [String],
    feature_img: String,
    seo: {
      enable_seo: Boolean,
      meta_title: String,
      meta_desc: String,
      meta_keyward: String,
      meta_img: String,
    },
    translations: {
      en: { title: String, shoulder: String, content: String },
      sa: { title: String, shoulder: String, content: String },
      bd: { title: String, shoulder: String, content: String },
    },
    status: { type: Number, default: 1 },
    view: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.models.Transport || mongoose.model('Transport', TransportSchema);
