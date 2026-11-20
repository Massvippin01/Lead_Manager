import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

// Mock Prisma
vi.mock('../src/lib/prisma', () => {
  return {
    prisma: {
      user: {
        findUnique: vi.fn(),
        create: vi.fn(),
      },
      lead: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
        count: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        updateMany: vi.fn(),
        deleteMany: vi.fn(),
      },
      note: {
        findMany: vi.fn(),
        create: vi.fn(),
      },
    },
  };
});

const app = createApp();

describe('Meru Lead Manager Production API Test Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/v1/health', () => {
    it('should return healthy status', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.service).toBe('Meru Lead Manager API');
    });
  });

  describe('Auth Endpoints (/api/v1/auth)', () => {
    it('should reject registration with invalid input', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'A', email: 'invalid-email', password: '123' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.details).toBeDefined();
    });

    it('should register a new user successfully', async () => {
      (prisma.user.findUnique as any).mockResolvedValue(null);
      (prisma.user.create as any).mockResolvedValue({
        id: 'user-uuid-1',
        name: 'Jane Doe',
        email: 'jane@example.com',
        createdAt: new Date(),
      });

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('jane@example.com');
      expect(res.body.data.token).toBeDefined();
    });

    it('should reject login with wrong password', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      (prisma.user.findUnique as any).mockResolvedValue({
        id: 'user-uuid-1',
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: hashedPassword,
      });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'jane@example.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Invalid email or password');
    });
  });

  describe('Lead Endpoints (/api/v1/leads)', () => {
    let authToken = '';

    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      (prisma.user.findUnique as any).mockResolvedValue({
        id: 'test-user-123',
        name: 'Test Agent',
        email: 'agent@meru.com',
        password: hashedPassword,
      });

      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'agent@meru.com', password: 'password123' });

      authToken = loginRes.body.data.token;
    });

    it('should block unauthenticated access to leads', async () => {
      const res = await request(app).get('/api/v1/leads');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return leads list for authenticated user', async () => {
      (prisma.lead.count as any).mockResolvedValue(1);
      (prisma.lead.findMany as any).mockResolvedValue([
        {
          id: 'lead-1',
          name: 'Acme Corp Contact',
          email: 'contact@acme.com',
          phone: '+1 555 123 4567',
          company: 'Acme Corp',
          value: 15000,
          source: 'WEBSITE',
          status: 'NEW',
          userId: 'test-user-123',
          createdAt: new Date(),
          updatedAt: new Date(),
          notes: [],
        },
      ]);

      const res = await request(app)
        .get('/api/v1/leads?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.leads).toHaveLength(1);
      expect(res.body.data.pagination.total).toBe(1);
    });

    it('should create a lead with deal value', async () => {
      const newLeadData = {
        name: 'Clark Kent',
        email: 'clark@dailyplanet.com',
        phone: '+1 555 999 8888',
        company: 'Daily Planet',
        value: 25000,
        source: 'WEBSITE',
        status: 'NEW',
      };

      (prisma.lead.create as any).mockResolvedValue({
        id: 'lead-new-id',
        ...newLeadData,
        userId: 'test-user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
        notes: [],
      });

      const res = await request(app)
        .post('/api/v1/leads')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newLeadData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.lead.name).toBe('Clark Kent');
      expect(res.body.data.lead.value).toBe(25000);
    });

    it('should handle bulk status update', async () => {
      (prisma.lead.updateMany as any).mockResolvedValue({ count: 2 });

      const res = await request(app)
        .patch('/api/v1/leads/bulk-status')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ids: ['lead-1', 'lead-2'],
          status: 'QUALIFIED',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.updatedCount).toBe(2);
    });

    it('should handle bulk delete', async () => {
      (prisma.lead.deleteMany as any).mockResolvedValue({ count: 2 });

      const res = await request(app)
        .post('/api/v1/leads/bulk-delete')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ids: ['lead-1', 'lead-2'],
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.deletedCount).toBe(2);
    });

    it('should create and retrieve notes for a lead', async () => {
      (prisma.lead.findFirst as any).mockResolvedValue({
        id: 'lead-1',
        userId: 'test-user-123',
      });

      (prisma.note.create as any).mockResolvedValue({
        id: 'note-1',
        leadId: 'lead-1',
        content: 'Customer interested in annual enterprise plan.',
        createdAt: new Date(),
      });

      const createRes = await request(app)
        .post('/api/v1/leads/lead-1/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Customer interested in annual enterprise plan.' });

      expect(createRes.status).toBe(201);
      expect(createRes.body.success).toBe(true);
      expect(createRes.body.data.note.content).toContain('annual enterprise plan');
    });

    it('should return aggregated metrics including pipeline value', async () => {
      (prisma.lead.count as any)
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(4)  // new
        .mockResolvedValueOnce(3)  // contacted
        .mockResolvedValueOnce(2)  // qualified
        .mockResolvedValueOnce(1); // lost

      (prisma.lead.findMany as any).mockResolvedValue([
        { value: 10000, status: 'QUALIFIED' },
        { value: 20000, status: 'QUALIFIED' },
        { value: 5000, status: 'NEW' },
      ]);

      const res = await request(app)
        .get('/api/v1/leads/stats')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.stats.total).toBe(10);
      expect(res.body.data.stats.pipelineValue).toBe(35000);
      expect(res.body.data.stats.qualifiedValue).toBe(30000);
    });
  });
});
