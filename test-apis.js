const tests = [
  { name: 'Materials List', url: 'https://dlzrpxrppejh.sealoshzh.site/api/materials' },
  { name: 'Categories List', url: 'https://dlzrpxrppejh.sealoshzh.site/api/materials/categories/list' },
  { name: 'Categories Tree', url: 'https://dlzrpxrppejh.sealoshzh.site/api/materials/categories/tree' },
  { name: 'Health Check', url: 'https://dlzrpxrppejh.sealoshzh.site/api/health' }
];

Promise.all(tests.map(t => 
  fetch(t.url)
    .then(r => r.json())
    .then(d => ({ name: t.name, status: '✅', success: d.success }))
    .catch(e => ({ name: t.name, status: '❌', error: e.message }))
))
.then(results => {
  console.log('\n=== API Test Results ===\n');
  results.forEach(r => {
    const detail = r.success !== undefined ? 'success=' + r.success : r.error;
    console.log(`${r.status} ${r.name}: ${detail}`);
  });
  console.log('\n');
});
