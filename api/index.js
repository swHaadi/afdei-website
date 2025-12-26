import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();

// In-memory database for demo (persists during function lifecycle)
let database = {
  users: [
    {
      id: '1',
      name: 'Admin',
      email: 'admin@afdei.org',
      password: '$2a$10$rQnM1DkBvRxdH8CjQz1xPeqN8xqJLz5xP.1uVyP1Q2fLZ5K3X5K3C', // admin123
      role: 'admin',
      isActive: true
    }
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
        vision: { title: 'Vision', content: 'To be the leading force in promoting sustainable economic development and integration across the Arab world, fostering prosperity and unity among Arab nations through innovative initiatives and collaborative partnerships.' },
        mission: { title: 'Mission', content: 'To strengthen economic ties between Arab nations, promote sustainable development, facilitate the implementation of joint economic projects, and support the private sector in overcoming challenges to achieve comprehensive Arab economic integration.' },
        values: { title: 'Our Values', leadership: 'Leadership', empowerment: 'Empowerment', innovation: 'Innovation', sustainability: 'Sustainability' },
        president: { title: "President's Message", message: 'Welcome to the Arab Federation for Development and Economic Integration. Our commitment to fostering economic growth and development across the Arab world remains unwavering.' },
        objectives: { title: 'Our Objectives', list: [
          'Strengthen relationships between Arab economic bodies and the private sector.',
          'Assist the Arab private sector in finding solutions to challenges.',
          'Propose projects contributing to Arab economic integration.',
          'Contribute to the integration and development of the Arab private sector.',
          'Develop trade exchange between Arab countries.'
        ]}
      }),
      contentAr: JSON.stringify({
        title: 'من نحن',
        vision: { title: 'الرؤية', content: 'أن نكون القوة الرائدة في تعزيز التنمية الاقتصادية المستدامة والتكامل عبر العالم العربي.' },
        mission: { title: 'الرسالة', content: 'تعزيز الروابط الاقتصادية بين الدول العربية، وتعزيز التنمية المستدامة.' },
        values: { title: 'قيمنا', leadership: 'القيادة', empowerment: 'التمكين', innovation: 'الابتكار', sustainability: 'الاستدامة' },
        president: { title: 'رسالة الرئيس', message: 'مرحباً بكم في الاتحاد العربي للتنمية والتكامل الاقتصادي.' },
        objectives: { title: 'أهدافنا', list: [
          'تعزيز العلاقات بين الهيئات الاقتصادية العربية والقطاع الخاص.',
          'مساعدة القطاع الخاص العربي في إيجاد حلول للتحديات.',
          'اقتراح المشاريع المساهمة في التكامل الاقتصادي العربي.',
          'المساهمة في تكامل وتطوير القطاع الخاص العربي.',
          'تطوير التبادل التجاري بين الدول العربية.'
        ]}
      })
    },
    membership: {
      section: 'membership',
      contentEn: JSON.stringify({
        title: 'Membership',
        subtitle: 'Join Our Growing Network',
        description: 'Become a member of the Arab Federation for Development and Economic Integration.',
        benefits: [
          'Access to exclusive networking opportunities',
          'Recognition as a leader in Arab economic development',
          'Participation in regional and international conferences',
          'Business development and partnership opportunities'
        ],
        buttonText: 'Join Us',
        memberCount: '500+',
        memberLabel: 'Active Members'
      }),
      contentAr: JSON.stringify({
        title: 'العضوية',
        subtitle: 'انضم إلى شبكتنا المتنامية',
        description: 'كن عضواً في الاتحاد العربي للتنمية والتكامل الاقتصادي.',
        benefits: [
          'الوصول إلى فرص التواصل الحصرية',
          'الاعتراف كقائد في التنمية الاقتصادية العربية',
          'المشاركة في المؤتمرات والفعاليات',
          'فرص تطوير الأعمال والشراكة'
        ],
        buttonText: 'انضم إلينا',
        memberCount: '+500',
        memberLabel: 'عضو نشط'
      })
    },
    advisory: {
      section: 'advisory',
      contentEn: JSON.stringify({
        title: 'Advisory Bodies',
        subtitle: 'Our advisory bodies bring together experts and leaders.',
        bodies: [
          { title: 'Economic Development Committee', description: 'Strategic economic planning and development.', members: 12 },
          { title: 'Social Integration Council', description: 'Social policies and programs.', members: 10 },
          { title: 'Business Advisory Board', description: 'Private sector engagement and investment.', members: 15 },
          { title: 'International Relations Committee', description: 'International partnerships.', members: 8 }
        ]
      }),
      contentAr: JSON.stringify({
        title: 'الهيئات الاستشارية',
        subtitle: 'تجمع هيئاتنا الاستشارية الخبراء والقادة.',
        bodies: [
          { title: 'لجنة التنمية الاقتصادية', description: 'التخطيط الاقتصادي الاستراتيجي.', members: 12 },
          { title: 'مجلس التكامل الاجتماعي', description: 'السياسات والبرامج الاجتماعية.', members: 10 },
          { title: 'المجلس الاستشاري للأعمال', description: 'مشاركة القطاع الخاص والاستثمار.', members: 15 },
          { title: 'لجنة العلاقات الدولية', description: 'الشراكات الدولية.', members: 8 }
        ]
      })
    },
    contact: {
      section: 'contact',
      contentEn: JSON.stringify({
        title: 'Contact Us',
        getInTouch: 'Get in Touch',
        sendMessage: 'Send us a Message',
        address: '4 Dar Al-Salam Street – Cairo – Egypt',
        email: 'info@afdei.org',
        phone: '+20 2 2639 6296',
        workingHours: 'Sunday - Thursday: 9:00 AM - 5:00 PM'
      }),
      contentAr: JSON.stringify({
        title: 'اتصل بنا',
        getInTouch: 'تواصل معنا',
        sendMessage: 'أرسل لنا رسالة',
        address: '4 شارع دار السلام - القاهرة - مصر',
        email: 'info@afdei.org',
        phone: '+20 2 2639 6296',
        workingHours: 'الأحد - الخميس: 9:00 صباحاً - 5:00 مساءً'
      })
    }
  },
  events: [
    {
      id: '1',
      titleEn: 'Arab Economic Summit 2025',
      titleAr: 'القمة الاقتصادية العربية 2025',
      descriptionEn: 'Annual summit bringing together economic leaders from across the Arab world.',
      descriptionAr: 'القمة السنوية التي تجمع القادة الاقتصاديين من جميع أنحاء العالم العربي.',
      date: '2025-03-15',
      locationEn: 'Cairo, Egypt',
      locationAr: 'القاهرة، مصر',
      imageUrl: 'https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg?auto=compress&cs=tinysrgb&w=600',
      isFeatured: true,
      isActive: true
    }
  ],
  projects: [
    {
      id: '1',
      nameEn: 'E-Tajer Project',
      nameAr: 'مشروع إي تاجر',
      descriptionEn: 'A comprehensive Arab e-commerce platform designed to facilitate trade.',
      descriptionAr: 'منصة تجارة إلكترونية عربية شاملة مصممة لتسهيل التجارة.',
      isFeatured: true,
      isActive: true
    }
  ],
  contactSubmissions: []
};

