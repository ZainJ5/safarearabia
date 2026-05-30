import dbConnect from '@/lib/dbConnect';
import Setting from '@/models/Setting';

/**
 * Get a single setting value by key
 * @param {string} key - The setting type/key
 * @param {*} defaultValue - Default if not found
 * @returns {*} The setting value
 */
export async function getSetting(key, defaultValue = null) {
  try {
    await dbConnect();
    const setting = await Setting.findOne({ type: key }).lean();
    return setting?.value ?? defaultValue;
  } catch (error) {
    console.error(`Error fetching setting "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Get multiple settings at once
 * @param {string[]} keys - Array of setting keys
 * @returns {Object} Key-value pairs of settings
 */
export async function getSettings(keys) {
  try {
    await dbConnect();
    const settings = await Setting.find({ type: { $in: keys } }).lean();
    const result = {};
    for (const key of keys) {
      const setting = settings.find((s) => s.type === key);
      result[key] = setting?.value ?? null;
    }
    return result;
  } catch (error) {
    console.error('Error fetching settings:', error);
    const result = {};
    for (const key of keys) {
      result[key] = null;
    }
    return result;
  }
}

/**
 * Get all settings as a flat object
 * @returns {Object} All settings as key-value pairs
 */
export async function getAllSettings() {
  try {
    await dbConnect();
    const settings = await Setting.find({}).lean();
    const result = {};
    for (const setting of settings) {
      result[setting.type] = setting.value;
    }
    return result;
  } catch (error) {
    console.error('Error fetching all settings:', error);
    return {};
  }
}

/**
 * Hardcoded fallback settings (used when DB is not yet seeded)
 * Re-exported from client-safe module for backward compatibility
 */
export { defaultSettings } from './defaultSettings';

