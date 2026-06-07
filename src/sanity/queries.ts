import { groq } from 'next-sanity';

export const postsQuery = groq`
  *[_type == "post" && defined(slug.current)]
  | order(publishedAt desc, _createdAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    category,
    publishedAt,
    seoTitle,
    seoDescription,
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    category,
    publishedAt,
    body,
    seoTitle,
    seoDescription,
  }
`;

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)] { "slug": slug.current }
`;

export const typographyQuery = groq`
  *[_type == "typographySettings" && _id == "typographySettings"][0] {
    h1Desktop, h2Desktop, h3Desktop, bodyDesktop, smallDesktop, btnDesktop, cardTitleDesktop, cardDescDesktop,
    h1Mobile, h2Mobile, h3Mobile, bodyMobile, smallMobile, btnMobile,
    blogH1, blogH2, blogH3, blogBody,
    lineHeightBody, lineHeightHeading, headingWeight, bodyWeight,
  }
`;
