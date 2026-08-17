import { Schema, model } from 'mongoose';

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
  },
  {
    timestamps: true,
  }
);

NewsSchema.index({ createdAt: -1 });
NewsSchema.index({ category: 1, createdAt: -1 });

export const News = model('News', NewsSchema);
