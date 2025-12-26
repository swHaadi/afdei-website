import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

// Import Prisma client
import prisma from './lib/prisma.js';

// Import routes
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import mediaRoutes from './routes/media.js';
import settingsRoutes from './routes/settings.js';
import eventsRoutes from './routes/events.js';
import projectsRoutes from './routes/projects.js';
import contactRoutes from './routes/contact.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || true, // Allow frontend URL or all origins for demo
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve frontend in production
const frontendPath = path.join(__dirname, '../../dist');
const publicPath = path.join(__dirname, '../../public');
app.use(express.static(publicPath));
app.use(express.static(frontendPath));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/contact', contactRoutes);

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  }
});

// Error handling
app.use(errorHandler);

// Initialize database with AFDEI data
async function initializeDatabase() {
  try {
    // Check if admin user exists
    const adminExists = await prisma.user.findFirst({ where: { role: 'admin' } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await prisma.user.create({
        data: { name: 'Admin', email: 'admin@afdei.org', password: hashedPassword, role: 'admin', isActive: true }
      });
      console.log('✅ Admin user created: admin@afdei.org / admin123');
    }

    // Create Hero content
    const heroContent = await prisma.content.findUnique({ where: { section: 'hero' } });
    if (!heroContent) {
      await prisma.content.create({
        data: {
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
          }),
          isActive: true, order: 1
        }
      });
      console.log('✅ Hero content created');
    }

    // Create About content
    const aboutContent = await prisma.content.findUnique({ where: { section: 'about' } });
    if (!aboutContent) {
      await prisma.content.create({
        data: {
          section: 'about',
          contentEn: JSON.stringify({
            title: 'About Us',
            vision: { title: 'Vision', content: 'To be the leading force in promoting sustainable economic development and integration across the Arab world, fostering prosperity and unity among Arab nations through innovative initiatives and collaborative partnerships.' },
            mission: { title: 'Mission', content: 'To strengthen economic ties between Arab nations, promote sustainable development, facilitate the implementation of joint economic projects, and support the private sector in overcoming challenges to achieve comprehensive Arab economic integration.' },
            values: { title: 'Our Values', leadership: 'Leadership', empowerment: 'Empowerment', innovation: 'Innovation', sustainability: 'Sustainability' },
            president: { title: "President's Message", message: 'Welcome to the Arab Federation for Development and Economic Integration. Our commitment to fostering economic growth and development across the Arab world remains unwavering. We believe in the power of unity and collaboration to build a prosperous future for all Arab nations. Together, we can overcome challenges and create opportunities that benefit our people and strengthen our economies.' },
            objectives: { title: 'Our Objectives', list: [
              'Strengthen relationships between Arab economic bodies and the private sector concerning economic development projects.',
              'Assist the Arab private sector in finding solutions to challenges hindering the implementation of economic development decisions issued by the Arab League and the Council of Arab Economic Unity.',
              'Propose projects contributing to Arab economic integration and submit them to competent authorities.',
              'Contribute to the integration and development of the Arab private sector and attract Arab investments.',
              'Develop trade exchange between Arab countries and enhance partnership with international organizations.'
            ]}
          }),
          contentAr: JSON.stringify({
            title: 'من نحن',
            vision: { title: 'الرؤية', content: 'أن نكون القوة الرائدة في تعزيز التنمية الاقتصادية المستدامة والتكامل عبر العالم العربي، وتعزيز الرخاء والوحدة بين الدول العربية من خلال المبادرات المبتكرة والشراكات التعاونية.' },
            mission: { title: 'الرسالة', content: 'تعزيز الروابط الاقتصادية بين الدول العربية، وتعزيز التنمية المستدامة، وتسهيل تنفيذ المشاريع الاقتصادية المشتركة، ودعم القطاع الخاص في التغلب على التحديات لتحقيق التكامل الاقتصادي العربي الشامل.' },
            values: { title: 'قيمنا', leadership: 'القيادة', empowerment: 'التمكين', innovation: 'الابتكار', sustainability: 'الاستدامة' },
            president: { title: 'رسالة الرئيس', message: 'مرحباً بكم في الاتحاد العربي للتنمية والتكامل الاقتصادي. التزامنا بتعزيز النمو الاقتصادي والتنمية في جميع أنحاء العالم العربي لا يتزعزع. نحن نؤمن بقوة الوحدة والتعاون لبناء مستقبل مزدهر لجميع الدول العربية. معاً، يمكننا التغلب على التحديات وخلق فرص تعود بالنفع على شعوبنا وتعزز اقتصاداتنا.' },
            objectives: { title: 'أهدافنا', list: [
              'تعزيز العلاقات بين الهيئات الاقتصادية العربية والقطاع الخاص فيما يتعلق بمشاريع التنمية الاقتصادية.',
              'مساعدة القطاع الخاص العربي في إيجاد حلول للتحديات التي تعيق تنفيذ قرارات التنمية الاقتصادية الصادرة عن جامعة الدول العربية ومجلس الوحدة الاقتصادية العربية.',
              'اقتراح المشاريع المساهمة في التكامل الاقتصادي العربي وتقديمها للجهات المختصة.',
              'المساهمة في تكامل وتطوير القطاع الخاص العربي وجذب الاستثمارات العربية.',
              'تطوير التبادل التجاري بين الدول العربية وتعزيز الشراكة مع المنظمات الدولية.'
            ]}
          }),
          isActive: true, order: 2
        }
      });
      console.log('✅ About content created');
    }

    // Create Membership content
    const membershipContent = await prisma.content.findUnique({ where: { section: 'membership' } });
    if (!membershipContent) {
      await prisma.content.create({
        data: {
          section: 'membership',
          contentEn: JSON.stringify({
            title: 'Membership',
            subtitle: 'Join Our Growing Network',
            description: 'Become a member of the Arab Federation for Development and Economic Integration and contribute to shaping the economic future of the Arab world. Our membership brings together leaders, innovators, and organizations committed to sustainable development and economic prosperity across all Arab nations.',
            benefits: [
              'Access to exclusive networking opportunities with Arab business leaders',
              'Recognition as a leader in Arab economic development',
              'Participation in regional and international conferences and events',
              'Business development and partnership opportunities across Arab countries'
            ],
            buttonText: 'Join Us',
            memberCount: '500+',
            memberLabel: 'Active Members'
          }),
          contentAr: JSON.stringify({
            title: 'العضوية',
            subtitle: 'انضم إلى شبكتنا المتنامية',
            description: 'كن عضواً في الاتحاد العربي للتنمية والتكامل الاقتصادي وساهم في تشكيل المستقبل الاقتصادي للعالم العربي. تجمع عضويتنا القادة والمبتكرين والمنظمات الملتزمة بالتنمية المستدامة والازدهار الاقتصادي في جميع الدول العربية.',
            benefits: [
              'الوصول إلى فرص التواصل الحصرية مع قادة الأعمال العرب',
              'الاعتراف كقائد في التنمية الاقتصادية العربية',
              'المشاركة في المؤتمرات والفعاليات الإقليمية والدولية',
              'فرص تطوير الأعمال والشراكة عبر الدول العربية'
            ],
            buttonText: 'انضم إلينا',
            memberCount: '+500',
            memberLabel: 'عضو نشط'
          }),
          isActive: true, order: 3
        }
      });
      console.log('✅ Membership content created');
    }

    // Create Advisory content
    const advisoryContent = await prisma.content.findUnique({ where: { section: 'advisory' } });
    if (!advisoryContent) {
      await prisma.content.create({
        data: {
          section: 'advisory',
          contentEn: JSON.stringify({
            title: 'Advisory Bodies',
            subtitle: 'Our advisory bodies bring together experts and leaders from various sectors to guide our strategic initiatives and ensure effective implementation of our programs across the Arab world.',
            bodies: [
              { title: 'Economic Development Committee', description: 'Focuses on strategic economic planning and development initiatives across member states to promote sustainable growth.', members: 12 },
              { title: 'Social Integration Council', description: 'Works on social policies and programs that enhance quality of life and promote integration in Arab communities.', members: 10 },
              { title: 'Business Advisory Board', description: 'Provides guidance on private sector engagement, investment opportunities, and business development.', members: 15 },
              { title: 'International Relations Committee', description: 'Manages partnerships and collaborations with international organizations and foreign entities.', members: 8 }
            ]
          }),
          contentAr: JSON.stringify({
            title: 'الهيئات الاستشارية',
            subtitle: 'تجمع هيئاتنا الاستشارية الخبراء والقادة من مختلف القطاعات لتوجيه مبادراتنا الاستراتيجية وضمان التنفيذ الفعال لبرامجنا في جميع أنحاء العالم العربي.',
            bodies: [
              { title: 'لجنة التنمية الاقتصادية', description: 'تركز على التخطيط الاقتصادي الاستراتيجي ومبادرات التنمية عبر الدول الأعضاء لتعزيز النمو المستدام.', members: 12 },
              { title: 'مجلس التكامل الاجتماعي', description: 'يعمل على السياسات والبرامج الاجتماعية التي تعزز جودة الحياة والتكامل في المجتمعات العربية.', members: 10 },
              { title: 'المجلس الاستشاري للأعمال', description: 'يوفر التوجيه بشأن مشاركة القطاع الخاص وفرص الاستثمار وتطوير الأعمال.', members: 15 },
              { title: 'لجنة العلاقات الدولية', description: 'تدير الشراكات والتعاون مع المنظمات الدولية والجهات الأجنبية.', members: 8 }
            ]
          }),
          isActive: true, order: 4
        }
      });
      console.log('✅ Advisory content created');
    }

    // Create Contact content
    const contactContent = await prisma.content.findUnique({ where: { section: 'contact' } });
    if (!contactContent) {
      await prisma.content.create({
        data: {
          section: 'contact',
          contentEn: JSON.stringify({
            title: 'Contact Us',
            getInTouch: 'Get in Touch',
            sendMessage: 'Send us a Message',
            address: '4 Dar Al-Salam Street – Kobri Al-Qubba – Al-Zaytoun – Heliopolis – Cairo – Arab Republic of Egypt',
            email: 'info@afdei.org',
            phone: '+20 2 2639 6296',
            workingHours: 'Sunday - Thursday: 9:00 AM - 5:00 PM',
            formLabels: { name: 'Your Name', email: 'Your Email', subject: 'Subject', message: 'Message', submit: 'Send Message' },
            successMessage: 'Thank you for your message. We will get back to you soon!',
            errorMessage: 'Something went wrong. Please try again later.'
          }),
          contentAr: JSON.stringify({
            title: 'اتصل بنا',
            getInTouch: 'تواصل معنا',
            sendMessage: 'أرسل لنا رسالة',
            address: '4 شارع دار السلام - كوبري القبة - الزيتون - مصر الجديدة - القاهرة - جمهورية مصر العربية',
            email: 'info@afdei.org',
            phone: '+20 2 2639 6296',
            workingHours: 'الأحد - الخميس: 9:00 صباحاً - 5:00 مساءً',
            formLabels: { name: 'الاسم', email: 'البريد الإلكتروني', subject: 'الموضوع', message: 'الرسالة', submit: 'إرسال الرسالة' },
            successMessage: 'شكراً لرسالتك. سنرد عليك قريباً!',
            errorMessage: 'حدث خطأ ما. يرجى المحاولة مرة أخرى لاحقاً.'
          }),
          isActive: true, order: 5
        }
      });
      console.log('✅ Contact content created');
    }

    // Create E-Tajer project
    const projectExists = await prisma.project.findFirst();
    if (!projectExists) {
      await prisma.project.create({
        data: {
          nameEn: 'E-Tajer Project',
          nameAr: 'مشروع إي تاجر',
          descriptionEn: 'E-Tajer is a comprehensive Arab e-commerce platform designed to facilitate trade between Arab businesses and consumers. The platform aims to create a unified digital marketplace that connects merchants across Arab countries, enabling seamless cross-border transactions and promoting economic integration.',
          descriptionAr: 'إي تاجر هي منصة تجارة إلكترونية عربية شاملة مصممة لتسهيل التجارة بين الشركات والمستهلكين العرب. تهدف المنصة إلى إنشاء سوق رقمي موحد يربط التجار في جميع الدول العربية، مما يتيح معاملات سلسة عبر الحدود ويعزز التكامل الاقتصادي.',
          objectivesEn: JSON.stringify(['Enable digital transformation for Arab businesses', 'Create a unified Arab digital marketplace', 'Support SMEs in expanding their regional reach', 'Facilitate cross-border e-commerce transactions', 'Promote Arab products globally']),
          objectivesAr: JSON.stringify(['تمكين التحول الرقمي للأعمال العربية', 'إنشاء سوق رقمي عربي موحد', 'دعم الشركات الصغيرة والمتوسطة في توسيع نطاقها الإقليمي', 'تسهيل معاملات التجارة الإلكترونية عبر الحدود', 'الترويج للمنتجات العربية عالمياً']),
          images: JSON.stringify([{ url: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800' }]),
          isFeatured: true, isActive: true, order: 1
        }
      });
      console.log('✅ E-Tajer project created');
    }

    // Create events
    const eventsExist = await prisma.event.findFirst();
    if (!eventsExist) {
      await prisma.event.createMany({
        data: [
          {
            titleEn: 'Arab Economic Summit 2025',
            titleAr: 'القمة الاقتصادية العربية 2025',
            descriptionEn: 'Annual summit bringing together economic leaders, ministers, and business executives from across the Arab world to discuss economic cooperation and integration strategies.',
            descriptionAr: 'القمة السنوية التي تجمع القادة الاقتصاديين والوزراء ورجال الأعمال من جميع أنحاء العالم العربي لمناقشة استراتيجيات التعاون والتكامل الاقتصادي.',
            date: new Date('2025-03-15'),
            locationEn: 'Cairo, Egypt',
            locationAr: 'القاهرة، مصر',
            imageUrl: 'https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg?auto=compress&cs=tinysrgb&w=600',
            isFeatured: true, isActive: true
          },
          {
            titleEn: 'Youth Entrepreneurship Workshop',
            titleAr: 'ورشة عمل ريادة الأعمال للشباب',
            descriptionEn: 'Empowering young Arab entrepreneurs with skills, knowledge, and networking opportunities to build successful businesses and contribute to economic growth.',
            descriptionAr: 'تمكين رواد الأعمال الشباب العرب بالمهارات والمعرفة وفرص التواصل لبناء أعمال ناجحة والمساهمة في النمو الاقتصادي.',
            date: new Date('2025-02-20'),
            locationEn: 'Dubai, UAE',
            locationAr: 'دبي، الإمارات',
            imageUrl: 'https://images.pexels.com/photos/7413915/pexels-photo-7413915.jpeg?auto=compress&cs=tinysrgb&w=600',
            isFeatured: false, isActive: true
          },
          {
            titleEn: 'Digital Transformation Conference',
            titleAr: 'مؤتمر التحول الرقمي',
            descriptionEn: 'Exploring digital innovation and its transformative impact on Arab economies, featuring expert speakers and interactive sessions.',
            descriptionAr: 'استكشاف الابتكار الرقمي وتأثيره التحويلي على الاقتصادات العربية، مع متحدثين خبراء وجلسات تفاعلية.',
            date: new Date('2025-04-10'),
            locationEn: 'Riyadh, Saudi Arabia',
            locationAr: 'الرياض، السعودية',
            imageUrl: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=600',
            isFeatured: false, isActive: true
          }
        ]
      });
      console.log('✅ Events created');
    }

  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Using SQLite database with Prisma`);
  await initializeDatabase();
  console.log(`📝 Login: admin@afdei.org / admin123`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
