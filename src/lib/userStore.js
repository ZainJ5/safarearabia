import mongoose from 'mongoose';
import User from '@/models/User';

/*
 * The users collection stores _id as plain 24-hex STRINGS (legacy import), not
 * BSON ObjectIds. Mongoose's schema casting always coerces a query _id to an
 * ObjectId, so User.findById / findByIdAndUpdate silently miss those documents.
 * These helpers go through the raw driver and try every plausible representation
 * of the id (the value as-is, its string form, and an ObjectId cast) so they work
 * whether an id arrives as a string, a BSON ObjectId, or an ObjectId stamped on an
 * invoice — and whether the user doc itself uses a string or ObjectId _id.
 */
function idCandidates(id) {
  if (id === null || id === undefined || id === '') return [];
  const out = [id];
  const s = String(id);
  if (s !== id) out.push(s);                                   // BSON ObjectId → "hex" string
  if (typeof id === 'string' && mongoose.Types.ObjectId.isValid(id)) {
    out.push(new mongoose.Types.ObjectId(id));                 // "hex" string → ObjectId
  }
  return out;
}

/** Find a user by id regardless of how its _id is stored. */
export async function findUserAny(id) {
  const col = User.collection;
  for (const c of idCandidates(id)) {
    const doc = await col.findOne({ _id: c });
    if (doc) return doc;
  }
  return null;
}

/** Atomically add `amount` (may be negative) to a user's wallet_balance. */
export async function incWallet(id, amount) {
  const amt = Number(amount) || 0;
  if (!amt) return false;
  const col = User.collection;
  for (const c of idCandidates(id)) {
    const r = await col.updateOne({ _id: c }, { $inc: { wallet_balance: amt } });
    if (r.matchedCount > 0) return true;
  }
  return false;
}
