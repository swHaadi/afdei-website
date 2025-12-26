import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// In-memory database
const database = {
  users: [
    { id: '1', name: 'Admin', email: 'admin@afdei.org', password: 'admin123', role: 'admin', isActive: true }
  ],
  content: {
    hero: {
      section: 'hero',
      contentEn: JSON.stringify({
        title: 'Arab Federation for Development and Economic Integration',
        subtitle: 'Enhancing development and economic integration in Arab countries',
        description: 'The Arab Federation for Development and Economic Integration operates under the Council of Arab Economic Unity, part of the League of Arab States, headquartered in Cairo, Egypt.'
      }),
      contentAr: JSON.stringify({
        title: 'الاتحاد العربي للتنمية والتكامل الاقتصادي',
        subtitle: 'تعزيز التنمية والتكامل الاقتصادي في الدول العربية',
        description: 'يعمل الاتحاد العربي للتنمية والتكامل الاقتصادي تحت مظلة مجلس الوحدة الاقتصادية العربية التابع لجامعة الدول العربية، ومقره في القاهرة، مصر.'
      })
    },
    about: {
      section: 'about',
      contentEn: JSON.stringify({
        title: 'About Us',
        vision: { title: 'Vision', content: 'To be the leading force in promoting sustainable economic development and integration across the Arab world.' },
        mission: { title: 'Mission', content: 'To strengthen economic ties between Arab nations and promote sustainable development.' },
        values: { title: 'Our Values', leadership: 'Leadership', empowerment: 'Empowerment', innovation: 'Innovation', sustainability: 'Sustainability' },
        president: { title: "President's Message", message: 'Welcome to the Arab Federation for Development and Economic Integration.' },
        objectives: { title: 'Our Objectives', list: ['Strengthen relationships between Arab economic bodies.', 'Assist the Arab private sector.', 'Propose projects for Arab economic integration.', 'Develop trade exchange between Arab countries.'] }
      }),
      contentAr: JSON.stringify({
        title: 'من نحن',
        vision: { title: 'الرؤية', content: 'أن نكون القوة الرائدة في تعزيز التنمية الاقتصادية المستدامة.' },
        mission: { title: 'الرسالة', content: 'تعزيز الروابط الاقتصادية بين الدول العربية.' },
        values: { title: 'قيمنا', leadership: 'القيادة', empowerment: 'التمكين', innovation: 'الابتكار', sustainability: 'الاستدامة' },
        president: { title: 'رسالة الرئيس', message: 'مرحباً بكم في الاتحاد العربي للتنمية والتكامل الاقتصادي.' },
        objectives: { title: 'أهدافنا', list: ['تعزيز العلاقات بين الهيئات الاقتصادية العربية.', 'مساعدة القطاع الخاص العربي.', 'اقتراح المشاريع للتكامل الاقتصادي العربي.', 'تطوير التبادل التجاري بين الدول العربية.'] }
      })
    },
    membership: {
      section: 'membership',
      contentEn: JSON.stringify({
        title: 'Membership', subtitle: 'Join Our Growing Network',
        description: 'Become a member of the Arab Federation for Development and Economic Integration.',
        benefits: ['Access to exclusive networking opportunities', 'Recognition as a leader', 'Participation in conferences', 'Business development opportunities'],
        buttonText: 'Join Us', memberCount: '500+', memberLabel: 'Active Members'
      }),
      contentAr: JSON.stringify({
        title: 'العضوية', subtitle: 'انضم إلى شبكتنا المتنامية',
        description: 'كن عضواً في الاتحاد العربي للتنمية والتكامل الاقتصادي.',
        benefits: ['الوصول إلى فرص التواصل', 'الاعتراف كقائد', 'المشاركة في المؤتمرات', 'فرص تطوير الأعمال'],
        buttonText: 'انضم إلينا', memberCount: '+500', memberLabel: 'عضو نشط'
      })
    },
    advisory: {
      section: 'advisory',
      contentEn: JSON.stringify({
        title: 'Advisory Bodies', subtitle: 'Our advisory bodies bring together experts.',
        bodies: [
          { title: 'Economic Development Committee', description: 'Strategic economic planning.', members: 12 },
          { title: 'Business Advisory Board', description: 'Private sector engagement.', members: 15 }
        ]
      }),
      contentAr: JSON.stringify({
        title: 'الهيئات الاستشارية', subtitle: 'تجمع هيئاتنا الاستشارية الخبراء.',
        bodies: [
          { title: 'لجنة التنمية الاقتصادية', description: 'التخطيط الاقتصادي.', members: 12 },
          { title: 'المجلس الاستشاري للأعمال', description: 'مشاركة القطاع الخاص.', members: 15 }
        ]
      })
    },
    contact: {
      section: 'contact',
      contentEn: JSON.stringify({
        title: 'Contact Us', getInTouch: 'Get in Touch', sendMessage: 'Send us a Message',
        address: '4 Dar Al-Salam Street – Cairo – Egypt', email: 'info@afdei.org',
        phone: '+20 2 2639 6296', workingHours: 'Sunday - Thursday: 9:00 AM - 5:00 PM'
      }),
      contentAr: JSON.stringify({
        title: 'اتصل بنا', getInTouch: 'تواصل معنا', sendMessage: 'أرسل لنا رسالة',
        address: '4 شارع دار السلام - القاهرة - مصر', email: 'info@afdei.org',
        phone: '+20 2 2639 6296', workingHours: 'الأحد - الخميس: 9:00 صباحاً - 5:00 مساءً'
      })
    }
  },
  events: [
    { id: '1', titleEn: 'Arab Economic Summit 2025', titleAr: 'القمة الاقتصادية العربية 2025',
      descriptionEn: 'Annual summit bringing together economic leaders.', descriptionAr: 'القمة السنوية التي تجمع القادة الاقتصاديين.',
      date: '2025-03-15', locationEn: 'Cairo, Egypt', locationAr: 'القاهرة، مصر',
      imageUrl: 'https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg?auto=compress&cs=tinysrgb&w=600',
      isFeatured: true, isActive: true }
  ],
  projects: [
    { id: '1', nameEn: 'E-Tajer Project', nameAr: 'مشروع إي تاجر',
      descriptionEn: 'A comprehensive Arab e-commerce platform.', descriptionAr: 'منصة تجارة إلكترونية عربية شاملة.',
      isFeatured: true, isActive: true }
  ]
};

