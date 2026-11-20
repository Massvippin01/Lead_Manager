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
      priority: 'HIGH',
      source: 'WEBSITE',
      status: 'QUALIFIED',
      notes: [
        { content: 'Reviewed technical security proposal. Requested procurement quote.', type: 'NOTE' },
        { content: 'Initial discovery call with VP of Engineering completed.', type: 'CALL' },
        { content: 'Pipeline stage advanced from CONTACTED to QUALIFIED.', type: 'STAGE_CHANGE' },
      ],
    },
    {
      name: 'Bruce Wayne',
      email: 'bruce@wayneenterprises.com',
      phone: '+1 (555) 890-1234',
      company: 'Wayne Enterprises',
      value: 120000,
      priority: 'HIGH',
      source: 'REFERRAL',
      status: 'CONTACTED',
      notes: [
        { content: 'Introductory meeting scheduled for next Tuesday regarding enterprise rollout.', type: 'CALL' },
      ],
    },
    {
      name: 'Tony Stark',
      email: 'tony@starkindustries.com',
      phone: '+1 (555) 345-6789',
      company: 'Stark Industries',
      value: 250000,
      priority: 'HIGH',
      source: 'LINKEDIN',
      status: 'QUALIFIED',
      notes: [
        { content: 'Security compliance requirements verified. Contract in final legal review.', type: 'NOTE' },
        { content: 'Pipeline stage advanced from CONTACTED to QUALIFIED.', type: 'STAGE_CHANGE' },
      ],
    },
    {
      name: 'Peter Parker',
      email: 'peter@dailybugle.com',
      phone: '+1 (555) 456-7890',
      company: 'Daily Bugle',
      value: 15000,
      priority: 'LOW',
      source: 'COLD_OUTREACH',
      status: 'NEW',
      notes: [
        { content: 'Inbound form submission downloaded whitepaper.', type: 'NOTE' },
      ],
    },
    {
      name: 'Diana Prince',
      email: 'diana@themyscira.org',
      phone: '+1 (555) 567-8901',
      company: 'Themyscira Cultural Inst.',
      value: 38000,
      priority: 'MEDIUM',
      source: 'EVENT',
      status: 'CONTACTED',
      notes: [
        { content: 'Met at London Tech Summit. Interested in multi-region deployment.', type: 'CALL' },
      ],
    },
    {
      name: 'Arthur Dent',
      email: 'arthur@hitchhiker.co.uk',
      phone: '+44 20 7946 0912',
      company: 'Galaxy Travels',
      value: 12000,
      priority: 'LOW',
      source: 'ADVERTISEMENT',
      status: 'LOST',
      notes: [
        { content: 'Budget allocated to alternative travel system this quarter. Follow up in Q4.', type: 'NOTE' },
        { content: 'Stage marked as LOST.', type: 'STAGE_CHANGE' },
      ],
    },
    {
      name: 'Natasha Romanoff',
      email: 'natasha@shield.gov',
      phone: '+1 (555) 678-9012',
      company: 'SHIELD Consulting',
      value: 85000,
      priority: 'HIGH',
      source: 'REFERRAL',
      status: 'QUALIFIED',
      notes: [
        { content: 'Security audit cleared. Awaiting final signatory.', type: 'NOTE' },
      ],
    },
    {
      name: 'Walter White',
      email: 'walter@graymatter.org',
      phone: '+1 (555) 789-0123',
      company: 'Gray Matter Technologies',
      value: 62000,
      priority: 'MEDIUM',
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
      priority: 'LOW',
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
      priority: 'MEDIUM',
      source: 'LINKEDIN',
      status: 'CONTACTED',
      notes: [
        { content: 'Requested product demo video and pricing tiers.', type: 'CALL' },
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

    for (const note of notes) {
      await prisma.note.create({
        data: {
          leadId: createdLead.id,
          content: note.content,
          type: note.type,
        },
      });
    }
  }

  console.log(`✅ Seeded ${sampleLeads.length} leads with priorities, deal values, and interaction history.`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
