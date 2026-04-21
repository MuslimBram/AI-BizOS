const http = require('http');

const data = JSON.stringify({ webhook_data: "check" });

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/webhooks/test',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, res => {
  let d = '';
  res.on('data', chunk => d += chunk);
  res.on('end', () => console.log(d));
});

req.write(data);
req.end();
