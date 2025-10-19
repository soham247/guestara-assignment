import mongoose from 'mongoose';

// Check if a string is a valid mongoDB ObjectId
export const isObjectId = (val) => mongoose.Types.ObjectId.isValid(val);
