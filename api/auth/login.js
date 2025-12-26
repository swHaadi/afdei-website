import jwt from 'jsonwebtoken';

const JWT_SECRET = 'afdei-secret-2025';
const users = [{ id: '1', name: 'Admin', email: 'admin@afdei.org', password: 'admin123', role: 'admin' }];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body || {};
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  return res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}

