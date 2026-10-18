export function ytId(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}
export function thumbOf(e: { data: any }): string | null {
  if (e.data.thumbnail) return e.data.thumbnail;
  if (e.data.type === 'picture' && e.data.image) return e.data.image;
  const id = ytId(e.data.youtube);
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null;
}
export const fmt = (d: Date) => d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
export function currentVersion(p: { data: any }) {
  const u = [...p.data.updates].sort((a: any, b: any) => +b.date - +a.date);
  return u[0] ?? null;
}
