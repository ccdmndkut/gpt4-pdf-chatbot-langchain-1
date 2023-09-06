import { pinecone } from '@/utils/pinecone-client';

const index = pinecone.Index('gpt');
const indexStats = await index.describeIndexStats({
  describeIndexStatsRequest: {
    filter: {},
  },
});
let namespaces = Object.keys(indexStats.namespaces)
  .filter((n) => n.length > 0)
  .sort();
export default function handler(req, res) {
  res.status(200).json(namespaces);
}
