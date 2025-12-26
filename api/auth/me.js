import jwt from 'jsonwebtoken';

const JWT_SECRET = 'afdei-secret-2025';
const users = [{ id: '1', name: 'Admin', email: 'admin@afdei.org', password: 'admin123', role: 'admin' }];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET);
    const user = users.find(u => u.id === decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

