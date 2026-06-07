import { defineField, defineType } from 'sanity';

export const postSchema = defineType({
  name: 'post',
  title: 'Articol Blog',
  type: 'document',
  groups: [
    { name: 'content', title: '📝 Conținut', default: true },
    { name: 'meta', title: '📋 Detalii' },
    { name: 'seo', title: '🔍 SEO' },
  ],
  fields: [
    // ── Conținut principal ─────────────────────────────────
    defineField({
      name: 'title',
      title: 'Titlu articol',
      type: 'string',
      group: 'content',
      description: '✅ Obligatoriu. Acesta apare ca H1 pe pagina articolului.',
      validation: (r) =>
        r.required().error('Titlul este obligatoriu înainte de publicare.'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug URL',
      type: 'slug',
      group: 'content',
      description: '✅ Obligatoriu. Apasă butonul "Generate" pentru a crea automat din titlu.',
      options: { source: 'title', maxLength: 96 },
      validation: (r) =>
        r.required().error('Slug-ul este obligatoriu. Apasă "Generate" de lângă câmp.'),
    }),
    defineField({
      name: 'body',
      title: 'Conținut articol',
      type: 'array',
      group: 'content',
      description: 'Conținutul principal al articolului.',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Citat', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Underline', value: 'underline' },
              { title: 'Strike', value: 'strike-through' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  { name: 'href', type: 'url', title: 'URL' },
                  { name: 'blank', type: 'boolean', title: 'Deschide în tab nou', initialValue: false },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Text alternativ (alt)' }),
            defineField({ name: 'caption', type: 'string', title: 'Legendă (opțional)' }),
          ],
        },
      ],
    }),

    // ── Detalii articol ────────────────────────────────────
    defineField({
      name: 'excerpt',
      title: 'Rezumat scurt',
      type: 'text',
      rows: 3,
      group: 'meta',
      description: 'Opțional. Apare în lista de articole și ca meta description dacă SEO Description lipsește.',
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagine principală',
      type: 'image',
      group: 'meta',
      description: 'Opțional. Imagine afișată în header-ul articolului și în lista blog.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Text alternativ (alt)',
          type: 'string',
          description: 'Descrie imaginea pentru accesibilitate și SEO.',
        }),
      ],
    }),
    defineField({
      name: 'category',
      title: 'Categorie',
      type: 'string',
      group: 'meta',
      description: 'Opțional. Ajută la filtrarea articolelor.',
      options: {
        list: [
          { title: 'Ghiduri', value: 'ghiduri' },
          { title: 'Sfaturi', value: 'sfaturi' },
          { title: 'Noutăți', value: 'noutati' },
          { title: 'Afaceri locale', value: 'afaceri-locale' },
          { title: 'Marketing', value: 'marketing' },
        ],
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data publicării',
      type: 'datetime',
      group: 'meta',
      description: 'Se completează automat la publicare dacă e lăsat gol.',
      initialValue: () => new Date().toISOString(),
    }),

    // ── SEO (toate opționale, nu blochează publicarea) ─────
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Opțional. Lasă gol pentru a folosi titlul articolului.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
      group: 'seo',
      description: 'Opțional. Max 160 caractere. Lasă gol pentru a folosi rezumatul.',
      validation: (r) => r.max(160).warning('Recomandat: sub 160 de caractere pentru Google.'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      category: 'category',
      publishedAt: 'publishedAt',
    },
    prepare({ title, media, category, publishedAt }) {
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString('ro-RO')
        : '⚠️ Nepublicat';
      return {
        title: title ?? '(fără titlu)',
        media,
        subtitle: `${category ?? '—'} · ${date}`,
      };
    },
  },
  orderings: [
    {
      title: 'Data publicării (nou → vechi)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
});
