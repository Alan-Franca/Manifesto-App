import app from '../server/src/index.js';
import { connectDB } from '../server/src/config/db.js';

export default async (req: any, res: any) => {
  await connectDB();
  return app(req, res);
};
