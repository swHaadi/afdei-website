const content = {
  hero: { 
    content: {
      en: { title: 'Arab Federation for Development and Economic Integration', subtitle: 'Enhancing development and economic integration in Arab countries', description: 'The Arab Federation operates under the Council of Arab Economic Unity, part of the League of Arab States, headquartered in Cairo, Egypt.' },
      ar: { title: 'الاتحاد العربي للتنمية والتكامل الاقتصادي', subtitle: 'تعزيز التنمية والتكامل الاقتصادي في الدول العربية', description: 'يعمل الاتحاد العربي تحت مظلة مجلس الوحدة الاقتصادية العربية التابع لجامعة الدول العربية، ومقره في القاهرة، مصر.' }
    }
  },
  about: { 
    content: {
      en: { title: 'About Us', vision: { title: 'Vision', content: 'To be the leading force in promoting sustainable economic development and integration across the Arab world.' }, mission: { title: 'Mission', content: 'To strengthen economic ties between Arab nations and promote sustainable development.' }, values: { title: 'Our Values', leadership: 'Leadership', empowerment: 'Empowerment', innovation: 'Innovation', sustainability: 'Sustainability' }, president: { title: "President's Message", message: 'Welcome to the Arab Federation for Development and Economic Integration.' }, objectives: { title: 'Our Objectives', list: ['Strengthen relationships between Arab economic bodies.', 'Assist the Arab private sector.', 'Propose projects for Arab economic integration.', 'Develop trade exchange between Arab countries.'] } },
      ar: { title: 'من نحن', vision: { title: 'الرؤية', content: 'أن نكون القوة الرائدة في تعزيز التنمية الاقتصادية المستدامة.' }, mission: { title: 'الرسالة', content: 'تعزيز الروابط الاقتصادية بين الدول العربية.' }, values: { title: 'قيمنا', leadership: 'القيادة', empowerment: 'التمكين', innovation: 'الابتكار', sustainability: 'الاستدامة' }, president: { title: 'رسالة الرئيس', message: 'مرحباً بكم في الاتحاد العربي للتنمية والتكامل الاقتصادي.' }, objectives: { title: 'أهدافنا', list: ['تعزيز العلاقات بين الهيئات الاقتصادية العربية.', 'مساعدة القطاع الخاص العربي.', 'اقتراح المشاريع للتكامل الاقتصادي العربي.', 'تطوير التبادل التجاري بين الدول العربية.'] } }
    }
  },
  membership: { 
    content: {
      en: { title: 'Membership', subtitle: 'Join Our Growing Network', description: 'Become a member of the Arab Federation for Development and Economic Integration.', benefits: ['Access to exclusive networking opportunities', 'Recognition as a leader in Arab economic development', 'Participation in regional and international conferences', 'Business development and partnership opportunities'], buttonText: 'Join Us', memberCount: '500+', memberLabel: 'Active Members' },
      ar: { title: 'العضوية', subtitle: 'انضم إلى شبكتنا المتنامية', description: 'كن عضواً في الاتحاد العربي للتنمية والتكامل الاقتصادي.', benefits: ['الوصول إلى فرص التواصل الحصرية', 'الاعتراف كقائد في التنمية الاقتصادية العربية', 'المشاركة في المؤتمرات والفعاليات', 'فرص تطوير الأعمال والشراكة'], buttonText: 'انضم إلينا', memberCount: '+500', memberLabel: 'عضو نشط' }
    }
  },
  advisory: { 
    content: {
      en: { title: 'Advisory Bodies', subtitle: 'Our advisory bodies bring together experts and leaders from various sectors.', bodies: [{ title: 'Economic Development Committee', description: 'Focuses on strategic economic planning and development initiatives.', members: 12 }, { title: 'Social Integration Council', description: 'Works on social policies and programs.', members: 10 }, { title: 'Business Advisory Board', description: 'Provides guidance on private sector engagement.', members: 15 }, { title: 'International Relations Committee', description: 'Manages international partnerships.', members: 8 }] },
      ar: { title: 'الهيئات الاستشارية', subtitle: 'تجمع هيئاتنا الاستشارية الخبراء والقادة من مختلف القطاعات.', bodies: [{ title: 'لجنة التنمية الاقتصادية', description: 'تركز على التخطيط الاقتصادي الاستراتيجي.', members: 12 }, { title: 'مجلس التكامل الاجتماعي', description: 'يعمل على السياسات والبرامج الاجتماعية.', members: 10 }, { title: 'المجلس الاستشاري للأعمال', description: 'يوفر التوجيه بشأن مشاركة القطاع الخاص.', members: 15 }, { title: 'لجنة العلاقات الدولية', description: 'تدير الشراكات الدولية.', members: 8 }] }
    }
  },
  contact: { 
    content: {
      en: { title: 'Contact Us', getInTouch: 'Get in Touch', sendMessage: 'Send us a Message', address: '4 Dar Al-Salam Street – Cairo – Egypt', email: 'info@afdei.org', phone: '+20 2 2639 6296', workingHours: 'Sunday - Thursday: 9:00 AM - 5:00 PM' },
      ar: { title: 'اتصل بنا', getInTouch: 'تواصل معنا', sendMessage: 'أرسل لنا رسالة', address: '4 شارع دار السلام - القاهرة - مصر', email: 'info@afdei.org', phone: '+20 2 2639 6296', workingHours: 'الأحد - الخميس: 9:00 صباحاً - 5:00 مساءً' }
    }
  }
};

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const { section } = req.query;
  const data = content[section];
  
  if (!data) return res.status(404).json({ error: 'Content not found' });
  return res.status(200).json(data);
}

