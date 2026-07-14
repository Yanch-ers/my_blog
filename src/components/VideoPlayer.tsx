/**
 * VideoPlayer 组件 - 预留位置
 *
 * 后期实现时：
 * 1. 接入视频 URL (来自腾讯云 COS 或其他 CDN)
 * 2. 实现自定义播放器 UI 或使用原生 <video> 标签
 * 3. 支持播放控制、进度条、音量等
 *
 * 使用方式 (文章详情页中条件渲染):
 * {post.data.video && <VideoPlayer client:load src={post.data.video} />}
 */

interface Props {
  src: string;
  poster?: string;
}

export default function VideoPlayer({ src, poster }: Props) {
  return (
    <div className="my-6 overflow-hidden rounded-lg border border-[var(--color-border)]">
      <video
        controls
        preload="metadata"
        poster={poster}
        className="w-full"
      >
        <source src={src} type="video/mp4" />
        您的浏览器不支持视频播放。
      </video>
    </div>
  );
}
