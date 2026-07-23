const https = require('https');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const token = 'nfp_xQw8WxP7huuMGdp8xQR4cC4TP8mDXCkp1315';
const siteName = 'nba-legend-career-simulator';

// Get site info
const getSite = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.netlify.com',
      path: `/api/sites?name=${siteName}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const sites = JSON.parse(data);
          if (Array.isArray(sites) && sites.length > 0) {
            resolve(sites[0]);
          } else {
            console.log('Raw response:', data.substring(0, 500));
            resolve(null);
          }
        } catch (e) {
          console.log('Parse error:', e.message);
          console.log('Raw:', data.substring(0, 500));
          resolve(null);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
};

// Deploy files
const deployFiles = async (siteId, dir) => {
  const files = fs.readdirSync(dir);
  const results = [];
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      const subResults = await deployFiles(siteId, filePath);
      results.push(...subResults);
    } else {
      results.push({ path: '/' + file, file: filePath });
    }
  }
  
  return results;
};

const main = async () => {
  console.log('Getting site info...');
  const site = await getSite();
  
  if (site) {
    console.log('Found site:', site.name, 'ID:', site.id);
    console.log('URL:', site.ssl_url);
  } else {
    console.log('Site not found');
  }
};

main().catch(console.error);
