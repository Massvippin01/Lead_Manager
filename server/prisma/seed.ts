import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@meru.com' },
    update: {},
    create: {
      name: 'Alex Johnson',
      email: 'demo@meru.com',
      password: hashedPassword,
    },
  });

  console.log(`✅ Demo user seeded: ${demoUser.email} (Password: password123)`);

  // Clear existing leads for clean demo state
  await prisma.lead.deleteMany({
    where: { userId: demoUser.id },
  });

  const sampleLeads = [
    {
      name: 'Sarah Connor',
      email: 'sarah.c@cyberdyne.io',
      phone: '+1 (555) 234-5678',
      company: 'Cyberdyne Systems',
      value: 45000,
      source: 'WEBSITE',
      status: 'QUALIFIED',
      notes: [
        'Reviewed technical security proposal. Requested procurement quote.',
        'Initial discovery call with VP of Engineering completed.',
      ],
    },
    {
      name: 'Bruce Wayne',
      email: 'bruce@wayneenterprises.com',
      phone: '+1 (555) 890-1234',
      company: 'Wayne Enterprises',
      value: 120000,
      source: 'REFERRAL',
      status: 'CONTACTED',
      notes: [
        'Introductory meeting scheduled for next Tuesday regarding enterprise rollout.',
      ],
    },
    {
      name: 'Tony Stark',
      email: 'tony@starkindustries.com',
      phone: '+1 (555) 345-6789',
      company: 'Stark Industries',
      value: 250000,
      source: 'LINKEDIN',
      status: 'QUALIFIED',
      notes: [
        'Security compliance requirements verified. Contract in final legal review.',
      ],
    },
    {
      name: 'Peter Parker',
      email: 'peter@dailybugle.com',
      phone: '+1 (555) 456-7890',
      company: 'Daily Bugle',
      value: 15000,
      source: 'COLD_OUTREACH',
      status: 'NEW',
      notes: [
        'Inbound form submission downloaded whitepaper.',
      ],
    },
    {
      name: 'Diana Prince',
      email: 'diana@themyscira.org',
      phone: '+1 (555) 567-8901',
      company: 'Themyscira Cultural Inst.',
      value: 38000,
      source: 'EVENT',
      status: 'CONTACTED',
      notes: [
        'Met at London Tech Summit. Interested in multi-region deployment.',
      ],
    },
    {
      name: 'Arthur Dent',
      email: 'arthur@hitchhiker.co.uk',
      phone: '+44 20 7946 0912',
      company: 'Galaxy Travels',
      value: 12000,
      source: 'ADVERTISEMENT',
      status: 'LOST',
      notes: [
        'Budget allocated to alternative travel system this quarter. Follow up in Q4.',
      ],
    },
    {
      name: 'Natasha Romanoff',
      email: 'natasha@shield.gov',
      phone: '+1 (555) 678-9012',
      company: 'SHIELD Consulting',
      value: 85000,
      source: 'REFERRAL',
      status: 'QUALIFIED',
      notes: [
        'Security audit cleared. Awaiting final signatory.',
      ],
    },
    {
      name: 'Walter White',
      email: 'walter@graymatter.org',
      phone: '+1 (555) 789-0123',
      company: 'Gray Matter Technologies',
      value: 62000,
      source: 'WEBSITE',
      status: 'NEW',
      notes: [],
    },
    {
      name: 'Miles Morales',
      email: 'miles@visionsacademy.edu',
      phone: '+1 (555) 901-2345',
      company: 'Visions Academy',
      value: 24000,
      source: 'OTHER',
      status: 'NEW',
      notes: [],
    },
    {
      name: 'Elena Fisher',
      email: 'elena@explorer-tv.com',
      phone: '+1 (555) 123-4567',
      company: 'Uncharted Media',
      value: 50000,
      source: 'LINKEDIN',
      status: 'CONTACTED',
      notes: [
        'Requested product demo video and pricing tiers.',
      ],
    },
  ];

  for (const lead of sampleLeads) {
    const { notes, ...leadData } = lead;
    const createdLead = await prisma.lead.create({
      data: {
        ...leadData,
        userId: demoUser.id,
      },
    });

    for (const noteContent of notes) {
      await prisma.note.create({
        data: {
          leadId: createdLead.id,
          content: noteContent,
        },
      });
    }
  }

  console.log(`✅ Seeded ${sampleLeads.length} leads with deal values and interaction notes.`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
