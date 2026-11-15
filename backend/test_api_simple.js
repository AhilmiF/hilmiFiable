const base = 'http://localhost:5000/api/v1';
(async () => {
  try {
    // Health check
    const health = await fetch(`${base}/health`).then(r => r.json());
    console.log('Health', health);
    // Login as admin
    const login = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@fiablelawyers.com', password: 'admin123' })
    }).then(r => r.json());
    console.log('Login', login);
    const token = login.token || login.accessToken || '';
    if (!token) { console.error('No token, abort'); return; }
    // Get public articles
    const artRes = await fetch(`${base}/artikel`).then(r => r.json());
    console.log('Articles count', artRes.data?.length);
    // Create a new article (admin)
    const newArt = {
      judul: 'Test Article',
      slug: 'test-article',
      keterangan: 'Testing CRUD',
      kategori: 'Testing',
      konten: 'Lorem ipsum',
      photoUrl: '/tmp-photo.jpg'
    };
    const create = await fetch(`${base}/artikel/admin`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(newArt)
    }).then(r => r.json());
    console.log('Create', create);
    const id = create.data?.id;
    // Update article
    if (id) {
      const upd = await fetch(`${base}/artikel/admin/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newArt, judul: 'Updated Test Article' })
      }).then(r => r.json());
      console.log('Update', upd);
    }
    // Delete article
    if (id) {
      const del = await fetch(`${base}/artikel/admin/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.json());
      console.log('Delete', del);
    }
  } catch (e) {
    console.error('Error', e);
  }
})();