// Minimal GitHub OAuth proxy for Sveltia CMS / Decap CMS (free Cloudflare Workers).
// Secrets required: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET.
// Optional var: ALLOWED_ORIGIN (default https://varnison.com)
const html = (body) => new Response(body, { headers: { 'content-type': 'text/html;charset=UTF-8' } });

function cookie(request, name) {
  const m = (request.headers.get('Cookie') || '').match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? m[1] : null;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = env.ALLOWED_ORIGIN || 'https://varnison.com';

    if (url.pathname === '/auth') {
      const state = crypto.randomUUID();
      const gh = new URL('https://github.com/login/oauth/authorize');
      gh.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      gh.searchParams.set('scope', 'public_repo');
      gh.searchParams.set('state', state);
      return new Response(null, {
        status: 302,
        headers: { Location: gh.toString(), 'Set-Cookie': `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600` },
      });
    }

    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      let message, status;
      if (!code || !state || state !== cookie(request, 'oauth_state')) {
        status = 'error'; message = { error: 'invalid state' };
      } else {
        const r = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: { 'content-type': 'application/json', accept: 'application/json' },
          body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code }),
        });
        const data = await r.json();
        if (data.access_token) { status = 'success'; message = { token: data.access_token, provider: 'github' }; }
        else { status = 'error'; message = data; }
      }
      const payload = `authorization:github:${status}:${JSON.stringify(message)}`;
      return html(`<!doctype html><script>
(function(){
  var target=${JSON.stringify(origin)};
  window.addEventListener('message',function(e){
    if(e.data==='authorizing:github'){window.opener.postMessage(${JSON.stringify(payload)},target);window.close();}
  });
  window.opener.postMessage('authorizing:github','*');
})();
</script>`);
    }
    return new Response('Varnison CMS auth worker', { status: 200 });
  },
};
