import { connectDB } from '../config/db.js';
import { News } from '../models/News.js';
import { User } from '../models/User.js';
import { parseNewsDate } from '../utils/dateParser.js';

async function run() {
  await connectDB();

  const cursor = News.find({
    $or: [{ publishedAt: { $exists: false } }, { publishedAt: null }],
  }).select('_id date createdAt').lean().cursor();

  let migrated = 0;
  for await (const article of cursor) {
    const timestamp = parseNewsDate(article.date);
    const publishedAt = timestamp ? new Date(timestamp) : article.createdAt || new Date();
    await News.updateOne({ _id: article._id }, { $set: { publishedAt } });
    migrated += 1;
  }

  await Promise.all([News.syncIndexes(), User.syncIndexes()]);
  console.log(`Migração concluída: ${migrated} notícia(s) atualizada(s) e índices sincronizados.`);
  process.exit(0);
}

run().catch(error => {
  console.error('Falha ao migrar notícias:', error);
  process.exit(1);
});
