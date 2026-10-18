# Varnison CMS OAuth worker (free)

GitHub's login for the CMS needs a tiny server. This Cloudflare Worker is it. Free plan is plenty.

1. **Create a free Cloudflare account** at https://dash.cloudflare.com/sign-up.
2. **Deploy the worker** (from this folder):
   ```
   npm install -g wrangler
   wrangler login
   wrangler deploy
   ```
   Note the URL it prints, like `https://varnison-cms-auth.<you>.workers.dev`.
3. **Create a GitHub OAuth App**: GitHub → Settings → Developer settings → OAuth Apps → New OAuth App.
   - Homepage URL: `https://varnison.com`
   - Authorization callback URL: `https://varnison-cms-auth.<you>.workers.dev/callback`
   Then click "Generate a new client secret". Copy the Client ID and secret.
4. **Add secrets to the worker** (still in this folder):
   ```
   wrangler secret put GITHUB_CLIENT_ID
   wrangler secret put GITHUB_CLIENT_SECRET
   ```
   (If your site is not at https://varnison.com, also set `ALLOWED_ORIGIN` under `[vars]` in wrangler.toml.)
5. **Point the CMS at it**: edit `public/admin/config.yml` and set `base_url` to the worker URL (no trailing slash). Commit to main.
6. Visit `https://varnison.com/admin/` and click "Login with GitHub".

Notes: the scope is `public_repo`, which works because the repo is public. Only people with write access to the repo can save changes.
