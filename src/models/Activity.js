import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema(
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
    youtube_video: String,
    youtube_thumbnail: String,
    duration_days: Number,
    duration_nights: Number,
    min_people: Number,
    max_people: Number,
    min_advance_reservations: Number,
    cancellation: Number,
    faqs: [
      {
        title: String,
        content: String,
      },
    ],
    includes: [{ title: String }],
    excludes: [{ title: String }],
    highlights: [{ title: String }],
    itinerary: [
      {
        title: String,
        content: String,
      },
    ],
    facilities: [String],
    travel_styles: [String],
    pricing: {
      price: Number,
      sale_price: Number,
      child_price: Number,
      enable_person_types: Boolean,
      person_types: mongoose.Schema.Types.Mixed,
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
    scheduling: {
      enable_fixed_dates: Boolean,
      fixed_dates: [
        { start_date: Date, end_date: Date, booking_date: Date },
      ],
      enable_open_hours: Boolean,
      open_hours: mongoose.Schema.Types.Mixed,
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
    is_featured: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);
