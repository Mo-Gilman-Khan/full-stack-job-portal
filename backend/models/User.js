import mongoose from 'mongoose';
import { getDbType } from '../config/db.js';
import { MockModel } from './mockModel.js';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['seeker', 'recruiter'], required: true },
  profile: {
    skills: [String],
    resumeUrl: String,
    resumeName: String,
    bio: String,
    experience: String,
    education: String,
    companyName: String
  }
}, { timestamps: true });

const MongoUser = mongoose.models.User || mongoose.model('User', userSchema);
const MockUser = new MockModel('users');

export const User = {
  find: (query) => getDbType() === 'mongodb' ? MongoUser.find(query) : MockUser.find(query),
  findOne: (query) => getDbType() === 'mongodb' ? MongoUser.findOne(query) : MockUser.findOne(query),
  findById: (id) => getDbType() === 'mongodb' ? MongoUser.findById(id) : MockUser.findById(id),
  create: (doc) => getDbType() === 'mongodb' ? MongoUser.create(doc) : MockUser.create(doc),
  findByIdAndUpdate: (id, update, options) => {
    if (getDbType() === 'mongodb') {
      return MongoUser.findByIdAndUpdate(id, update, { new: true, ...options });
    } else {
      return MockUser.findByIdAndUpdate(id, update, options);
    }
  },
  findByIdAndDelete: (id) => getDbType() === 'mongodb' ? MongoUser.findByIdAndDelete(id) : MockUser.findByIdAndDelete(id)
};
