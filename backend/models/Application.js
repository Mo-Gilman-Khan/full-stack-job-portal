import mongoose from 'mongoose';
import { getDbType } from '../config/db.js';
import { MockModel } from './mockModel.js';

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  seekerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resumeUrl: { type: String },
  resumeName: { type: String },
  coverLetter: { type: String },
  status: { type: String, enum: ['pending', 'shortlisted', 'accepted', 'rejected'], default: 'pending' }
}, { timestamps: true });

const MongoApplication = mongoose.models.Application || mongoose.model('Application', applicationSchema);
const MockApplication = new MockModel('applications');

export const Application = {
  find: (query) => getDbType() === 'mongodb' ? MongoApplication.find(query) : MockApplication.find(query),
  findOne: (query) => getDbType() === 'mongodb' ? MongoApplication.findOne(query) : MockApplication.findOne(query),
  findById: (id) => getDbType() === 'mongodb' ? MongoApplication.findById(id) : MockApplication.findById(id),
  create: (doc) => getDbType() === 'mongodb' ? MongoApplication.create(doc) : MockApplication.create(doc),
  findByIdAndUpdate: (id, update, options) => {
    if (getDbType() === 'mongodb') {
      return MongoApplication.findByIdAndUpdate(id, update, { new: true, ...options });
    } else {
      return MockApplication.findByIdAndUpdate(id, update, options);
    }
  },
  findByIdAndDelete: (id) => getDbType() === 'mongodb' ? MongoApplication.findByIdAndDelete(id) : MockApplication.findByIdAndDelete(id)
};
