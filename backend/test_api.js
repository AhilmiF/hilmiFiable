import { spawn } from 'child_process';

// Start backend server
const server = spawn('node', ['src/index.js'], { stdio: ['ignore', 'pipe', 'pipe'] });

let serverReady = false;
server.stdout.on('data', (data) => {
  const line = data.toString();
  if (line.includes('Server Benya')) serverReady = true;
});

// Helper delay
const delay = ms => new Promise(res => setTimeout(res, ms));

(async () => {
  // Wait up to 10s for server to be ready
  for (let i = 0; i < 20 && !serverReady; i++) {
    await delay(500);
  }
  if (!serverReady) {
    console.error('Server did not start');
    process.exit(1);
  }

  const base = 'http://localhost:5000/api/v1';
  // 1. Health check
  const healthRes = await fetch(`${base}/health`).then(r=>r.json());
  console.log('Health:', healthRes);

  // 2. Login as admin
  const loginRes = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@fiablelawyers.com', password: 'admin123' })
  }).then(r=>r.json());
  console.log('Login:', loginRes);
  const token = loginRes.token || loginRes.accessToken || '';

  // 3. Get articles (public)
  const artikels = await fetch(`${base}/artikel`).then(r=>r.json());
  console.log('Articles count:', artikels.data?.length);

  // 4. Create a new article (admin)
  const newArticle = {
    judul: 'Test Article',
    slug: 'test-article',
    keterangan: 'Testing CRUD',
    kategori: 'Testing',
    konten: 'Lorem ipsum',
    photoUrl: '/tmp-photo.jpg'
  };
  const createRes = await fetch(`${base}/artikel/admin`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(newArticle)
  }).then(r=>r.json());
  console.log('Create:', createRes);
  const createdId = createRes.data?.id;

  // 5. Update article
  if (createdId) {
    const updateRes = await fetch(`${base}/artikel/admin/${createdId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newArticle, judul: 'Updated Test Article' })
    }).then(r=>r.json());
    console.log('Update:', updateRes);
  }

  // 6. Delete article
  if (createdId) {
    const delRes = await fetch(`${base}/artikel/admin/${createdId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r=>r.json());
    console.log('Delete:', delRes);
  }

  // Shut down server
  server.kill();
})();
