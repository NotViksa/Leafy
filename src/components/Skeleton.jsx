function SkeletonLine({ width = "100%", height = 12 }) {
  return <span className="skeleton" style={{ width, height }} aria-hidden="true" />;
}

export function PostCardSkeleton() {
  return (
    <article className="post post-skeleton" aria-hidden="true">
      <div className="post-body">
        <div className="post-meta">
          <SkeletonLine width="70px" height={14} />
          <SkeletonLine width="90px" height={10} />
        </div>
        <SkeletonLine width="70%" height={22} />
        <div style={{ marginTop: 12 }}>
          <SkeletonLine width="100%" height={180} />
        </div>
        <div style={{ marginTop: 12 }}>
          <SkeletonLine width="90%" height={12} />
          <div style={{ marginTop: 6 }}>
            <SkeletonLine width="60%" height={12} />
          </div>
        </div>
      </div>
    </article>
  );
}

export function DetailsSkeleton() {
  return (
    <div className="details details-skeleton" aria-hidden="true">
      <div style={{ marginBottom: 20 }}>
        <SkeletonLine width="80px" height={10} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <SkeletonLine width="140px" height={12} />
        <div style={{ marginTop: 12 }}>
          <SkeletonLine width="85%" height={42} />
        </div>
        <div style={{ marginTop: 12 }}>
          <SkeletonLine width="40%" height={16} />
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <SkeletonLine width="100%" height={380} />
      </div>
      <SkeletonLine width="100%" height={14} />
      <div style={{ marginTop: 10 }}>
        <SkeletonLine width="92%" height={14} />
      </div>
      <div style={{ marginTop: 10 }}>
        <SkeletonLine width="70%" height={14} />
      </div>
    </div>
  );
}