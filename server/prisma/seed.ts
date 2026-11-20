import { PrismaClient, LeadSource, LeadStatus } from '@prisma/client';
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
      source: LeadSource.WEBSITE,
      status: LeadStatus.QUALIFIED,
    },
    {
      name: 'Bruce Wayne',
      email: 'bruce@wayneenterprises.com',
      phone: '+1 (555) 890-1234',
      company: 'Wayne Enterprises',
      source: LeadSource.REFERRAL,
      status: LeadStatus.CONTACTED,
    },
    {
      name: 'Tony Stark',
      email: 'tony@starkindustries.com',
      phone: '+1 (555) 345-6789',
      company: 'Stark Industries',
      source: LeadSource.LINKEDIN,
      status: LeadStatus.QUALIFIED,
    },
    {
      name: 'Peter Parker',
      email: 'peter@dailybugle.com',
      phone: '+1 (555) 456-7890',
      company: 'Daily Bugle',
      source: LeadSource.COLD_OUTREACH,
      status: LeadStatus.NEW,
    },
    {
      name: 'Diana Prince',
      email: 'diana@themyscira.org',
      phone: '+1 (555) 567-8901',
      company: 'Themyscira Cultural Inst.',
      source: LeadSource.EVENT,
      status: LeadStatus.CONTACTED,
    },
    {
      name: 'Arthur Dent',
      email: 'arthur@hitchhiker.co.uk',
      phone: '+44 20 7946 0912',
      company: 'Galaxy Travels',
      source: LeadSource.ADVERTISEMENT,
      status: LeadStatus.LOST,
    },
    {
      name: 'Natasha Romanoff',
      email: 'natasha@shield.gov',
      phone: '+1 (555) 678-9012',
      company: 'SHIELD Consulting',
      source: LeadSource.REFERRAL,
      status: LeadStatus.QUALIFIED,
    },
    {
      name: 'Walter White',
      email: 'walter@graymatter.org',
      phone: '+1 (555) 789-0123',
      company: 'Gray Matter Technologies',
      source: LeadSource.WEBSITE,
      status: LeadStatus.NEW,
    },
    {
      name: 'Miles Morales',
      email: 'miles@visionsacademy.edu',
      phone: '+1 (555) 901-2345',
      company: 'Visions Academy',
      source: LeadSource.OTHER,
      status: LeadStatus.NEW,
    },
    {
      name: 'Elena Fisher',
      email: 'elena@explorer-tv.com',
      phone: '+1 (555) 123-4567',
      company: 'Uncharted Media',
      source: LeadSource.LINKEDIN,
      status: LeadStatus.CONTACTED,
    },
  ];

  for (const lead of sampleLeads) {
    await prisma.lead.create({
      data: {
        ...lead,
        userId: demoUser.id,
      },
    });
  }

  console.log(`✅ Seeded ${sampleLeads.length} leads across diverse statuses.`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
