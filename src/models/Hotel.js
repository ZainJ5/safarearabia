import mongoose from 'mongoose';

const HotelSchema = new mongoose.Schema(
  {
    author_id: { type: mongoose.Schema.Types.Mixed },  // Can be ObjectId or Number from legacy data
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: String,
    youtube_video: String,
    youtube_thumbnail: String,
    category: {
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
      slug: String,
    },
    agent_setting: String,
    policies: [
      {
        title: String,
        content: String,
      },
    ],
    check_in: String,
    check_out: String,
    room_type: String,
    bed_type: String,
    guest_capability: Number,
    cancellation: String,
    min_advance_reservations: Number,
    min_stay: Number,
    breakfast: Boolean,
    price: Number,
    enable_service_fee: Boolean,
    service_fees: [
      {
        name: String,
        price: Number,
        unit: String,
        price_type: String,
      },
    ],
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
    attribute_facilities: [String],
    attribute_hotel_service: [String],
    attribute_property_type: [String],
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
      en: { title: String, content: String, policies: mongoose.Schema.Types.Mixed },
      sa: { title: String, content: String, policies: mongoose.Schema.Types.Mixed },
      bd: { title: String, content: String, policies: mongoose.Schema.Types.Mixed },
    },
    status: { type: Number, default: 1 },
    view: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.models.Hotel || mongoose.model('Hotel', HotelSchema);
