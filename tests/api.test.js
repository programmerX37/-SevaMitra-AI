import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../api/index.js';

// ---------------------------------------------------------------------------
// Integration Test Suite — SevaMitra AI Backend
// ---------------------------------------------------------------------------

describe('GET /api/health', () => {
  it('responds with 200 OK and operational metadata', async () => {
    const res = await request(app)
      .get('/api/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('service', 'SevaMitra AI Core Engine');
  });
});

describe('POST /api/generate — Validation Gate', () => {
  it('rejects request with missing prompt field', async () => {
    const res = await request(app)
      .post('/api/generate')
      .send({})
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);

    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('prompt');
  });

  it('rejects request with empty string prompt', async () => {
    const res = await request(app)
      .post('/api/generate')
      .send({ prompt: '' })
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);

    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('prompt');
  });

  it('rejects request with whitespace-only prompt', async () => {
    const res = await request(app)
      .post('/api/generate')
      .send({ prompt: '   ' })
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);

    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('prompt');
  });

  it('rejects request with non-string prompt', async () => {
    const res = await request(app)
      .post('/api/generate')
      .send({ prompt: 12345 })
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);

    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('prompt');
  });
});
