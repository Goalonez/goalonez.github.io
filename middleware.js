// 导入 NextRequest 和 NextResponse (Vercel Edge API)
import { NextResponse } from '@vercel/edge';

// 百度爬虫的 User-Agent 标识符
const BAIDU_SPIDER_USER_AGENT = 'Baiduspider';

export const config = {
  matcher: [
    '/',
    '/:path*',
  ],
};

export function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';

  // 1. 检查 User-Agent
  if (userAgent.includes(BAIDU_SPIDER_USER_AGENT)) {
    console.log(`Blocked Baiduspider access to: ${request.url}`);

    // 2. 返回 404 响应
    return new NextResponse('Not Found', {
      status: 404,
      headers: {
        'X-Blocked-By': 'Vercel-Edge-Middleware',
      },
    });
  }

  // 3. 不是百度爬虫，继续处理请求
  return NextResponse.next();
}