const JWT_SECRET = process.env.JWT_SECRET || 'afdei-secret-2025';

// Middleware
app.use(cors());
app.use(express.json());

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = database.users.find(u => u.email === email);
  
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  
  // Check password (for demo, accept 'admin123')
  const isValid = password === 'admin123' || await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });
  
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = database.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

// Content routes
app.get('/api/content', (req, res) => {
  res.json(Object.values(database.content));
});

app.get('/api/content/:section', (req, res) => {
  const content = database.content[req.params.section];
  if (!content) return res.status(404).json({ error: 'Content not found' });
  res.json(content);
});

app.put('/api/content/:section', authMiddleware, (req, res) => {
  const { section } = req.params;
  const { contentEn, contentAr } = req.body;
  
  database.content[section] = {
    section,
    contentEn: typeof contentEn === 'string' ? contentEn : JSON.stringify(contentEn),
    contentAr: typeof contentAr === 'string' ? contentAr : JSON.stringify(contentAr)
  };
  
  res.json(database.content[section]);
});

// Events routes
app.get('/api/events', (req, res) => {
  res.json(database.events);
});

app.post('/api/events', authMiddleware, (req, res) => {
  const event = { id: Date.now().toString(), ...req.body };
  database.events.push(event);
  res.status(201).json(event);
});

app.put('/api/events/:id', authMiddleware, (req, res) => {
  const index = database.events.findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Event not found' });
  database.events[index] = { ...database.events[index], ...req.body };
  res.json(database.events[index]);
});

app.delete('/api/events/:id', authMiddleware, (req, res) => {
  database.events = database.events.filter(e => e.id !== req.params.id);
  res.json({ message: 'Deleted' });
});

// Projects routes
app.get('/api/projects', (req, res) => {
  res.json(database.projects);
});

app.post('/api/projects', authMiddleware, (req, res) => {
  const project = { id: Date.now().toString(), ...req.body };
  database.projects.push(project);
  res.status(201).json(project);
});

app.put('/api/projects/:id', authMiddleware, (req, res) => {
  const index = database.projects.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Project not found' });
  database.projects[index] = { ...database.projects[index], ...req.body };
  res.json(database.projects[index]);
});

app.delete('/api/projects/:id', authMiddleware, (req, res) => {
  database.projects = database.projects.filter(p => p.id !== req.params.id);
  res.json({ message: 'Deleted' });
});

// Contact routes
app.post('/api/contact', (req, res) => {
  const submission = { id: Date.now().toString(), ...req.body, createdAt: new Date().toISOString() };
  database.contactSubmissions.push(submission);
  res.status(201).json({ message: 'Message sent successfully' });
});

app.get('/api/contact', authMiddleware, (req, res) => {
  res.json(database.contactSubmissions);
});

export default app;

