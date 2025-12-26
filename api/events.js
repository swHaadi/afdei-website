const events = [
  { id: '1', titleEn: 'Arab Economic Summit 2025', titleAr: 'القمة الاقتصادية العربية 2025', descriptionEn: 'Annual summit for economic leaders.', descriptionAr: 'القمة السنوية للقادة الاقتصاديين.', date: '2025-03-15', locationEn: 'Cairo, Egypt', locationAr: 'القاهرة، مصر', imageUrl: 'https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg?auto=compress&cs=tinysrgb&w=600', isFeatured: true, isActive: true }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  return res.status(200).json(events);
}

