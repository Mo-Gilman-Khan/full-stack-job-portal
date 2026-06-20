import mongoose from 'mongoose';
import { getDbType } from '../config/db.js';
import { MockModel } from './mockModel.js';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: [String], default: [] },
  location: { type: String, required: true },
  salaryRange: { type: String, required: true },
  jobType: { type: String, required: true },
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const MongoJob = mongoose.models.Job || mongoose.model('Job', jobSchema);
const MockJob = new MockModel('jobs');

export const Job = {
  find: (query) => getDbType() === 'mongodb' ? MongoJob.find(query) : MockJob.find(query),
  findOne: (query) => getDbType() === 'mongodb' ? MongoJob.findOne(query) : MockJob.findOne(query),
  findById: (id) => getDbType() === 'mongodb' ? MongoJob.findById(id) : MockJob.findById(id),
  create: (doc) => getDbType() === 'mongodb' ? MongoJob.create(doc) : MockJob.create(doc),
  findByIdAndUpdate: (id, update, options) => {
    if (getDbType() === 'mongodb') {
      return MongoJob.findByIdAndUpdate(id, update, { new: true, ...options });
    } else {
      return MockJob.findByIdAndUpdate(id, update, options);
    }
  },
  findByIdAndDelete: (id) => getDbType() === 'mongodb' ? MongoJob.findByIdAndDelete(id) : MockJob.findByIdAndDelete(id)
};
