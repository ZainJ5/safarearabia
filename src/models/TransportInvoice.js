import mongoose from 'mongoose';

const TransportSegmentSchema = new mongoose.Schema({
  date:          { type: String, default: '' },
  time:          { type: String, default: '' },
  from_location: { type: String, default: '' },
  to_location:   { type: String, default: '' },
  vehicle:       { type: String, default: '' },
  mov_type:      { type: String, default: '' },
  qty:           { type: Number, default: 1 },
  no_of_adults:  { type: Number, default: 0 },
  packs:         { type: String, default: '' },
  rate:          { type: Number, default: 0 },
  total:         { type: Number, default: 0 },
}, { _id: false });

const TransportInvoiceSchema = new mongoose.Schema({
  invoice_no:             { type: Number },
  legacy_invoice_id:      { type: Number, default: null }, // legacy MySQL invoices.id (traceability)
  agent_user_id:          { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'User' },
  // Employee who generated the invoice (logged-in staff member)
  employee_user_id:       { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'User' },
  employee_name:          { type: String, default: '' },
  employee_phone:         { type: String, default: '' },
  reservation_no:         { type: String, default: '' },
  // Guest / agent info
  agent_name:             { type: String, default: '' },
  agent_no:               { type: String, default: '' },
  agent_phone:            { type: String, default: '' },
  nationality:            { type: String, default: '' },
  guest_name:             { type: String, default: '' },
  contact_name:           { type: String, default: '' },
  contact_number:         { type: String, default: '' },
  client_ref_no:          { type: String, default: '' },
  group_no:               { type: String, default: '' },
  local_refno:            { type: String, default: '' },
  reservation_date:       { type: String, default: '' },
  username:               { type: String, default: '' },
  payment_type:           { type: String, default: '' },
  // Transport details
  date:                   { type: String, default: '' },
  time:                   { type: String, default: '' },
  from_location:          { type: String, default: '' },
  to_location:            { type: String, default: '' },
  vehicle:                { type: String, default: '' },
  mov_type:               { type: String, default: '' },
  qty:                    { type: Number, default: 1 },
  no_of_adults:           { type: Number, default: 0 },
  packs:                  { type: String, default: '' },
  rate:                   { type: Number, default: 0 },
  total:                  { type: Number, default: 0 },
  // All transport segments for this invoice (one invoice can have many movements)
  items:                  { type: [TransportSegmentSchema], default: [] },
  // Financial summary
  transport:              { type: Number, default: 0 },
  discount:               { type: Number, default: 0 },
  vat:                    { type: Number, default: 0 },
  net_total_with_tax:     { type: Number, default: 0 },
  convert_rate_total_sar: { type: Number, default: 0 },
  special_requirements:   { type: String, default: '' },
  notes:                  { type: String, default: '' },
  // Bank details
  account_name:           { type: String, default: 'Safar E Arabian Travel & Tours' },
  bank:                   { type: String, default: 'Faisal Bank' },
  bank_account_no:        { type: String, default: '3054301000007374' },
  bank_address:           { type: String, default: '' },
  ibn:                    { type: String, default: 'PK65FAYS3054301000007374' },
  important_contact:      { type: String, default: '' },
  cancellation_policy:    { type: String, default: 'No-Cancellation or Amendment will be accepted after re-confirmation' },
  no_show_policy:         { type: String, default: 'In-case of No-Show full transport amount will be charged' },
  status:                 { type: Number, default: 1 }, // 1=Processing 2=Completed 3=Cancelled
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default mongoose.models.TransportInvoice || mongoose.model('TransportInvoice', TransportInvoiceSchema);
