const base = 'http://localhost:5000/api/v1';
(async () => {
  try {
    // 1. Health
    const health = await fetch(`${base}/health`).then(r=>r.json());
    console.log('Health', health);
    // 2. Login admin
    const login = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@fiablelawyers.com', password: 'admin123' })
    }).then(r=>r.json());
    console.log('Login', login);
    const token = login.token || login.accessToken || '';
    if (!token) { console.error('No token'); return; }
    // 3. Get articles
    const articles = await fetch(`${base}/artikel`).then(r=>r.json());
    console.log('Articles count', articles.data?.length);
    // 4. Create article (admin) - send JSON, no file upload
    const newArt = {
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
      body: JSON.stringify(newArt)
    }).then(r=>r.json());
    console.log('Create', createRes);
    const createdId = createRes.data?.id;
    // 5. Update article
    if (createdId) {
      const updateRes = await fetch(`${base}/artikel/admin/${createdId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newArt, judul: 'Updated Test Article' })
      }).then(r=>r.json());
      console.log('Update', updateRes);
    }
    // 6. Delete article
    if (createdId) {
      const delRes = await fetch(`${base}/artikel/admin/${createdId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r=>r.json());
      console.log('Delete', delRes);
    }
  } catch (e) {
    console.error('Error', e);
  }
})();
