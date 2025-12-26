import jwt from 'jsonwebtoken';

const JWT_SECRET = 'afdei-secret-2025';

// Simple in-memory data
const data = {
  users: [{ id: '1', name: 'Admin', email: 'admin@afdei.org', password: 'admin123', role: 'admin' }],
  content: {
    hero: { section: 'hero', contentEn: '{"title":"Arab Federation for Development and Economic Integration","subtitle":"Enhancing development and economic integration in Arab countries","description":"The Arab Federation operates under the Council of Arab Economic Unity."}', contentAr: '{"title":"الاتحاد العربي للتنمية والتكامل الاقتصادي","subtitle":"تعزيز التنمية والتكامل الاقتصادي في الدول العربية","description":"يعمل الاتحاد العربي تحت مظلة مجلس الوحدة الاقتصادية العربية."}' },
    about: { section: 'about', contentEn: '{"title":"About Us","vision":{"title":"Vision","content":"To be the leading force in promoting sustainable economic development."},"mission":{"title":"Mission","content":"To strengthen economic ties between Arab nations."},"values":{"title":"Our Values","leadership":"Leadership","empowerment":"Empowerment","innovation":"Innovation","sustainability":"Sustainability"},"president":{"title":"President Message","message":"Welcome to AFDEI."},"objectives":{"title":"Our Objectives","list":["Strengthen relationships","Assist private sector","Propose projects","Develop trade"]}}', contentAr: '{"title":"من نحن","vision":{"title":"الرؤية","content":"أن نكون القوة الرائدة."},"mission":{"title":"الرسالة","content":"تعزيز الروابط الاقتصادية."},"values":{"title":"قيمنا","leadership":"القيادة","empowerment":"التمكين","innovation":"الابتكار","sustainability":"الاستدامة"},"president":{"title":"رسالة الرئيس","message":"مرحباً بكم."},"objectives":{"title":"أهدافنا","list":["تعزيز العلاقات","مساعدة القطاع الخاص","اقتراح المشاريع","تطوير التبادل التجاري"]}}' },
    membership: { section: 'membership', contentEn: '{"title":"Membership","subtitle":"Join Our Network","description":"Become a member.","benefits":["Networking","Recognition","Conferences","Partnerships"],"buttonText":"Join Us","memberCount":"500+","memberLabel":"Active Members"}', contentAr: '{"title":"العضوية","subtitle":"انضم إلى شبكتنا","description":"كن عضواً.","benefits":["التواصل","الاعتراف","المؤتمرات","الشراكات"],"buttonText":"انضم إلينا","memberCount":"+500","memberLabel":"عضو نشط"}' },
    advisory: { section: 'advisory', contentEn: '{"title":"Advisory Bodies","subtitle":"Our advisory bodies.","bodies":[{"title":"Economic Committee","description":"Strategic planning.","members":12},{"title":"Business Board","description":"Private sector.","members":15}]}', contentAr: '{"title":"الهيئات الاستشارية","subtitle":"هيئاتنا الاستشارية.","bodies":[{"title":"لجنة التنمية","description":"التخطيط الاستراتيجي.","members":12},{"title":"مجلس الأعمال","description":"القطاع الخاص.","members":15}]}' },
    contact: { section: 'contact', contentEn: '{"title":"Contact Us","getInTouch":"Get in Touch","sendMessage":"Send Message","address":"Cairo, Egypt","email":"info@afdei.org","phone":"+20 2 2639 6296","workingHours":"Sun-Thu: 9AM-5PM"}', contentAr: '{"title":"اتصل بنا","getInTouch":"تواصل معنا","sendMessage":"أرسل رسالة","address":"القاهرة، مصر","email":"info@afdei.org","phone":"+20 2 2639 6296","workingHours":"الأحد-الخميس: 9ص-5م"}' }
  },
  events: [{ id: '1', titleEn: 'Arab Economic Summit 2025', titleAr: 'القمة الاقتصادية العربية 2025', descriptionEn: 'Annual summit for economic leaders.', descriptionAr: 'القمة السنوية للقادة الاقتصاديين.', date: '2025-03-15', locationEn: 'Cairo, Egypt', locationAr: 'القاهرة، مصر', imageUrl: 'https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg?auto=compress&cs=tinysrgb&w=600', isFeatured: true, isActive: true }],
  projects: [{ id: '1', nameEn: 'E-Tajer Project', nameAr: 'مشروع إي تاجر', descriptionEn: 'Arab e-commerce platform.', descriptionAr: 'منصة تجارة إلكترونية عربية.', isFeatured: true, isActive: true }]
};

export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const path = req.url.replace('/api', '');
  const method = req.method;

  try {
    // LOGIN
    if (path === '/auth/login' && method === 'POST') {
      const { email, password } = req.body || {};
      const user = data.users.find(u => u.email === email && u.password === password);
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    }

    // GET CURRENT USER
    if (path === '/auth/me' && method === 'GET') {
      const auth = req.headers.authorization;
      if (!auth) return res.status(401).json({ error: 'No token' });
      try {
        const decoded = jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET);
        const user = data.users.find(u => u.id === decoded.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        return res.status(200).json({ id: user.id, name: user.name, email: user.email, role: user.role });
      } catch (e) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    }

    // GET ALL CONTENT
    if (path === '/content' && method === 'GET') {
      return res.status(200).json(Object.values(data.content));
    }

    // GET CONTENT BY SECTION
    if (path.startsWith('/content/') && method === 'GET') {
      const section = path.replace('/content/', '');
      const content = data.content[section];
      if (!content) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(content);
    }

    // GET EVENTS
    if (path === '/events' && method === 'GET') {
      return res.status(200).json(data.events);
    }

    // GET PROJECTS
    if (path === '/projects' && method === 'GET') {
      return res.status(200).json(data.projects);
    }

    // CONTACT FORM
    if (path === '/contact' && method === 'POST') {
      return res.status(201).json({ message: 'Message sent successfully' });
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
