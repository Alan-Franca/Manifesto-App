import { Schema, model } from 'mongoose';
import { parseNewsDate } from '../utils/dateParser.js';

const NewsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    readTime: {
      type: String,
      default: '5 min',
    },
    date: {
      type: String,
      required: true,
    },
    publishedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

NewsSchema.pre('validate', function (next) {
  if (this.isModified('date') || !this.publishedAt) {
    const timestamp = parseNewsDate(this.date);
    this.publishedAt = timestamp ? new Date(timestamp) : new Date();
  }
  next();
});

NewsSchema.index({ publishedAt: -1, _id: -1 });
NewsSchema.index({ category: 1, publishedAt: -1, _id: -1 });
NewsSchema.index(
  { title: 'text', summary: 'text', content: 'text' },
  { weights: { title: 10, summary: 5, content: 1 }, default_language: 'portuguese' }
);

export const News = model('News', NewsSchema);
