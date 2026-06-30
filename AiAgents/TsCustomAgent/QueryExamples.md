# Known-good TS query examples (use as templates)

## 1) Schema probe (run first)
```ts
export function run(ctx: any) {
  const member0 = ctx.members?.[0] ?? null;
  const pr0 = ctx.pullRequests?.[0] ?? null;
  const issue0 = ctx.issues?.[0] ?? null;
  const link0 = ctx.teamGraph?.links?.[0] ?? null;

  return {
    counts: {
      members: ctx.members?.length ?? 0,
      pullRequests: ctx.pullRequests?.length ?? 0,
      issues: ctx.issues?.length ?? 0,
      links: ctx.teamGraph?.links?.length ?? 0,
    },
    sampleKeys: {
      memberKeys: member0 ? Object.keys(member0) : [],
      prKeys: pr0 ? Object.keys(pr0) : [],
      issueKeys: issue0 ? Object.keys(issue0) : [],
      linkKeys: link0 ? Object.keys(link0) : [],
    }
  };
}
```

## 2) Top authors by PR count (from PRs, not MembersModel)
```ts
export function run(ctx: any) {
  const counts = new Map<string, number>();
  for (const pr of ctx.pullRequests ?? []) {
    const u = pr?.createdBy?.login;
    if (!u) continue;
    counts.set(u, (counts.get(u) ?? 0) + 1);
  }
  const top = [...counts.entries()]
    .sort((a,b) => b[1]-a[1])
    .slice(0, 10)
    .map(([user, prCount]) => ({ user, prCount }));
  return { top };
}
```

## 3) Comments per member (from PR comments)
```ts
export function run(ctx: any) {
  const counts = new Map<string, number>();
  for (const pr of ctx.pullRequests ?? []) {
    for (const c of pr.comments ?? []) {
      const u = c?.author?.login;
      if (!u) continue;
      counts.set(u, (counts.get(u) ?? 0) + 1);
    }
  }
  const top = [...counts.entries()]
    .sort((a,b) => b[1]-a[1])
    .slice(0, 10)
    .map(([user, comments]) => ({ user, comments }));
  return { top };
}
```

## 4) Reviews per member (from PR reviews)
```ts
export function run(ctx: any) {
  const counts = new Map<string, number>();
  for (const pr of ctx.pullRequests ?? []) {
    for (const r of pr.reviews ?? []) {
      const u = r?.user?.login;
      if (!u) continue;
      counts.set(u, (counts.get(u) ?? 0) + 1);
    }
  }
  const top = [...counts.entries()]
    .sort((a,b) => b[1]-a[1])
    .slice(0, 10)
    .map(([user, reviews]) => ({ user, reviews }));
  return { top };
}
```

## 5) PR complexity proxy (top 10 most complex)
```ts
// PURPOSE: PR complexity proxy - top 10 most complex PRs
export function run(ctx: any) {
  function prComplexity(pr: any): number {
    const changedFiles = pr?.changedFiles ?? 0;
    const commits = pr?.commits?.length ?? 0;
    const comments = pr?.comments?.length ?? 0;
    const reviews = pr?.reviews?.length ?? 0;

    // Metadata-only proxy (no code): stable across projects.
    return changedFiles + 2 * commits + 0.5 * comments + 1.0 * reviews;
  }

  const rows = (ctx.pullRequests ?? []).map((pr: any) => ({
    number: pr.number,
    author: pr?.createdBy?.login ?? null,
    changedFiles: pr?.changedFiles ?? 0,
    commits: pr?.commits?.length ?? 0,
    comments: pr?.comments?.length ?? 0,
    reviews: pr?.reviews?.length ?? 0,
    complexity: prComplexity(pr),
  }));

  const top = rows.sort((a: any, b: any) => b.complexity - a.complexity).slice(0, 10);
  return { top };
}
```

## 6) Complexity buckets vs collaboration (LOW/MEDIUM/HIGH)
```ts
// PURPOSE: Complexity buckets vs collaboration intensity (comments/reviews)
export function run(ctx: any) {
  function prComplexity(pr: any): number {
    const changedFiles = pr?.changedFiles ?? 0;
    const commits = pr?.commits?.length ?? 0;
    const comments = pr?.comments?.length ?? 0;
    const reviews = pr?.reviews?.length ?? 0;
    return changedFiles + 2 * commits + 0.5 * comments + 1.0 * reviews;
  }

  const prs = (ctx.pullRequests ?? []).map((pr: any) => {
    const comments = pr?.comments?.length ?? 0;
    const reviews = pr?.reviews?.length ?? 0;
    return {
      number: pr.number,
      complexity: prComplexity(pr),
      comments,
      reviews,
      interaction: comments + reviews,
      changedFiles: pr?.changedFiles ?? 0,
      commits: pr?.commits?.length ?? 0,
    };
  });

  const scores = prs.map((p: any) => p.complexity).sort((a: number, b: number) => a - b);
  if (scores.length === 0) return { error: "No PRs available." };

  // Quantile thresholds (33% / 66%) so buckets adapt to project size.
  const q = (p: number) => scores[Math.floor(p * (scores.length - 1))];
  const t1 = q(0.33);
  const t2 = q(0.66);

  function bucket(c: number): "LOW" | "MEDIUM" | "HIGH" {
    if (c <= t1) return "LOW";
    if (c <= t2) return "MEDIUM";
    return "HIGH";
  }

  const groups: Record<string, any[]> = { LOW: [], MEDIUM: [], HIGH: [] };
  for (const pr of prs) groups[bucket(pr.complexity)].push(pr);

  function avg(arr: any[], key: string): number {
    if (arr.length === 0) return 0;
    return arr.reduce((s, x) => s + (x[key] ?? 0), 0) / arr.length;
  }

  const summary = (["LOW", "MEDIUM", "HIGH"] as const).map((b) => ({
    bucket: b,
    n: groups[b].length,
    avgComplexity: avg(groups[b], "complexity"),
    avgComments: avg(groups[b], "comments"),
    avgReviews: avg(groups[b], "reviews"),
    avgInteraction: avg(groups[b], "interaction"),
    avgChangedFiles: avg(groups[b], "changedFiles"),
    avgCommits: avg(groups[b], "commits"),
  }));

  return { thresholds: { t1, t2 }, summary };
}
```