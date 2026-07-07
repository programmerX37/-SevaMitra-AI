import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../api/index.js';

describe('SevaMitra AI — Monorepo Integration Testing Matrix', () => {
  
  // Test Case 1: Checking System Liveness Health Probe
  it('GET /api/health should respond with status 200 and return precise branding metadata', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'healthy');
    expect(response.body).toHaveProperty('service', 'SevaMitra AI Core Engine');
  });

  // Test Case 2: Boundary Checking Empty Payload Interception
  it('POST /api/generate should reject completely empty payload configuration with HTTP 400', async () => {
    const response = await request(app)
      .post('/api/generate')
      .send({})
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('Validation failed');
  });

  // Test Case 3: Boundary Checking Missing Text Prompt Field
  it('POST /api/generate should intercept missing prompt strings and reject with HTTP 400', async () => {
    const response = await request(app)
      .post('/api/generate')
      .send({ contextType: 'seva', language: 'Hindi' })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

  // Test Case 4: Boundary Checking Whitespace Input Strings
  it('POST /api/generate should block whitespace-only prompt strings and reject with HTTP 400', async () => {
    const response = await request(app)
      .post('/api/generate')
      .send({ prompt: '    ', contextType: 'dastavez', language: 'English' })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

  // Test Case 5: Boundary Checking Invalid Data Type Submission
  it('POST /api/generate should intercept non-string data types and reject with HTTP 400', async () => {
    const response = await request(app)
      .post('/api/generate')
      .send({ prompt: 998877, contextType: 'shikayat', language: 'Hindi' })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

});
