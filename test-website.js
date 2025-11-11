const https = require('https');

async function testURL(url, description) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          description,
          status: res.statusCode,
          ok: res.statusCode === 200,
          contentLength: data.length
        });
      });
    }).on('error', (err) => {
      resolve({
        description,
        status: 'ERROR',
        ok: false,
        error: err.message
      });
    });
  });
}

async function main() {
  console.log('\n=== 网站状态检查 ===\n');
  
  const tests = [
    { url: 'https://dlzrpxrppejh.sealoshzh.site/', desc: '首页' },
    { url: 'https://dlzrpxrppejh.sealoshzh.site/api/products', desc: '商品API' },
    { url: 'https://dlzrpxrppejh.sealoshzh.site/api/materials', desc: '素材API' },
    { url: 'https://dlzrpxrppejh.sealoshzh.site/api/auth/me', desc: '用户API' }
  ];
  
  for (const test of tests) {
    const result = await testURL(test.url, test.desc);
    const icon = result.ok ? '✅' : '❌';
    const detail = result.error ? result.error : `${result.status} (${result.contentLength} bytes)`;
    console.log(`${icon} ${result.description}: ${detail}`);
  }
  
  console.log('\n');
}

main();
