export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const ua = req.headers.get('user-agent') || '';

  if (ua.includes('Baiduspider')) {
    return new Response('Forbidden', { status: 410 });
  }

  // 继续访问正常资源
  return fetch(req);
}