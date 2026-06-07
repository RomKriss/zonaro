import { defineField, defineType } from 'sanity';

export const postSchema = defineType({
  name: 'post',
  title: 'Articol Blog',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titlu',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug URL',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Rezumat scurt',
      type: 'text',
      rows: 3,
      description: 'Apare în lista de articole și în meta description dacă seoDescription lipsește.',
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagine principală',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Text alternativ (alt)',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'category',
      title: 'Categorie',
      type: 'string',
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
    }),
    defineField({
      name: 'body',
      title: 'Conținut articol',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Text alternativ' }),
            defineField({ name: 'caption', type: 'string', title: 'Legendă' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Lasă gol pentru a folosi titlul articolului.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
      description: 'Lasă gol pentru a folosi rezumatul articolului.',
      validation: (r) => r.max(160),
    }),
  ],
  preview: {
    select: { title: 'title', media: 'mainImage', category: 'category', publishedAt: 'publishedAt' },
    prepare({ title, media, category, publishedAt }) {
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString('ro-RO') : 'Nepublicat';
      return { title, media, subtitle: `${category ?? '—'} · ${date}` };
    },
  },
  orderings: [
    { title: 'Data publicării (nou → vechi)', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
});
