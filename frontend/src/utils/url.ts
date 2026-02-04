/**
 * 工具函数：确保URL使用HTTPS协议
 * 用于解决HTTPS网站上的混合内容问题
 */

/**
 * 将HTTP URL转换为HTTPS URL
 * @param url 原始URL
 * @returns 安全的HTTPS URL
 */
export const getSecureUrl = (url: string): string => {
  if (!url) return url

  // 如果已经是HTTPS，直接返回
  if (url.startsWith('https://')) {
    return url
  }

  // 如果是HTTP协议，替换为HTTPS
  if (url.startsWith('http://')) {
    return url.replace(/^http:/, 'https:')
  }

  // 如果没有协议，假设是HTTPS（适用于相对路径或协议相对URL）
  return url
}

/**
 * 专门用于头像URL的安全转换
 * @param url 头像URL
 * @returns 安全的头像URL
 */
export const getSecureAvatarUrl = (url: string): string => {
  if (!url) return url

  // 对于Twitter的所有图片（头像、媒体等），使用代理服务绕过CORS
  if (url.includes('pbs.twimg.com')) {
    // 使用images.weserv.nl作为代理服务，保持原始尺寸
    const encodedUrl = encodeURIComponent(url)
    return `https://images.weserv.nl/?url=${encodedUrl}&output=webp`
  }

  return getSecureUrl(url)
}

/**
 * 通用的图片URL安全转换（支持所有外部图片）
 * @param url 图片URL
 * @returns 安全的图片URL
 */
export const getSecureImageUrl = (url: string): string => {
  if (!url) return url

  // 对于Twitter的所有图片，使用代理服务
  if (url.includes('pbs.twimg.com')) {
    const encodedUrl = encodeURIComponent(url)
    return `https://images.weserv.nl/?url=${encodedUrl}&output=webp`
  }

  // 对于其他可能有CORS问题的图片服务，也可以添加代理
  if (url.includes('twitter.com') || url.includes('x.com')) {
    const encodedUrl = encodeURIComponent(url)
    return `https://images.weserv.nl/?url=${encodedUrl}&output=webp`
  }

  return getSecureUrl(url)
}