// middleware.js

// 百度爬虫的 User-Agent 标识符
const BAIDU_SPIDER_USER_AGENT = 'baiduspider';

export const config = {
  // 匹配所有路径（可根据需要调整）
  matcher: ['/', '/:path*'],
};

/**
 * Vercel Edge Middleware
 * @param {NextRequest} request
 * @returns {Response}
 */
export function middleware(request) {
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();

  // 1️⃣ 如果是百度爬虫，直接返回 404 阻止抓取
  if (userAgent.includes(BAIDU_SPIDER_USER_AGENT)) {
    console.log(`Blocked Baiduspider access to: ${request.url}`);

    return new Response('Not Found', {
      status: 404,
      headers: {
        'X-Blocked-By': 'Vercel-Edge-Middleware',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  }

  // 2️⃣ 普通用户请求，继续处理
  // 注意 Vercel 静态文件会通过 NextResponse.next() 返回
  const response = NextResponse.next();

  // 让 CDN 根据 User-Agent 缓存不同版本
  response.headers.set('Vary', 'User-Agent');

  return response;
}