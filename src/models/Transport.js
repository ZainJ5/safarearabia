import mongoose from 'mongoose';

const TransportSchema = new mongoose.Schema(
  {
    author_id: { type: mongoose.Schema.Types.Mixed },
    title: { type: String, required: true },
    shoulder: String,
    slug: { type: String, required: true, unique: true },
    content: String,
    youtube_url: String,
    category: {
      _id: mongoose.Schema.Types.Mixed,
      name: String,
      slug: String,
    },
    agent_setting: String,
    destination_name: String,

    // Legacy flat price fields (kept for backward compat)
    car_type: String,
    car_person: Number,
    distance_km: Number,
    car_price: Number,
    train_price: Number,
    bus_price: Number,
    boat_price: Number,

    // Tab-based pricing
    pricing_car: {
      vehicle_type: String,
      person: Number,
      price: Number,
      sale_price: Number,
      enable_extra_service: { type: Boolean, default: false },
    },
    pricing_bus: {
      adult_price: Number,
      adult_sale_price: Number,
      child_price: Number,
      enable_extra_service: { type: Boolean, default: false },
    },
    pricing_train: {
      adult_price: Number,
      adult_sale_price: Number,
      child_price: Number,
      enable_extra_service: { type: Boolean, default: false },
    },
    pricing_boat: {
      adult_price: Number,
      adult_sale_price: Number,
      child_price: Number,
      enable_extra_service: { type: Boolean, default: false },
    },

    min_advance_reservation: Number,
    min_day_stay: Number,

    faqs: [{ title: String, content: String }],
    includes: [{ title: String }],
    excludes: [{ title: String }],

    attribute_features: [String],
    attribute_type: [String],
    attribute_terms: [Number],

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
      country: String,
      state: String,
      city: String,
      country_id: Number,
      state_id: Number,
      city_id: Number,
      zip_code: String,
      coordinates: { lat: Number, lng: Number },
    },

    galleries: [String],
    feature_img: String,

    seo: {
      enable_seo: Boolean,
      meta_title: String,
      meta_desc: String,
      meta_keyword: String,
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
