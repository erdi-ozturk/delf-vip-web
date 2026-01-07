import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homepage',
  title: 'Site Ayarları & Kapak',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Başlığı (Hero Başlık)',
      type: 'string', // Örn: Konforlu Yolculuk...
    }),
    defineField({
      name: 'heroImage',
      title: 'Kapak Fotoğrafı (Hero)',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
})