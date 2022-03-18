// https://github.com/biolink/biolink-model/blob/master/biolink-model.shexj
export const biolinkShex = {
  "type": "Schema",
  "@context": [
    "http://www.w3.org/ns/shex.jsonld",
    {
      "@base": "https://w3id.org/biolink/vocab/"
    }
  ],
  "shapes": [
    {
      "type": "ShapeOr",
      "id": "https://w3id.org/biolink/vocab/Association",
      "label": "Association",
    },
    {
      "type": "Shape",
      "id": "https://w3id.org/biolink/vocab/ChemicalToDiseaseOrPhenotypicFeatureAssociation",
      "label": "Chemical To Disease Or Phenotypic Feature Association",
    },
    {
      "type": "Shape",
      "id": "https://w3id.org/biolink/vocab/DiseaseToPhenotypicFeatureAssociation",
      "label": "Disease To Phenotypic Feature Association",
    },
    {
      "type": "Shape",
      "id": "https://w3id.org/biolink/vocab/ChemicalToChemicalAssociation",
      "label": "Chemical To Chemical Association",
    },
  ]
}
