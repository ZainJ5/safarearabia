import mongoose from 'mongoose';

const HotelInvoiceSchema = new mongoose.Schema({
  reserve_no:    { type: Number },
  agent_user_id: { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'User' },
  // Guest / agent info
  agent_name:  { type: String, default: '' },
  nationality: { type: String, default: '' },
  guest_name:  { type: String, default: '' },
  option_date: { type: String, default: '' },
  client_ref_no: { type: String, default: '' },
  vat_number:  { type: String, default: '' },
  contact_name:{ type: String, default: '' },
  group_no:    { type: String, default: '' },
  mobile_no:   { type: String, default: '' },
  local_refno: { type: String, default: '' },
  // Hotel details
  hotel_name:  { type: String, default: '' },
  city:        { type: String, default: '' },
  room_type:   { type: String, default: '' },
  check_in:    { type: String, default: '' },
  check_out:   { type: String, default: '' },
  no_of_nights:   { type: Number, default: 0 },
  no_of_rooms:    { type: Number, default: 1 },
  no_of_adults:   { type: Number, default: 1 },
  no_of_children: { type: Number, default: 0 },
  packs: { type: String, default: '' },
  meals: { type: String, default: '' },
  day_rate:   { type: Number, default: 0 },
  ml_srate:   { type: Number, default: 0 },
  room_amount:    { type: Number, default: 0 },
  conformation_no:{ type: String, default: '' },
  total_amount:   { type: Number, default: 0 },
  sub_amount:     { type: Number, default: 0 },
  // Bank details
  account_name:    { type: String, default: 'Safar e Arabian Travel & tours' },
  bank:            { type: String, default: 'Faisal Bank' },
  bank_account_no: { type: String, default: '3054301000007374' },
  bank_address:    { type: String, default: '' },
  ibn:             { type: String, default: 'PK65FAYS3054301000007374' },
  // Policies
  important_contact:    { type: String, default: '' },
  cancellation_policy:  { type: String, default: 'No-Cancellation or Amendment will be accepted after re-confirmation' },
  no_show_policy:       { type: String, default: 'In-case of No-Show full invoice amount will be charged' },
  status: { type: Number, default: 1 },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default mongoose.models.HotelInvoice || mongoose.model('HotelInvoice', HotelInvoiceSchema);
