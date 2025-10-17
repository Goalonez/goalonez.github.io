// 注意：不要从 @vercel/edge 导入任何东西，
// Vercel Edge Runtime 会自动在全局提供 NextRequest 和 NextResponse。

// 百度爬虫的 User-Agent 标识符
const BAIDU_SPIDER_USER_AGENT = 'Baiduspider';

export const config = {
  // 匹配所有路径
  matcher: [
    '/',
    '/:path*',
  ],
};

/**
 * Vercel Edge Middleware 主函数
 * @param {NextRequest} request 传入的请求对象
 * @returns {NextResponse} 响应对象
 */
export function middleware(request) {
  // 从请求头获取 User-Agent
  const userAgent = request.headers.get('user-agent') || '';

  // 1. 检查 User-Agent 是否包含 Baiduspider
  if (userAgent.includes(BAIDU_SPIDER_USER_AGENT)) {
    console.log(`Blocked Baiduspider access to: ${request.url}`);

    // 2. 返回 404 响应
    // Vercel Edge Runtime 已经内置了 NextResponse
    return new NextResponse('Not Found', {
      status: 404,
      headers: {
        'X-Blocked-By': 'Vercel-Edge-Middleware',
      },
    });
  }

  // 3. 不是百度爬虫，继续处理请求
  // Vercel Edge Runtime 已经内置了 NextResponse
  return NextResponse.next();
}