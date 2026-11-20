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
      },
    },
  };
});

const app = createApp();

describe('Meru Lead Manager API Test Suite', () => {
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
      // Mock valid user login to get a real valid JWT
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
          source: 'WEBSITE',
          status: 'NEW',
          userId: 'test-user-123',
          createdAt: new Date(),
          updatedAt: new Date(),
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

    it('should create a lead when valid payload is sent', async () => {
      const newLeadData = {
        name: 'Clark Kent',
        email: 'clark@dailyplanet.com',
        phone: '+1 555 999 8888',
        company: 'Daily Planet',
        source: 'WEBSITE',
        status: 'NEW',
      };

      (prisma.lead.create as any).mockResolvedValue({
        id: 'lead-new-id',
        ...newLeadData,
        userId: 'test-user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app)
        .post('/api/v1/leads')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newLeadData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.lead.name).toBe('Clark Kent');
      expect(res.body.data.lead.company).toBe('Daily Planet');
    });

    it('should reject lead creation with invalid phone and email', async () => {
      const res = await request(app)
        .post('/api/v1/leads')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Batman',
          email: 'not-an-email',
          phone: '123',
          company: '',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.details).toBeDefined();
    });

    it('should update lead status successfully', async () => {
      (prisma.lead.findFirst as any).mockResolvedValue({
        id: 'lead-1',
        name: 'Clark Kent',
        email: 'clark@dailyplanet.com',
        userId: 'test-user-123',
      });

      (prisma.lead.update as any).mockResolvedValue({
        id: 'lead-1',
        name: 'Clark Kent',
        status: 'QUALIFIED',
        userId: 'test-user-123',
      });

      const res = await request(app)
        .put('/api/v1/leads/lead-1')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'QUALIFIED' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.lead.status).toBe('QUALIFIED');
    });

    it('should delete a lead successfully', async () => {
      (prisma.lead.findFirst as any).mockResolvedValue({
        id: 'lead-1',
        userId: 'test-user-123',
      });

      (prisma.lead.delete as any).mockResolvedValue({ id: 'lead-1' });

      const res = await request(app)
        .delete('/api/v1/leads/lead-1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('successfully deleted');
    });

    it('should return aggregated status statistics', async () => {
      (prisma.lead.count as any)
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(4)  // new
        .mockResolvedValueOnce(3)  // contacted
        .mockResolvedValueOnce(2)  // qualified
        .mockResolvedValueOnce(1); // lost

      const res = await request(app)
        .get('/api/v1/leads/stats')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.stats.total).toBe(10);
      expect(res.body.data.stats.new).toBe(4);
      expect(res.body.data.stats.qualified).toBe(2);
      expect(res.body.data.stats.conversionRate).toBe('20.0%');
    });
  });
});
