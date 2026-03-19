// ═══════════════════════════════════════════════════════════════
// Cloudflare Worker — Bunny.net Stream API proxy
//
// Deploy to Cloudflare Workers and set the secret:
//   wrangler secret put BUNNY_API_KEY
//
// Exposes:
//   GET /video/:libraryId/:videoId   — full video object from Bunny API
//
// The BUNNY_API_KEY secret is never exposed to the browser.
// ═══════════════════════════════════════════════════════════════

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {

    // Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405, headers: CORS });
    }

    const url = new URL(request.url);
    const match = url.pathname.match(/^\/video\/(\d+)\/([0-9a-f-]+)$/i);

    if (!match) {
      return new Response('Not found', { status: 404, headers: CORS });
    }

    const [, libraryId, videoId] = match;

    const upstream = await fetch(
      `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`,
      {
        headers: {
          AccessKey: env.BUNNY_API_KEY,
          Accept: 'application/json',
        },
      }
    );

    if (!upstream.ok) {
      return new Response(
        JSON.stringify({ error: 'Upstream error', status: upstream.status }),
        { status: upstream.status, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    const data = await upstream.json();

    return new Response(JSON.stringify(data), {
      headers: {
        ...CORS,
        'Content-Type': 'application/json',
        // Cache video metadata for 5 minutes at the edge
        'Cache-Control': 'public, max-age=300',
      },
    });
  },
};
