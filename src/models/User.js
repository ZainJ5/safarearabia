import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    custom_id: { type: String, default: null },
    provider: { type: String, default: null }, 
    provider_id: { type: String, default: null },
    refresh_token: { type: String, default: null },
    access_token: { type: String, default: null },
    fname: { type: String, required: true },
    lname: { type: String, default: '' },
    username: { type: String, default: null, index: false }, // sparse unique applied below
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email_verified_at: { type: Date, default: null },
    verify_token: { type: String, default: null },
    password: { type: String, default: null }, 
    phone: { type: String, default: null },
    address: { type: String, default: null },
    country_id: { type: Number, default: null },
    state_id: { type: Number, default: null },
    city_id: { type: Number, default: null },
    zip_code: { type: String, default: null },
    image: { type: String, default: null },
    role: {
      type: Number,
      required: true,
      default: 3,
      enum: [1, 2, 3], // 1=Admin, 2=Merchant, 3=Customer
    },
    status: {
      type: Number,
      required: true,
      default: 1,
      enum: [1, 2], // 1=Active, 2=Inactive
    },
    admin_commission: { type: Number, default: null },
    wallet_balance: { type: Number, default: 0 },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpire: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Virtual for full name
UserSchema.virtual('full_name').get(function () {
  return `${this.fname} ${this.lname}`.trim();
});

// Ensure virtuals are included in JSON
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

// Username sparse+unique: allows multiple null values but enforces uniqueness when set
UserSchema.index({ username: 1 }, { unique: true, sparse: true });

// Agent/merchant code (e.g. MC0359) must be unique. Partial on string type so the
// many null custom_ids (customers) are exempt — only real MC codes are constrained.
UserSchema.index({ custom_id: 1 }, { unique: true, partialFilterExpression: { custom_id: { $type: 'string' } } });

export default mongoose.models.User || mongoose.model('User', UserSchema);