const JWT_SECRET = process.env.JWT_SECRET || 'afdei-secret-2025';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

// Verify JWT
function verifyToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(authHeader.replace('Bearer ', ''), JWT_SECRET);
  } catch (e) {
    return null;
  }
}

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => res.setHeader(key, value));

  const { url, method } = req;
  const path = url.replace('/api', '');

  try {
    // AUTH ROUTES
    if (path === '/auth/login' && method === 'POST') {
      const { email, password } = req.body;
      const user = database.users.find(u => u.email === email);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    }

    if (path === '/auth/me' && method === 'GET') {
      const decoded = verifyToken(req.headers.authorization);
      if (!decoded) return res.status(401).json({ error: 'Unauthorized' });
      const user = database.users.find(u => u.id === decoded.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    }

    // CONTENT ROUTES
    if (path === '/content' && method === 'GET') {
      return res.json(Object.values(database.content));
    }

    if (path.startsWith('/content/') && method === 'GET') {
      const section = path.replace('/content/', '');
      const content = database.content[section];
      if (!content) return res.status(404).json({ error: 'Content not found' });
      return res.json(content);
    }

    if (path.startsWith('/content/') && method === 'PUT') {
      const decoded = verifyToken(req.headers.authorization);
      if (!decoded) return res.status(401).json({ error: 'Unauthorized' });
      const section = path.replace('/content/', '');
      const { contentEn, contentAr } = req.body;
      database.content[section] = {
        section,
        contentEn: typeof contentEn === 'string' ? contentEn : JSON.stringify(contentEn),
        contentAr: typeof contentAr === 'string' ? contentAr : JSON.stringify(contentAr)
      };
      return res.json(database.content[section]);
    }

    // EVENTS ROUTES
    if (path === '/events' && method === 'GET') {
      return res.json(database.events);
    }

    if (path === '/events' && method === 'POST') {
      const decoded = verifyToken(req.headers.authorization);
      if (!decoded) return res.status(401).json({ error: 'Unauthorized' });
      const event = { id: Date.now().toString(), ...req.body };
      database.events.push(event);
      return res.status(201).json(event);
    }

    // PROJECTS ROUTES
    if (path === '/projects' && method === 'GET') {
      return res.json(database.projects);
    }

    if (path === '/projects' && method === 'POST') {
      const decoded = verifyToken(req.headers.authorization);
      if (!decoded) return res.status(401).json({ error: 'Unauthorized' });
      const project = { id: Date.now().toString(), ...req.body };
      database.projects.push(project);
      return res.status(201).json(project);
    }

    // CONTACT ROUTES
    if (path === '/contact' && method === 'POST') {
      return res.status(201).json({ message: 'Message sent successfully' });
    }

    // Not found
    return res.status(404).json({ error: 'Not found' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
