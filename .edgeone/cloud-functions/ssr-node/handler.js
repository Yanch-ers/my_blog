
async function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => {
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        const bodyBuffer = Buffer.concat(chunks);
        resolve(bodyBuffer.length ? bodyBuffer : undefined);
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

const handlerPromise = import('./entry.mjs');

// Resolve the real public host. When EdgeOne Pages proxies a request to the
// SCF origin, req.headers.host is the internal SCF domain. The real public
// host is forwarded in eo-pages-host (EdgeOne specific) or x-forwarded-host
// (standard proxy header). Fall back to host, then localhost.
function resolvePublicHost(req) {
  const forwarded =
    req.headers['x-forwarded-host'] ||
    req.headers['eo-pages-host'] ||
    req.headers.host;
  if (!forwarded) {
    return 'localhost';
  }
  // x-forwarded-host may contain a comma-separated list; take the first hop.
  return forwarded.split(',')[0].trim();
}

async  function astroHandler (req, res) {
  try {
    // TEMP DEBUG: log all incoming headers to inspect which header carries the
    // real public host on EdgeOne Pages (remove after confirming).
    console.log('[edgeone-adapter] req.headers: ' + JSON.stringify(req.headers));
    const host = resolvePublicHost(req);
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const url = new URL(req.url, proto + '://' + host);

    const { default: handler } = await handlerPromise;

    let bodyBuffer;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      bodyBuffer = await readRequestBody(req);
    }

    const headers = new Headers(req.headers);
    // Keep the Host header consistent with the resolved public URL so that
    // request.headers.get('host') matches Astro.url.host.
    headers.set('host', host);
    const requestInit = {
      method: req.method,
      headers,
      body: bodyBuffer,
    };

    const request = new Request(url.toString(), requestInit);
    const response = await handler(request);

    // await handleResponse(res, response);
    return response;
  } catch (error) {
    console.error('SSR Error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end('<html><body><h1>Error</h1><p>' + error.message + '</p></body></html>');
  }
}

export default astroHandler;
