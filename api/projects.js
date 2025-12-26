const projects = [
  { id: '1', nameEn: 'E-Tajer Project', nameAr: 'مشروع إي تاجر', descriptionEn: 'Arab e-commerce platform.', descriptionAr: 'منصة تجارة إلكترونية عربية.', isFeatured: true, isActive: true }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  return res.status(200).json(projects);
}

