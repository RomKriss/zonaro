import { sanityClient } from '@/sanity/client';
import { typographyQuery } from '@/sanity/queries';

// Defaults — used when Sanity document doesn't exist yet
const DEFAULTS = {
  h1Desktop: '40px', h2Desktop: '32px', h3Desktop: '26px',
  bodyDesktop: '18px', smallDesktop: '14px', btnDesktop: '16px',
  cardTitleDesktop: '20px', cardDescDesktop: '14px',
  h1Mobile: '28px', h2Mobile: '24px', h3Mobile: '20px',
  bodyMobile: '16px', smallMobile: '13px', btnMobile: '15px',
  blogH1: '36px', blogH2: '28px', blogH3: '22px', blogBody: '18px',
  lineHeightBody: '1.7', lineHeightHeading: '1.2',
  headingWeight: '700', bodyWeight: '400',
};

export async function TypographyInjector() {
  let t = DEFAULTS;
  try {
    const data = await sanityClient.fetch(typographyQuery, {}, { next: { revalidate: 300 } });
    if (data) t = { ...DEFAULTS, ...data };
  } catch {
    // use defaults silently
  }

  const css = `
    :root {
      --ty-h1: ${t.h1Desktop};
      --ty-h2: ${t.h2Desktop};
      --ty-h3: ${t.h3Desktop};
      --ty-body: ${t.bodyDesktop};
      --ty-small: ${t.smallDesktop};
      --ty-btn: ${t.btnDesktop};
      --ty-card-title: ${t.cardTitleDesktop};
      --ty-card-desc: ${t.cardDescDesktop};
      --ty-blog-h1: ${t.blogH1};
      --ty-blog-h2: ${t.blogH2};
      --ty-blog-h3: ${t.blogH3};
      --ty-blog-body: ${t.blogBody};
      --ty-lh-body: ${t.lineHeightBody};
      --ty-lh-heading: ${t.lineHeightHeading};
      --ty-fw-heading: ${t.headingWeight};
      --ty-fw-body: ${t.bodyWeight};
    }
    @media (max-width: 768px) {
      :root {
        --ty-h1: ${t.h1Mobile};
        --ty-h2: ${t.h2Mobile};
        --ty-h3: ${t.h3Mobile};
        --ty-body: ${t.bodyMobile};
        --ty-small: ${t.smallMobile};
        --ty-btn: ${t.btnMobile};
        --ty-blog-h1: ${t.h1Mobile};
        --ty-blog-h2: ${t.h2Mobile};
        --ty-blog-h3: ${t.h3Mobile};
        --ty-blog-body: ${t.bodyMobile};
      }
    }
    .blog-content {
      font-size: var(--ty-blog-body);
      line-height: var(--ty-lh-body);
      font-weight: var(--ty-fw-body);
    }
    .blog-content h1 {
      font-size: var(--ty-blog-h1);
      line-height: var(--ty-lh-heading);
      font-weight: var(--ty-fw-heading);
      margin-top: 2rem;
      margin-bottom: 1rem;
    }
    .blog-content h2 {
      font-size: var(--ty-blog-h2);
      line-height: var(--ty-lh-heading);
      font-weight: var(--ty-fw-heading);
      margin-top: 2.5rem;
      margin-bottom: 0.75rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e2e8f0;
    }
    .blog-content h3 {
      font-size: var(--ty-blog-h3);
      line-height: var(--ty-lh-heading);
      font-weight: var(--ty-fw-heading);
      margin-top: 2rem;
      margin-bottom: 0.5rem;
    }
    .blog-content p {
      margin-bottom: 1.5rem;
      line-height: var(--ty-lh-body);
    }
    .blog-content ul, .blog-content ol {
      margin: 1.25rem 0 1.5rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .blog-content li {
      line-height: var(--ty-lh-body);
    }
    .blog-content blockquote {
      border-left: 4px solid #1e40af;
      padding: 0.75rem 1.25rem;
      margin: 1.5rem 0;
      background: #eff6ff;
      border-radius: 0 8px 8px 0;
      font-style: italic;
      color: #374151;
    }
    .blog-content strong { font-weight: 700; }
    .blog-content a { color: #1e40af; text-decoration: underline; }
    .blog-content a:hover { color: #1d3d8f; }
    .blog-content code {
      background: #f1f5f9;
      color: #1e40af;
      padding: 0.15em 0.4em;
      border-radius: 4px;
      font-size: 0.9em;
    }
    .blog-content img { border-radius: 12px; margin: 1.5rem 0; }
    .blog-content hr { border: none; border-top: 1px solid #e2e8f0; margin: 2rem 0; }
  `.trim();

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
