'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { postSchema } from './src/sanity/schemas/post';
import { typographySettingsSchema } from './src/sanity/schemas/typographySettings';

export default defineConfig({
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('ZonaRo CMS')
          .items([
            S.listItem()
              .title('Articole Blog')
              .schemaType('post')
              .child(S.documentTypeList('post').title('Articole Blog')),
            S.divider(),
            S.listItem()
              .title('⚙️ Setări Tipografie')
              .id('typographySettings')
              .child(
                S.document()
                  .schemaType('typographySettings')
                  .documentId('typographySettings')
                  .title('Setări Tipografie')
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: [postSchema, typographySettingsSchema],
  },
});
