import { defineField, defineType } from 'sanity';

const SIZE_OPTIONS = [
  { title: '12px', value: '12px' },
  { title: '13px', value: '13px' },
  { title: '14px', value: '14px' },
  { title: '15px', value: '15px' },
  { title: '16px', value: '16px' },
  { title: '18px', value: '18px' },
  { title: '20px', value: '20px' },
  { title: '22px', value: '22px' },
  { title: '24px', value: '24px' },
  { title: '26px', value: '26px' },
  { title: '28px', value: '28px' },
  { title: '30px', value: '30px' },
  { title: '32px', value: '32px' },
  { title: '36px', value: '36px' },
  { title: '40px', value: '40px' },
  { title: '44px', value: '44px' },
  { title: '48px', value: '48px' },
  { title: '56px', value: '56px' },
  { title: '64px', value: '64px' },
];

const WEIGHT_OPTIONS = [
  { title: 'Normal (400)', value: '400' },
  { title: 'Medium (500)', value: '500' },
  { title: 'Semibold (600)', value: '600' },
  { title: 'Bold (700)', value: '700' },
  { title: 'Extrabold (800)', value: '800' },
];

const LH_OPTIONS = [
  { title: '1.2 (compact)', value: '1.2' },
  { title: '1.3', value: '1.3' },
  { title: '1.4', value: '1.4' },
  { title: '1.5 (normal)', value: '1.5' },
  { title: '1.6', value: '1.6' },
  { title: '1.7', value: '1.7' },
  { title: '1.8 (relaxed)', value: '1.8' },
];

function sizeField(name: string, title: string, defaultValue: string) {
  return defineField({
    name,
    title,
    type: 'string',
    initialValue: defaultValue,
    options: { list: SIZE_OPTIONS, layout: 'radio', direction: 'horizontal' },
  });
}

export const typographySettingsSchema = defineType({
  name: 'typographySettings',
  title: 'Setări Tipografie',
  type: 'document',
  groups: [
    { name: 'desktop', title: '🖥️ Desktop' },
    { name: 'mobile', title: '📱 Mobil' },
    { name: 'blog', title: '📝 Blog' },
    { name: 'other', title: '⚙️ Alte setări' },
  ],
  fields: [
    // ── Desktop ────────────────────────────────────────────
    { ...sizeField('h1Desktop', 'H1 – Desktop', '40px'), group: 'desktop' },
    { ...sizeField('h2Desktop', 'H2 – Desktop', '32px'), group: 'desktop' },
    { ...sizeField('h3Desktop', 'H3 – Desktop', '26px'), group: 'desktop' },
    { ...sizeField('bodyDesktop', 'Paragraf – Desktop', '18px'), group: 'desktop' },
    { ...sizeField('smallDesktop', 'Text mic – Desktop', '14px'), group: 'desktop' },
    { ...sizeField('btnDesktop', 'Butoane – Desktop', '16px'), group: 'desktop' },
    { ...sizeField('cardTitleDesktop', 'Titlu card – Desktop', '20px'), group: 'desktop' },
    { ...sizeField('cardDescDesktop', 'Descriere card – Desktop', '14px'), group: 'desktop' },

    // ── Mobile ─────────────────────────────────────────────
    { ...sizeField('h1Mobile', 'H1 – Mobil', '28px'), group: 'mobile' },
    { ...sizeField('h2Mobile', 'H2 – Mobil', '24px'), group: 'mobile' },
    { ...sizeField('h3Mobile', 'H3 – Mobil', '20px'), group: 'mobile' },
    { ...sizeField('bodyMobile', 'Paragraf – Mobil', '16px'), group: 'mobile' },
    { ...sizeField('smallMobile', 'Text mic – Mobil', '13px'), group: 'mobile' },
    { ...sizeField('btnMobile', 'Butoane – Mobil', '15px'), group: 'mobile' },

    // ── Blog specific ──────────────────────────────────────
    { ...sizeField('blogH1', 'Blog H1', '36px'), group: 'blog' },
    { ...sizeField('blogH2', 'Blog H2', '28px'), group: 'blog' },
    { ...sizeField('blogH3', 'Blog H3', '22px'), group: 'blog' },
    { ...sizeField('blogBody', 'Blog paragraf', '18px'), group: 'blog' },

    // ── Other settings ─────────────────────────────────────
    defineField({
      name: 'lineHeightBody',
      title: 'Line height – text',
      type: 'string',
      group: 'other',
      initialValue: '1.7',
      options: { list: LH_OPTIONS, layout: 'radio', direction: 'horizontal' },
    }),
    defineField({
      name: 'lineHeightHeading',
      title: 'Line height – titluri',
      type: 'string',
      group: 'other',
      initialValue: '1.2',
      options: { list: LH_OPTIONS, layout: 'radio', direction: 'horizontal' },
    }),
    defineField({
      name: 'headingWeight',
      title: 'Grosime titluri (font-weight)',
      type: 'string',
      group: 'other',
      initialValue: '700',
      options: { list: WEIGHT_OPTIONS, layout: 'radio', direction: 'horizontal' },
    }),
    defineField({
      name: 'bodyWeight',
      title: 'Grosime text normal',
      type: 'string',
      group: 'other',
      initialValue: '400',
      options: { list: WEIGHT_OPTIONS, layout: 'radio', direction: 'horizontal' },
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Setări Tipografie', subtitle: 'Font sizes, line-height, font-weight' }),
  },
});
