import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'tour',
  title: 'Turlar & Hizmetler',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tur Başlığı',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Kısmı (Otomatik Oluşur)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Kapak Fotoğrafı',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'price',
      title: 'Başlangıç Fiyatı (€)',
      type: 'number',
    }),
    defineField({
      name: 'duration',
      title: 'Süre (Örn: Tam Gün)',
      type: 'string',
    }),
    defineField({
      name: 'whatsappMessage',
      title: 'WhatsApp Mesajı',
      description: 'Müşteri butona basınca otomatik yazılacak mesaj',
      type: 'string',
    }),
  ],
})