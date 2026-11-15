(async () => {
  const base = 'http://localhost:5000/api/v1';
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
    if (!token) { console.error('No token, abort'); return; }
    // 3. Public articles list
    const articles = await fetch(`${base}/artikel`).then(r=>r.json());
    console.log('Articles count', articles.data?.length);
    // 4. Create article (admin) - JSON only (no file upload)
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
    }).then(r=>r.json());
    console.log('Create', create);
    const id = create.data?.id;
    // 5. Update article
    if (id) {
      const upd = await fetch(`${base}/artikel/admin/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newArt, judul: 'Updated Test Article' })
      }).then(r=>r.json());
      console.log('Update', upd);
    }
    // 6. Delete article
    if (id) {
      const del = await fetch(`${base}/artikel/admin/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r=>r.json());
      console.log('Delete', del);
    }
  } catch (e) {
    console.error('Error', e);
  }
})();
