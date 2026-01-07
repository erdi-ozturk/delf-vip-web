import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Vito Transfer Yönetimi')
    .items([
      // Sadece bizim tanımladığımız 'tour' (Turlar) kısmını göster
      S.documentTypeListItem('tour').title('Turlar & Hizmetler'),
      
      // Geriye kalan (olur da eklersek) diğer her şeyi otomatik listele
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['tour'].includes(item.getId()!),
      ),
    ])