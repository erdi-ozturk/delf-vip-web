import { type SchemaTypeDefinition } from 'sanity'
import tour from './tour'
import homepage from './homepage'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [tour, homepage],
}