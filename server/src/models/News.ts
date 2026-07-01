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
    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const News = model('News', NewsSchema);
