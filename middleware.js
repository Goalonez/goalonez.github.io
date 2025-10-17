// 注意：不要从 @vercel/edge 导入任何东西，Vercel Edge Runtime 会自动在全局提供 NextRequest 和 NextResponse。

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
  const userAgent = request.headers.get('user-agent') || '';

  // 1. 检查 User-Agent 是否包含 Baiduspider
  if (userAgent.includes(BAIDU_SPIDER_USER_AGENT)) {
    console.log(`Blocked Baiduspider access to: ${request.url}`);

    // 返回 404 响应
    return new NextResponse('Not Found', {
      status: 404,
      headers: {
        'X-Blocked-By': 'Vercel-Edge-Middleware',
        // **关键：对于 404 响应，确保没有缓存头部**
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  }

  // 2. 不是百度爬虫，继续处理请求
  // 为了让 CDN 区分 User-Agent，我们需要修改响应头部。
  const response = NextResponse.next();

  // **关键：添加 Vary 头部**
  // 告诉 CDN 对不同的 User-Agent 存储不同的缓存副本。
  response.headers.set('Vary', 'User-Agent');

  // **可选优化:** 如果你想让 Edge Middleware 总是能拦截请求，
  // 可以将 Cache-Control s-maxage 设置为 0 或很低的值。
  // 但添加 Vary: User-Agent 应该足以让百度爬虫请求命中新的逻辑。

  return response;
}