const BIOLINK = 'https://w3id.org/biolink/vocab/'
// const IDO = 'https://identifiers.org/'
// const RDFS = 'http://www.w3.org/2000/01/rdf-schema#'

// TODO: complete the list of ents?
// RGB colors: https://www.rapidtables.com/web/color/RGB_Color.html
export const ents = [
  {
    type: 'Association',
    label: 'Association',
    id: BIOLINK + 'Association',
    curie: 'biolink:Association',
    color: {r: 67, g: 198, b: 252}
  }, // Light blue
  {
    type: 'ChemicalEntity',
    label: 'Chemical Entity',
    id: BIOLINK + 'ChemicalEntity',
    curie: 'biolink:ChemicalEntity',
    color: {r: 255, g: 178, b: 102}
  }, // Orange
  {type: 'Drug', label: 'Drug', id: BIOLINK + 'Drug', curie: 'biolink:Drug', color: {r: 255, g: 102, b: 102}}, // Red
  {
    type: 'DiseaseOrPhenotypicFeature',
    label: 'Disease or Phenotypic Feature',
    id: BIOLINK + 'DiseaseOrPhenotypicFeature',
    curie: 'biolink:DiseaseOrPhenotypicFeature',
    color: {r: 47, g: 187, b: 171}
  }, // Blue green
  {
    type: 'Disease',
    label: 'Disease',
    id: BIOLINK + 'Disease',
    curie: 'biolink:Disease',
    color: {r: 47, g: 187, b: 171}
  }, // Blue green
  {
    type: 'GeneOrGeneProduct',
    label: 'Gene or Gene Product',
    id: BIOLINK + 'GeneOrGeneProduct',
    curie: 'biolink:GeneOrGeneProduct',
    color: {r: 218, g: 112, b: 214}
  }, // Purple
  {
    type: 'GeneProduct',
    label: 'Gene Product',
    id: BIOLINK + 'GeneProduct',
    curie: 'biolink:GeneProduct',
    color: {r: 218, g: 112, b: 214}
  }, // Purple
  {
    type: 'SequenceVariant',
    label: 'Sequence Variant',
    id: BIOLINK + 'SequenceVariant',
    curie: 'biolink:SequenceVariant',
    color: {r: 166, g: 226, b: 45}
  }, // Light green
  {type: 'Cohort', label: 'Cohort', id: BIOLINK + 'Cohort', curie: 'biolink:Cohort', color: {r: 204, g: 204, b: 0}}, // Yellow
  {
    type: 'StudyPopulation',
    label: 'Study Population',
    id: BIOLINK + 'StudyPopulation',
    curie: 'biolink:StudyPopulation',
    color: {r: 204, g: 204, b: 0}
  }, // Yellow
  {
    type: 'PopulationOfIndividualOrganisms',
    label: 'Population of Individual Organisms ',
    id: BIOLINK + 'PopulationOfIndividualOrganisms ',
    curie: 'biolink:PopulationOfIndividualOrganisms ',
    color: {r: 204, g: 204, b: 0}
  }, // Yellow
  {
    type: 'OrganismTaxon',
    label: 'Organism Taxon',
    id: BIOLINK + 'OrganismTaxon',
    curie: 'biolink:OrganismTaxon',
    color: {r: 204, g: 204, b: 0}
  }, // Yellow
  {
    type: 'NamedEntity',
    label: 'NamedEntity',
    id: BIOLINK + 'NamedEntity',
    curie: 'biolink:NamedEntity',
    color: {r: 255, g: 102, b: 102}
  } // Red
]

// https://biolink.github.io/biolink-model/docs/predicates.html
export const predicatesList = [
  {id: 'https://w3id.org/biolink/vocab/treats', curie: 'biolink:treats', label: 'Treats', type: 'BioLink'},
  {id: 'https://w3id.org/biolink/vocab/treated_by', curie: 'biolink:treated_by', label: 'Treated by', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/interacts_with',
    curie: 'biolink:interacts_with',
    label: 'Interacts with',
    type: 'BioLink'
  },

  {
    id: 'https://w3id.org/biolink/vocab/abundance_affected_by',
    curie: 'biolink:abundance_affected_by',
    label: 'abundance affected by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/abundance_decreased_by',
    curie: 'biolink:abundance_decreased_by',
    label: 'abundance decreased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/abundance_increased_by',
    curie: 'biolink:abundance_increased_by',
    label: 'abundance increased by',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/active_in', curie: 'biolink:active_in', label: 'active in', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/actively_involved_in',
    curie: 'biolink:actively_involved_in',
    label: 'actively involved in',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/actively_involves',
    curie: 'biolink:actively_involves',
    label: 'actively involves',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/activity_affected_by',
    curie: 'biolink:activity_affected_by',
    label: 'activity affected by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/activity_decreased_by',
    curie: 'biolink:activity_decreased_by',
    label: 'activity decreased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/activity_increased_by',
    curie: 'biolink:activity_increased_by',
    label: 'activity increased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/acts_upstream_of',
    curie: 'biolink:acts_upstream_of',
    label: 'acts upstream of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/acts_upstream_of_negative_effect',
    curie: 'biolink:acts_upstream_of_negative_effect',
    label: 'acts upstream of negative effect',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/acts_upstream_of_or_within',
    curie: 'biolink:acts_upstream_of_or_within',
    label: 'acts upstream of or within',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/acts_upstream_of_or_within_negative_effect',
    curie: 'biolink:acts_upstream_of_or_within_negative_effect',
    label: 'acts upstream of or within negative effect',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/acts_upstream_of_or_within_positive_effect',
    curie: 'biolink:acts_upstream_of_or_within_positive_effect',
    label: 'acts upstream of or within positive effect',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/acts_upstream_of_positive_effect',
    curie: 'biolink:acts_upstream_of_positive_effect',
    label: 'acts upstream of positive effect',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/adverse_event_caused_by',
    curie: 'biolink:adverse_event_caused_by',
    label: 'adverse event caused by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/affected_by',
    curie: 'biolink:affected_by',
    label: 'affected by',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/affects', curie: 'biolink:affects', label: 'affects', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/affects_abundance_of',
    curie: 'biolink:affects_abundance_of',
    label: 'affects abundance of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/affects_activity_of',
    curie: 'biolink:affects_activity_of',
    label: 'affects activity of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/affects_degradation_of',
    curie: 'biolink:affects_degradation_of',
    label: 'affects degradation of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/affects_expression_in',
    curie: 'biolink:affects_expression_in',
    label: 'affects expression in',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/affects_expression_of',
    curie: 'biolink:affects_expression_of',
    label: 'affects expression of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/affects_folding_of',
    curie: 'biolink:affects_folding_of',
    label: 'affects folding of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/affects_localization_of',
    curie: 'biolink:affects_localization_of',
    label: 'affects localization of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/affects_metabolic_processing_of',
    curie: 'biolink:affects_metabolic_processing_of',
    label: 'affects metabolic processing of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/affects_molecular_modification_of',
    curie: 'biolink:affects_molecular_modification_of',
    label: 'affects molecular modification of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/affects_mutation_rate_of',
    curie: 'biolink:affects_mutation_rate_of',
    label: 'affects mutation rate of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/affects_response_to',
    curie: 'biolink:affects_response_to',
    label: 'affects response to',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/affects_risk_for',
    curie: 'biolink:affects_risk_for',
    label: 'affects risk for',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/affects_secretion_of',
    curie: 'biolink:affects_secretion_of',
    label: 'affects secretion of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/affects_splicing_of',
    curie: 'biolink:affects_splicing_of',
    label: 'affects splicing of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/affects_stability_of',
    curie: 'biolink:affects_stability_of',
    label: 'affects stability of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/affects_synthesis_of',
    curie: 'biolink:affects_synthesis_of',
    label: 'affects synthesis of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/affects_transport_of',
    curie: 'biolink:affects_transport_of',
    label: 'affects transport of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/affects_uptake_of',
    curie: 'biolink:affects_uptake_of',
    label: 'affects uptake of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/ameliorates',
    curie: 'biolink:ameliorates',
    label: 'ameliorates',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/approved_for_treatment_by',
    curie: 'biolink:approved_for_treatment_by',
    label: 'approved for treatment by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/approved_to_treat',
    curie: 'biolink:approved_to_treat',
    label: 'approved to treat',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/associated_with',
    curie: 'biolink:associated_with',
    label: 'associated with',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/associated_with_resistance_to',
    curie: 'biolink:associated_with_resistance_to',
    label: 'associated with resistance to',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/associated_with_sensitivity_to',
    curie: 'biolink:associated_with_sensitivity_to',
    label: 'associated with sensitivity to',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/author', curie: 'biolink:author', label: 'author', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/biomarker_for',
    curie: 'biolink:biomarker_for',
    label: 'biomarker for',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/broad_match',
    curie: 'biolink:broad_match',
    label: 'broad match',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/capability_of',
    curie: 'biolink:capability_of',
    label: 'capability of',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/capable_of', curie: 'biolink:capable_of', label: 'capable of', type: 'BioLink'},
  {id: 'https://w3id.org/biolink/vocab/catalyzes', curie: 'biolink:catalyzes', label: 'catalyzes', type: 'BioLink'},
  {id: 'https://w3id.org/biolink/vocab/caused_by', curie: 'biolink:caused_by', label: 'caused by', type: 'BioLink'},
  {id: 'https://w3id.org/biolink/vocab/causes', curie: 'biolink:causes', label: 'causes', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/causes_adverse_event',
    curie: 'biolink:causes_adverse_event',
    label: 'causes adverse event',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/chemically_interacts_with',
    curie: 'biolink:chemically_interacts_with',
    label: 'chemically interacts with',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/chemically_similar_to',
    curie: 'biolink:chemically_similar_to',
    label: 'chemically similar to',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/close_match',
    curie: 'biolink:close_match',
    label: 'close match',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/coexists_with',
    curie: 'biolink:coexists_with',
    label: 'coexists with',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/coexpressed_with',
    curie: 'biolink:coexpressed_with',
    label: 'coexpressed with',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/colocalizes_with',
    curie: 'biolink:colocalizes_with',
    label: 'colocalizes with',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/completed_by',
    curie: 'biolink:completed_by',
    label: 'completed by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/composed_primarily_of',
    curie: 'biolink:composed_primarily_of',
    label: 'composed primarily of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/condition_associated_with_gene',
    curie: 'biolink:condition_associated_with_gene',
    label: 'condition associated with gene',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/consumed_by',
    curie: 'biolink:consumed_by',
    label: 'consumed by',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/consumes', curie: 'biolink:consumes', label: 'consumes', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/contains_process',
    curie: 'biolink:contains_process',
    label: 'contains process',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/contraindicated_for',
    curie: 'biolink:contraindicated_for',
    label: 'contraindicated for',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/contributes_to',
    curie: 'biolink:contributes_to',
    label: 'contributes to',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/contribution_from',
    curie: 'biolink:contribution_from',
    label: 'contribution from',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/contributor',
    curie: 'biolink:contributor',
    label: 'contributor',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/correlated_with',
    curie: 'biolink:correlated_with',
    label: 'correlated with',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/decreased_amount_in',
    curie: 'biolink:decreased_amount_in',
    label: 'decreased amount in',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/decreases_abundance_of',
    curie: 'biolink:decreases_abundance_of',
    label: 'decreases abundance of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/decreases_activity_of',
    curie: 'biolink:decreases_activity_of',
    label: 'decreases activity of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/decreases_degradation_of',
    curie: 'biolink:decreases_degradation_of',
    label: 'decreases degradation of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/decreases_expression_of',
    curie: 'biolink:decreases_expression_of',
    label: 'decreases expression of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/decreases_folding_of',
    curie: 'biolink:decreases_folding_of',
    label: 'decreases folding of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/decreases_localization_of',
    curie: 'biolink:decreases_localization_of',
    label: 'decreases localization of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/decreases_metabolic_processing_of',
    curie: 'biolink:decreases_metabolic_processing_of',
    label: 'decreases metabolic processing of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/decreases_molecular_interaction',
    curie: 'biolink:decreases_molecular_interaction',
    label: 'decreases molecular interaction',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/decreases_molecular_modification_of',
    curie: 'biolink:decreases_molecular_modification_of',
    label: 'decreases molecular modification of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/decreases_mutation_rate_of',
    curie: 'biolink:decreases_mutation_rate_of',
    label: 'decreases mutation rate of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/decreases_response_to',
    curie: 'biolink:decreases_response_to',
    label: 'decreases response to',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/decreases_secretion_of',
    curie: 'biolink:decreases_secretion_of',
    label: 'decreases secretion of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/decreases_splicing_of',
    curie: 'biolink:decreases_splicing_of',
    label: 'decreases splicing of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/decreases_stability_of',
    curie: 'biolink:decreases_stability_of',
    label: 'decreases stability of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/decreases_synthesis_of',
    curie: 'biolink:decreases_synthesis_of',
    label: 'decreases synthesis of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/decreases_transport_of',
    curie: 'biolink:decreases_transport_of',
    label: 'decreases transport of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/decreases_uptake_of',
    curie: 'biolink:decreases_uptake_of',
    label: 'decreases uptake of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/degradation_affected_by',
    curie: 'biolink:degradation_affected_by',
    label: 'degradation affected by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/degradation_decreased_by',
    curie: 'biolink:degradation_decreased_by',
    label: 'degradation decreased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/degradation_increased_by',
    curie: 'biolink:degradation_increased_by',
    label: 'degradation increased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/derives_from',
    curie: 'biolink:derives_from',
    label: 'derives from',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/derives_into',
    curie: 'biolink:derives_into',
    label: 'derives into',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/develops_from',
    curie: 'biolink:develops_from',
    label: 'develops from',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/develops_into',
    curie: 'biolink:develops_into',
    label: 'develops into',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/diagnoses', curie: 'biolink:diagnoses', label: 'diagnoses', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/directly_interacts_with',
    curie: 'biolink:directly_interacts_with',
    label: 'directly interacts with',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/disease_has_basis_in',
    curie: 'biolink:disease_has_basis_in',
    label: 'disease has basis in',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/disease_has_location',
    curie: 'biolink:disease_has_location',
    label: 'disease has location',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/disrupted_by',
    curie: 'biolink:disrupted_by',
    label: 'disrupted by',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/disrupts', curie: 'biolink:disrupts', label: 'disrupts', type: 'BioLink'},
  {id: 'https://w3id.org/biolink/vocab/editor', curie: 'biolink:editor', label: 'editor', type: 'BioLink'},
  {id: 'https://w3id.org/biolink/vocab/enabled_by', curie: 'biolink:enabled_by', label: 'enabled by', type: 'BioLink'},
  {id: 'https://w3id.org/biolink/vocab/enables', curie: 'biolink:enables', label: 'enables', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/entity_negatively_regulated_by_entity',
    curie: 'biolink:entity_negatively_regulated_by_entity',
    label: 'entity negatively regulated by entity',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/entity_negatively_regulates_entity',
    curie: 'biolink:entity_negatively_regulates_entity',
    label: 'entity negatively regulates entity',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/entity_positively_regulated_by_entity',
    curie: 'biolink:entity_positively_regulated_by_entity',
    label: 'entity positively regulated by entity',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/entity_positively_regulates_entity',
    curie: 'biolink:entity_positively_regulates_entity',
    label: 'entity positively regulates entity',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/entity_regulated_by_entity',
    curie: 'biolink:entity_regulated_by_entity',
    label: 'entity regulated by entity',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/entity_regulates_entity',
    curie: 'biolink:entity_regulates_entity',
    label: 'entity regulates entity',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/exacerbates',
    curie: 'biolink:exacerbates',
    label: 'exacerbates',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/exact_match',
    curie: 'biolink:exact_match',
    label: 'exact match',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/expressed_in',
    curie: 'biolink:expressed_in',
    label: 'expressed in',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/expresses', curie: 'biolink:expresses', label: 'expresses', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/expression_affected_by',
    curie: 'biolink:expression_affected_by',
    label: 'expression affected by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/expression_decreased_by',
    curie: 'biolink:expression_decreased_by',
    label: 'expression decreased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/expression_increased_by',
    curie: 'biolink:expression_increased_by',
    label: 'expression increased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/folding_affected_by',
    curie: 'biolink:folding_affected_by',
    label: 'folding affected by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/folding_decreased_by',
    curie: 'biolink:folding_decreased_by',
    label: 'folding decreased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/folding_increased_by',
    curie: 'biolink:folding_increased_by',
    label: 'folding increased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/food_component_of',
    curie: 'biolink:food_component_of',
    label: 'food component of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/gene_associated_with_condition',
    curie: 'biolink:gene_associated_with_condition',
    label: 'gene associated with condition',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/gene_product_of',
    curie: 'biolink:gene_product_of',
    label: 'gene product of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/genetic_association',
    curie: 'biolink:genetic_association',
    label: 'genetic association',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/genetically_interacts_with',
    curie: 'biolink:genetically_interacts_with',
    label: 'genetically interacts with',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_active_ingredient',
    curie: 'biolink:has_active_ingredient',
    label: 'has active ingredient',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_biomarker',
    curie: 'biolink:has_biomarker',
    label: 'has biomarker',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_catalyst',
    curie: 'biolink:has_catalyst',
    label: 'has catalyst',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_completed',
    curie: 'biolink:has_completed',
    label: 'has completed',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_contraindication',
    curie: 'biolink:has_contraindication',
    label: 'has contraindication',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_decreased_amount',
    curie: 'biolink:has_decreased_amount',
    label: 'has decreased amount',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_excipient',
    curie: 'biolink:has_excipient',
    label: 'has excipient',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_food_component',
    curie: 'biolink:has_food_component',
    label: 'has food component',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_frameshift_variant',
    curie: 'biolink:has_frameshift_variant',
    label: 'has frameshift variant',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_gene_product',
    curie: 'biolink:has_gene_product',
    label: 'has gene product',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_increased_amount',
    curie: 'biolink:has_increased_amount',
    label: 'has increased amount',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/has_input', curie: 'biolink:has_input', label: 'has input', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/has_manifestation',
    curie: 'biolink:has_manifestation',
    label: 'has manifestation',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_metabolite',
    curie: 'biolink:has_metabolite',
    label: 'has metabolite',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_missense_variant',
    curie: 'biolink:has_missense_variant',
    label: 'has missense variant',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_molecular_consequence',
    curie: 'biolink:has_molecular_consequence',
    label: 'has molecular consequence',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_nearby_variant',
    curie: 'biolink:has_nearby_variant',
    label: 'has nearby variant',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_negative_upstream_actor',
    curie: 'biolink:has_negative_upstream_actor',
    label: 'has negative upstream actor',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_negative_upstream_or_within_actor',
    curie: 'biolink:has_negative_upstream_or_within_actor',
    label: 'has negative upstream or within actor',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_non_coding_variant',
    curie: 'biolink:has_non_coding_variant',
    label: 'has non coding variant',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_nonsense_variant',
    curie: 'biolink:has_nonsense_variant',
    label: 'has nonsense variant',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_not_completed',
    curie: 'biolink:has_not_completed',
    label: 'has not completed',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_nutrient',
    curie: 'biolink:has_nutrient',
    label: 'has nutrient',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/has_output', curie: 'biolink:has_output', label: 'has output', type: 'BioLink'},
  {id: 'https://w3id.org/biolink/vocab/has_part', curie: 'biolink:has_part', label: 'has part', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/has_participant',
    curie: 'biolink:has_participant',
    label: 'has participant',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_phenotype',
    curie: 'biolink:has_phenotype',
    label: 'has phenotype',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_plasma_membrane_part',
    curie: 'biolink:has_plasma_membrane_part',
    label: 'has plasma membrane part',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_positive_upstream_actor',
    curie: 'biolink:has_positive_upstream_actor',
    label: 'has positive upstream actor',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_positive_upstream_or_within_actor',
    curie: 'biolink:has_positive_upstream_or_within_actor',
    label: 'has positive upstream or within actor',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_real_world_evidence_of_association_with',
    curie: 'biolink:has_real_world_evidence_of_association_with',
    label: 'has real world evidence of association with',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_sequence_location',
    curie: 'biolink:has_sequence_location',
    label: 'has sequence location',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_sequence_variant',
    curie: 'biolink:has_sequence_variant',
    label: 'has sequence variant',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_splice_site_variant',
    curie: 'biolink:has_splice_site_variant',
    label: 'has splice site variant',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_substrate',
    curie: 'biolink:has_substrate',
    label: 'has substrate',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_synonymous_variant',
    curie: 'biolink:has_synonymous_variant',
    label: 'has synonymous variant',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_upstream_actor',
    curie: 'biolink:has_upstream_actor',
    label: 'has upstream actor',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_upstream_or_within_actor',
    curie: 'biolink:has_upstream_or_within_actor',
    label: 'has upstream or within actor',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_variant_part',
    curie: 'biolink:has_variant_part',
    label: 'has variant part',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/homologous_to',
    curie: 'biolink:homologous_to',
    label: 'homologous to',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/in_cell_population_with',
    curie: 'biolink:in_cell_population_with',
    label: 'in cell population with',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/in_complex_with',
    curie: 'biolink:in_complex_with',
    label: 'in complex with',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/in_linkage_disequilibrium_with',
    curie: 'biolink:in_linkage_disequilibrium_with',
    label: 'in linkage disequilibrium with',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/in_pathway_with',
    curie: 'biolink:in_pathway_with',
    label: 'in pathway with',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/in_taxon', curie: 'biolink:in_taxon', label: 'in taxon', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/increased_amount_of',
    curie: 'biolink:increased_amount_of',
    label: 'increased amount of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/increases_abundance_of',
    curie: 'biolink:increases_abundance_of',
    label: 'increases abundance of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/increases_activity_of',
    curie: 'biolink:increases_activity_of',
    label: 'increases activity of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/increases_degradation_of',
    curie: 'biolink:increases_degradation_of',
    label: 'increases degradation of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/increases_expression_of',
    curie: 'biolink:increases_expression_of',
    label: 'increases expression of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/increases_folding_of',
    curie: 'biolink:increases_folding_of',
    label: 'increases folding of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/increases_localization_of',
    curie: 'biolink:increases_localization_of',
    label: 'increases localization of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/increases_metabolic_processing_of',
    curie: 'biolink:increases_metabolic_processing_of',
    label: 'increases metabolic processing of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/increases_molecular_interaction',
    curie: 'biolink:increases_molecular_interaction',
    label: 'increases molecular interaction',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/increases_molecular_modification_of',
    curie: 'biolink:increases_molecular_modification_of',
    label: 'increases molecular modification of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/increases_mutation_rate_of',
    curie: 'biolink:increases_mutation_rate_of',
    label: 'increases mutation rate of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/increases_response_to',
    curie: 'biolink:increases_response_to',
    label: 'increases response to',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/increases_secretion_of',
    curie: 'biolink:increases_secretion_of',
    label: 'increases secretion of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/increases_splicing_of',
    curie: 'biolink:increases_splicing_of',
    label: 'increases splicing of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/increases_stability_of',
    curie: 'biolink:increases_stability_of',
    label: 'increases stability of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/increases_synthesis_of',
    curie: 'biolink:increases_synthesis_of',
    label: 'increases synthesis of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/increases_transport_of',
    curie: 'biolink:increases_transport_of',
    label: 'increases transport of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/increases_uptake_of',
    curie: 'biolink:increases_uptake_of',
    label: 'increases uptake of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/is_active_ingredient_of',
    curie: 'biolink:is_active_ingredient_of',
    label: 'is active ingredient of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/is_diagnosed_by',
    curie: 'biolink:is_diagnosed_by',
    label: 'is diagnosed by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/is_excipient_of',
    curie: 'biolink:is_excipient_of',
    label: 'is excipient of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/is_frameshift_variant_of',
    curie: 'biolink:is_frameshift_variant_of',
    label: 'is frameshift variant of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/is_input_of',
    curie: 'biolink:is_input_of',
    label: 'is input of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/is_metabolite_of',
    curie: 'biolink:is_metabolite_of',
    label: 'is metabolite of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/is_missense_variant_of',
    curie: 'biolink:is_missense_variant_of',
    label: 'is missense variant of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/is_molecular_consequence_of',
    curie: 'biolink:is_molecular_consequence_of',
    label: 'is molecular consequence of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/is_nearby_variant_of',
    curie: 'biolink:is_nearby_variant_of',
    label: 'is nearby variant of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/is_non_coding_variant_of',
    curie: 'biolink:is_non_coding_variant_of',
    label: 'is non coding variant of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/is_nonsense_variant_of',
    curie: 'biolink:is_nonsense_variant_of',
    label: 'is nonsense variant of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/is_output_of',
    curie: 'biolink:is_output_of',
    label: 'is output of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/is_sequence_variant_of',
    curie: 'biolink:is_sequence_variant_of',
    label: 'is sequence variant of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/is_splice_site_variant_of',
    curie: 'biolink:is_splice_site_variant_of',
    label: 'is splice site variant of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/is_substrate_of',
    curie: 'biolink:is_substrate_of',
    label: 'is substrate of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/is_synonymous_variant_of',
    curie: 'biolink:is_synonymous_variant_of',
    label: 'is synonymous variant of',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/lacks_part', curie: 'biolink:lacks_part', label: 'lacks part', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/localization_affected_by',
    curie: 'biolink:localization_affected_by',
    label: 'localization affected by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/localization_decreased_by',
    curie: 'biolink:localization_decreased_by',
    label: 'localization decreased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/localization_increased_by',
    curie: 'biolink:localization_increased_by',
    label: 'localization increased by',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/located_in', curie: 'biolink:located_in', label: 'located in', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/location_of',
    curie: 'biolink:location_of',
    label: 'location of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/manifestation_of',
    curie: 'biolink:manifestation_of',
    label: 'manifestation of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/mentioned_by',
    curie: 'biolink:mentioned_by',
    label: 'mentioned by',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/mentions', curie: 'biolink:mentions', label: 'mentions', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/metabolic_processing_affected_by',
    curie: 'biolink:metabolic_processing_affected_by',
    label: 'metabolic processing affected by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/metabolic_processing_decreased_by',
    curie: 'biolink:metabolic_processing_decreased_by',
    label: 'metabolic processing decreased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/metabolic_processing_increased_by',
    curie: 'biolink:metabolic_processing_increased_by',
    label: 'metabolic processing increased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/missing_from',
    curie: 'biolink:missing_from',
    label: 'missing from',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/model_of', curie: 'biolink:model_of', label: 'model of', type: 'BioLink'},
  {id: 'https://w3id.org/biolink/vocab/models', curie: 'biolink:models', label: 'models', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/molecular_interaction_decreased_by',
    curie: 'biolink:molecular_interaction_decreased_by',
    label: 'molecular interaction decreased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/molecular_interaction_increased_by',
    curie: 'biolink:molecular_interaction_increased_by',
    label: 'molecular interaction increased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/molecular_modification_affected_by',
    curie: 'biolink:molecular_modification_affected_by',
    label: 'molecular modification affected by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/molecular_modification_decreased_by',
    curie: 'biolink:molecular_modification_decreased_by',
    label: 'molecular modification decreased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/molecular_modification_increased_by',
    curie: 'biolink:molecular_modification_increased_by',
    label: 'molecular modification increased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/molecularly_interacts_with',
    curie: 'biolink:molecularly_interacts_with',
    label: 'molecularly interacts with',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/mutation_rate_affected_by',
    curie: 'biolink:mutation_rate_affected_by',
    label: 'mutation rate affected by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/mutation_rate_decreased_by',
    curie: 'biolink:mutation_rate_decreased_by',
    label: 'mutation rate decreased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/mutation_rate_increased_by',
    curie: 'biolink:mutation_rate_increased_by',
    label: 'mutation rate increased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/narrow_match',
    curie: 'biolink:narrow_match',
    label: 'narrow match',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/negatively_correlated_with',
    curie: 'biolink:negatively_correlated_with',
    label: 'negatively correlated with',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/not_completed_by',
    curie: 'biolink:not_completed_by',
    label: 'not completed by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/nutrient_of',
    curie: 'biolink:nutrient_of',
    label: 'nutrient of',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/occurs_in', curie: 'biolink:occurs_in', label: 'occurs in', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/occurs_together_in_literature_with',
    curie: 'biolink:occurs_together_in_literature_with',
    label: 'occurs together in literature with',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/opposite_of',
    curie: 'biolink:opposite_of',
    label: 'opposite of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/orthologous_to',
    curie: 'biolink:orthologous_to',
    label: 'orthologous to',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/overlaps', curie: 'biolink:overlaps', label: 'overlaps', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/paralogous_to',
    curie: 'biolink:paralogous_to',
    label: 'paralogous to',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/part_of', curie: 'biolink:part_of', label: 'part of', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/participates_in',
    curie: 'biolink:participates_in',
    label: 'participates in',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/phenotype_of',
    curie: 'biolink:phenotype_of',
    label: 'phenotype of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/physically_interacts_with',
    curie: 'biolink:physically_interacts_with',
    label: 'physically interacts with',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/plasma_membrane_part_of',
    curie: 'biolink:plasma_membrane_part_of',
    label: 'plasma membrane part of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/positively_correlated_with',
    curie: 'biolink:positively_correlated_with',
    label: 'positively correlated with',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/preceded_by',
    curie: 'biolink:preceded_by',
    label: 'preceded by',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/precedes', curie: 'biolink:precedes', label: 'precedes', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/predisposes',
    curie: 'biolink:predisposes',
    label: 'predisposes',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/prevented_by',
    curie: 'biolink:prevented_by',
    label: 'prevented by',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/prevents', curie: 'biolink:prevents', label: 'prevents', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/process_negatively_regulated_by_process',
    curie: 'biolink:process_negatively_regulated_by_process',
    label: 'process negatively regulated by process',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/process_negatively_regulates_process',
    curie: 'biolink:process_negatively_regulates_process',
    label: 'process negatively regulates process',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/process_positively_regulated_by_process',
    curie: 'biolink:process_positively_regulated_by_process',
    label: 'process positively regulated by process',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/process_positively_regulates_process',
    curie: 'biolink:process_positively_regulates_process',
    label: 'process positively regulates process',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/process_regulated_by_process',
    curie: 'biolink:process_regulated_by_process',
    label: 'process regulated by process',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/process_regulates_process',
    curie: 'biolink:process_regulates_process',
    label: 'process regulates process',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/produced_by',
    curie: 'biolink:produced_by',
    label: 'produced by',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/produces', curie: 'biolink:produces', label: 'produces', type: 'BioLink'},
  {id: 'https://w3id.org/biolink/vocab/provider', curie: 'biolink:provider', label: 'provider', type: 'BioLink'},
  {id: 'https://w3id.org/biolink/vocab/publisher', curie: 'biolink:publisher', label: 'publisher', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/related_condition',
    curie: 'biolink:related_condition',
    label: 'related condition',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/related_to', curie: 'biolink:related_to', label: 'related to', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/related_to_at_concept_level',
    curie: 'biolink:related_to_at_concept_level',
    label: 'related to at concept level',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/related_to_at_instance_level',
    curie: 'biolink:related_to_at_instance_level',
    label: 'related to at instance level',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/resistance_associated_with',
    curie: 'biolink:resistance_associated_with',
    label: 'resistance associated with',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/response_affected_by',
    curie: 'biolink:response_affected_by',
    label: 'response affected by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/response_decreased_by',
    curie: 'biolink:response_decreased_by',
    label: 'response decreased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/response_increased_by',
    curie: 'biolink:response_increased_by',
    label: 'response increased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/risk_affected_by',
    curie: 'biolink:risk_affected_by',
    label: 'risk affected by',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/same_as', curie: 'biolink:same_as', label: 'same as', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/secretion_affected_by',
    curie: 'biolink:secretion_affected_by',
    label: 'secretion affected by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/secretion_decreased_by',
    curie: 'biolink:secretion_decreased_by',
    label: 'secretion decreased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/secretion_increased_by',
    curie: 'biolink:secretion_increased_by',
    label: 'secretion increased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/sensitivity_associated_with',
    curie: 'biolink:sensitivity_associated_with',
    label: 'sensitivity associated with',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/sequence_location_of',
    curie: 'biolink:sequence_location_of',
    label: 'sequence location of',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/similar_to', curie: 'biolink:similar_to', label: 'similar to', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/splicing_affected_by',
    curie: 'biolink:splicing_affected_by',
    label: 'splicing affected by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/splicing_decreased_by',
    curie: 'biolink:splicing_decreased_by',
    label: 'splicing decreased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/splicing_increased_by',
    curie: 'biolink:splicing_increased_by',
    label: 'splicing increased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/stability_affected_by',
    curie: 'biolink:stability_affected_by',
    label: 'stability affected by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/stability_decreased_by',
    curie: 'biolink:stability_decreased_by',
    label: 'stability decreased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/stability_increased_by',
    curie: 'biolink:stability_increased_by',
    label: 'stability increased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/subclass_of',
    curie: 'biolink:subclass_of',
    label: 'subclass of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/superclass_of',
    curie: 'biolink:superclass_of',
    label: 'superclass of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/synthesis_affected_by',
    curie: 'biolink:synthesis_affected_by',
    label: 'synthesis affected by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/synthesis_decreased_by',
    curie: 'biolink:synthesis_decreased_by',
    label: 'synthesis decreased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/synthesis_increased_by',
    curie: 'biolink:synthesis_increased_by',
    label: 'synthesis increased by',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/taxon_of', curie: 'biolink:taxon_of', label: 'taxon of', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/temporally_related_to',
    curie: 'biolink:temporally_related_to',
    label: 'temporally related to',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/transcribed_from',
    curie: 'biolink:transcribed_from',
    label: 'transcribed from',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/transcribed_to',
    curie: 'biolink:transcribed_to',
    label: 'transcribed to',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/translates_to',
    curie: 'biolink:translates_to',
    label: 'translates to',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/translation_of',
    curie: 'biolink:translation_of',
    label: 'translation of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/transport_affected_by',
    curie: 'biolink:transport_affected_by',
    label: 'transport affected by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/transport_decreased_by',
    curie: 'biolink:transport_decreased_by',
    label: 'transport decreased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/transport_increased_by',
    curie: 'biolink:transport_increased_by',
    label: 'transport increased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/uptake_affected_by',
    curie: 'biolink:uptake_affected_by',
    label: 'uptake affected by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/uptake_decreased_by',
    curie: 'biolink:uptake_decreased_by',
    label: 'uptake decreased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/uptake_increased_by',
    curie: 'biolink:uptake_increased_by',
    label: 'uptake increased by',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/variant_part_of',
    curie: 'biolink:variant_part_of',
    label: 'variant part of',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/xenologous_to',
    curie: 'biolink:xenologous_to',
    label: 'xenologous to',
    type: 'BioLink'
  }
]

// https://biolink.github.io/biolink-model/docs/edge_properties.html
export const propertiesList = [
  {id: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#subject', curie: 'rdf:subject', label: 'Subject', type: 'RDF'},
  {id: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#predicate', curie: 'rdf:predicate', label: 'Predicate', type: 'RDF'},
  {id: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#subject', curie: 'rdf:object', label: 'Object', type: 'RDF'},
  {
    id: 'https://w3id.org/biolink/vocab/population_context_qualifier',
    curie: 'biolink:population_context_qualifier',
    label: 'population context qualifier',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/temporal_context_qualifier',
    curie: 'biolink:temporal_context_qualifier',
    label: 'temporal context qualifier',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/publications',
    curie: 'biolink:publications',
    label: 'publications',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_confidence_level',
    curie: 'biolink:has_confidence_level',
    label: 'has confidence level',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_evidence',
    curie: 'biolink:has_evidence',
    label: 'has evidence',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/has_supporting_study_result',
    curie: 'biolink:has_supporting_study_result',
    label: 'has supporting study result',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/supporting_data_source',
    curie: 'biolink:supporting_data_source',
    label: 'supporting data source',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/stoichiometry',
    curie: 'biolink:stoichiometry',
    label: 'stoichiometry',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/FDA_approval_status',
    curie: 'biolink:FDA_approval_status',
    label: 'FDA approval status',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/aggregator_knowledge_source',
    curie: 'biolink:aggregator_knowledge_source',
    label: 'aggregator knowledge source',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/associated_environmental_context',
    curie: 'biolink:associated_environmental_context',
    label: 'associated environmental context',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/association_slot',
    curie: 'biolink:association_slot',
    label: 'association slot',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/association_type',
    curie: 'biolink:association_type',
    label: 'association type',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/base_coordinate',
    curie: 'biolink:base_coordinate',
    label: 'base coordinate',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/catalyst_qualifier',
    curie: 'biolink:catalyst_qualifier',
    label: 'catalyst qualifier',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/chi_squared_statistic',
    curie: 'biolink:chi_squared_statistic',
    label: 'chi squared statistic',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/clinical_modifier_qualifier',
    curie: 'biolink:clinical_modifier_qualifier',
    label: 'clinical modifier qualifier',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/end_coordinate',
    curie: 'biolink:end_coordinate',
    label: 'end coordinate',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/end_interbase_coordinate',
    curie: 'biolink:end_interbase_coordinate',
    label: 'end interbase coordinate',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/expression_site',
    curie: 'biolink:expression_site',
    label: 'expression site',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/frequency_qualifier',
    curie: 'biolink:frequency_qualifier',
    label: 'frequency qualifier',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/interacting_molecules_category',
    curie: 'biolink:interacting_molecules_category',
    label: 'interacting molecules category',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/interbase_coordinate',
    curie: 'biolink:interbase_coordinate',
    label: 'interbase coordinate',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/knowledge_source',
    curie: 'biolink:knowledge_source',
    label: 'knowledge source',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/logical_interpretation',
    curie: 'biolink:logical_interpretation',
    label: 'logical interpretation',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/mechanism_of_action',
    curie: 'biolink:mechanism_of_action',
    label: 'mechanism of action',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/negated', curie: 'biolink:negated', label: 'negated', type: 'BioLink'},
  {id: 'https://w3id.org/biolink/vocab/object', curie: 'biolink:object', label: 'object', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/onset_qualifier',
    curie: 'biolink:onset_qualifier',
    label: 'onset qualifier',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/original_knowledge_source',
    curie: 'biolink:original_knowledge_source',
    label: 'original knowledge source',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/original_object',
    curie: 'biolink:original_object',
    label: 'original object',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/original_predicate',
    curie: 'biolink:original_predicate',
    label: 'original predicate',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/original_subject',
    curie: 'biolink:original_subject',
    label: 'original subject',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/p_value', curie: 'biolink:p_value', label: 'p value', type: 'BioLink'},
  {id: 'https://w3id.org/biolink/vocab/phase', curie: 'biolink:phase', label: 'phase', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/phenotypic_state',
    curie: 'biolink:phenotypic_state',
    label: 'phenotypic state',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/predicate', curie: 'biolink:predicate', label: 'predicate', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/primary_knowledge_source',
    curie: 'biolink:primary_knowledge_source',
    label: 'primary knowledge source',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/provided_by',
    curie: 'biolink:provided_by',
    label: 'provided by',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/qualifiers', curie: 'biolink:qualifiers', label: 'qualifiers', type: 'BioLink'},
  {
    id: 'https://w3id.org/biolink/vocab/quantifier_qualifier',
    curie: 'biolink:quantifier_qualifier',
    label: 'quantifier qualifier',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/reaction_balanced',
    curie: 'biolink:reaction_balanced',
    label: 'reaction balanced',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/reaction_direction',
    curie: 'biolink:reaction_direction',
    label: 'reaction direction',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/reaction_side',
    curie: 'biolink:reaction_side',
    label: 'reaction side',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/sequence_localization_attribute',
    curie: 'biolink:sequence_localization_attribute',
    label: 'sequence localization attribute',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/sequence_variant_qualifier',
    curie: 'biolink:sequence_variant_qualifier',
    label: 'sequence variant qualifier',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/severity_qualifier',
    curie: 'biolink:severity_qualifier',
    label: 'severity qualifier',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/sex_qualifier',
    curie: 'biolink:sex_qualifier',
    label: 'sex qualifier',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/stage_qualifier',
    curie: 'biolink:stage_qualifier',
    label: 'stage qualifier',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/start_coordinate',
    curie: 'biolink:start_coordinate',
    label: 'start coordinate',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/start_interbase_coordinate',
    curie: 'biolink:start_interbase_coordinate',
    label: 'start interbase coordinate',
    type: 'BioLink'
  },
  {
    id: 'https://w3id.org/biolink/vocab/genome_build',
    curie: 'biolink:genome_build',
    label: 'genome build',
    type: 'BioLink'
  },
  {id: 'https://w3id.org/biolink/vocab/strand', curie: 'biolink:strand', label: 'strand', type: 'BioLink'},
  {id: 'https://w3id.org/biolink/vocab/subject', curie: 'biolink:subject', label: 'subject', type: 'BioLink'}
]

export const context: any = {
  APO: 'http://purl.obolibrary.org/obo/APO_',
  AspGD: 'http://www.aspergillusgenome.org/cgi-bin/locus.pl?dbid=',
  BFO: 'http://purl.obolibrary.org/obo/BFO_',
  'BIGG.METABOLITE': 'http://identifiers.org/bigg.metabolite/',
  'BIGG.REACTION': 'http://identifiers.org/bigg.reaction/',
  BIOGRID: 'http://identifiers.org/biogrid/',
  BIOSAMPLE: 'http://identifiers.org/biosample/',
  BSPO: 'http://purl.obolibrary.org/obo/BSPO_',
  BTO: 'http://purl.obolibrary.org/obo/BTO_',
  CAID: 'http://reg.clinicalgenome.org/redmine/projects/registry/genboree_registry/by_caid?caid=',
  CAS: 'http://identifiers.org/cas/',
  CATH: 'http://identifiers.org/cath/',
  'CATH.SUPERFAMILY': 'http://identifiers.org/cath.superfamily/',
  CDD: 'http://identifiers.org/cdd/',
  CHADO: 'http://gmod.org/wiki/Chado/',
  CHEBI: 'http://purl.obolibrary.org/obo/CHEBI_',
  'CHEMBL.COMPOUND': 'http://identifiers.org/chembl.compound/',
  'CHEMBL.MECHANISM': 'https://www.ebi.ac.uk/chembl/mechanism/inspect/',
  'CHEMBL.TARGET': 'http://identifiers.org/chembl.target/',
  CID: 'http://pubchem.ncbi.nlm.nih.gov/compound/',
  CIO: 'http://purl.obolibrary.org/obo/CIO_',
  CL: 'http://purl.obolibrary.org/obo/CL_',
  CLINVAR: 'http://identifiers.org/clinvar',
  CLO: 'http://purl.obolibrary.org/obo/CLO_',
  COAR_RESOURCE: 'http://purl.org/coar/resource_type/',
  COG: 'https://www.ncbi.nlm.nih.gov/research/cog-project/',
  CPT: 'https://www.ama-assn.org/practice-management/cpt/',
  CTD: 'http://ctdbase.org/',
  'CTD.CHEMICAL': 'http://ctdbase.org/detail.go?type=chem&acc=',
  'CTD.DISEASE': 'http://ctdbase.org/detail.go?type=disease&db=MESH&acc=',
  'CTD.GENE': 'http://ctdbase.org/detail.go?type=gene&acc=',
  ChemBank: 'http://chembank.broadinstitute.org/chemistry/viewMolecule.htm?cbid=',
  ClinVarVariant: 'http://www.ncbi.nlm.nih.gov/clinvar/variation/',
  DBSNP: 'http://identifiers.org/dbsnp/',
  DDANAT: 'http://purl.obolibrary.org/obo/DDANAT_',
  DGIdb: 'https://www.dgidb.org/interaction_types',
  DOID: 'http://purl.obolibrary.org/obo/DOID_',
  'DOID-PROPERTY': 'http://purl.obolibrary.org/obo/doid#',
  DRUGBANK: 'http://identifiers.org/drugbank/',
  DrugCentral: 'http://drugcentral.org/drugcard/',
  EC: 'http://www.enzyme-database.org/query.php?ec=',
  ECO: 'http://purl.obolibrary.org/obo/ECO_',
  ECTO: 'http://purl.obolibrary.org/obo/ECTO_',
  'EDAM-DATA': 'http://edamontology.org/data_',
  'EDAM-FORMAT': 'http://edamontology.org/format_',
  'EDAM-OPERATION': 'http://edamontology.org/operation_',
  'EDAM-TOPIC': 'http://edamontology.org/topic_',
  EFO: 'http://www.ebi.ac.uk/efo/EFO_',
  EGGNOG: 'http://identifiers.org/eggnog/',
  ENSEMBL: 'http://identifiers.org/ensembl/',
  ENVO: 'http://purl.obolibrary.org/obo/ENVO_',
  ExO: 'http://purl.obolibrary.org/obo/ExO_',
  FAO: 'http://purl.obolibrary.org/obo/FAO_',
  FB: 'http://identifiers.org/fb/',
  FBcv: 'http://purl.obolibrary.org/obo/FBcv_',
  FMA: 'http://purl.obolibrary.org/obo/FMA_',
  FOODON: 'http://purl.obolibrary.org/obo/FOODON_',
  FYPO: 'http://purl.obolibrary.org/obo/FYPO_',
  GAMMA: 'http://translator.renci.org/GAMMA_',
  GENEPIO: 'http://purl.obolibrary.org/obo/GENEPIO_',
  GENO: 'http://purl.obolibrary.org/obo/GENO_',
  GO: 'http://purl.obolibrary.org/obo/GO_',
  'GOLD.META': 'http://identifiers.org/gold.meta/',
  GOP: 'http://purl.obolibrary.org/obo/go#',
  GOREL: 'http://purl.obolibrary.org/obo/GOREL_',
  GSID: 'https://scholar.google.com/citations?user=',
  GTEx: 'https://www.gtexportal.org/home/gene/',
  GTOPDB: 'https://www.guidetopharmacology.org/GRAC/LigandDisplayForward?ligandId=',
  HAMAP: 'http://identifiers.org/hamap/',
  HANCESTRO: 'http://www.ebi.ac.uk/ancestro/ancestro_',
  HCPCS: 'http://purl.bioontology.org/ontology/HCPCS/',
  HGNC: 'http://identifiers.org/hgnc/',
  'HGNC.FAMILY': 'http://identifiers.org/hgnc.family/',
  HMDB: 'http://identifiers.org/hmdb/',
  HP: 'http://purl.obolibrary.org/obo/HP_',
  HsapDv: 'http://purl.obolibrary.org/obo/HsapDv_',
  IAO: 'http://purl.obolibrary.org/obo/IAO_',
  ICD10: 'https://icd.codes/icd9cm/',
  ICD9: 'http://translator.ncats.nih.gov/ICD9_',
  IDO: 'http://purl.obolibrary.org/obo/IDO_',
  INCHI: 'http://identifiers.org/inchi/',
  INCHIKEY: 'http://identifiers.org/inchikey/',
  INO: 'http://purl.obolibrary.org/obo/INO_',
  INTACT: 'http://identifiers.org/intact/',
  'IUPHAR.FAMILY': 'http://identifiers.org/iuphar.family/',
  KEGG: 'http://identifiers.org/kegg/',
  'KEGG.BRITE': 'http://www.kegg.jp/entry/',
  'KEGG.COMPOUND': 'http://identifiers.org/kegg.compound/',
  'KEGG.DGROUP': 'http://www.kegg.jp/entry/',
  'KEGG.DISEASE': 'http://identifiers.org/kegg.disease/',
  'KEGG.DRUG': 'http://identifiers.org/kegg.drug/',
  'KEGG.ENVIRON': 'http://identifiers.org/kegg.environ/',
  'KEGG.ENZYME': 'http://www.kegg.jp/entry/',
  'KEGG.GENE': 'http://www.kegg.jp/entry/',
  'KEGG.GLYCAN': 'http://identifiers.org/kegg.glycan/',
  'KEGG.MODULE': 'http://identifiers.org/kegg.module/',
  'KEGG.ORTHOLOGY': 'http://identifiers.org/kegg.orthology/',
  'KEGG.PATHWAY': 'https://www.kegg.jp/entry/',
  'KEGG.RCLASS': 'http://www.kegg.jp/entry/',
  'KEGG.REACTION': 'http://identifiers.org/kegg.reaction/',
  LOINC: 'http://loinc.org/rdf/',
  MAXO: 'http://purl.obolibrary.org/obo/MAXO_',
  MEDDRA: 'http://identifiers.org/meddra/',
  MESH: 'http://id.nlm.nih.gov/mesh/',
  'METANETX.REACTION': 'https://www.metanetx.org/equa_info/',
  MGI: 'http://identifiers.org/mgi/',
  MI: 'http://purl.obolibrary.org/obo/MI_',
  MIR: 'http://identifiers.org/mir/',
  MONDO: 'http://purl.obolibrary.org/obo/MONDO_',
  MP: 'http://purl.obolibrary.org/obo/MP_',
  MPATH: 'http://purl.obolibrary.org/obo/MPATH_',
  MSigDB: 'https://www.gsea-msigdb.org/gsea/msigdb/',
  NBO: 'http://purl.obolibrary.org/obo/NBO_',
  'NBO-PROPERTY': 'http://purl.obolibrary.org/obo/nbo#',
  NCBIGene: 'http://identifiers.org/ncbigene/',
  NCBITaxon: 'http://purl.obolibrary.org/obo/NCBITaxon_',
  NCIT: 'http://purl.obolibrary.org/obo/NCIT_',
  'NCIT-OBO': 'http://purl.obolibrary.org/obo/ncit#',
  NDC: 'http://identifiers.org/ndc/',
  NDDF: 'http://purl.bioontology.org/ontology/NDDF/',
  NLMID: 'https://www.ncbi.nlm.nih.gov/nlmcatalog/?term=',
  OBAN: 'http://purl.org/oban/',
  OBI: 'http://purl.obolibrary.org/obo/OBI_',
  OBOREL: 'http://purl.obolibrary.org/obo/RO_',
  OGMS: 'http://purl.obolibrary.org/obo/OGMS_',
  OIO: 'http://www.geneontology.org/formats/oboInOwl#',
  OMIM: 'http://purl.obolibrary.org/obo/OMIM_',
  'OMIM.PS': 'https://www.omim.org/phenotypicSeries/',
  ORCID: 'https://orcid.org/',
  ORPHA: 'http://www.orpha.net/ORDO/Orphanet_',
  ORPHANET: 'http://identifiers.org/orphanet/',
  'PANTHER.FAMILY': 'http://www.pantherdb.org/panther/family.do?clsAccession=',
  'PANTHER.PATHWAY': 'http://identifiers.org/panther.pathway/',
  PATO: 'http://purl.obolibrary.org/obo/PATO_',
  PCO: 'http://purl.obolibrary.org/obo/PCO_',
  PFAM: 'http://identifiers.org/pfam/',
  'PHARMGKB.PATHWAYS': 'http://identifiers.org/pharmgkb.pathways/',
  PHAROS: 'http://pharos.nih.gov',
  PIRSF: 'http://identifiers.org/pirsf/',
  PMID: 'http://www.ncbi.nlm.nih.gov/pubmed/',
  PO: 'http://purl.obolibrary.org/obo/PO_',
  PR: 'http://purl.obolibrary.org/obo/PR_',
  PRINTS: 'http://identifiers.org/prints/',
  PRODOM: 'http://identifiers.org/prodom/',
  PROSITE: 'http://identifiers.org/prosite/',
  'PUBCHEM.COMPOUND': 'http://identifiers.org/pubchem.compound/',
  'PUBCHEM.SUBSTANCE': 'http://identifiers.org/pubchem.substance/',
  PW: 'http://purl.obolibrary.org/obo/PW_',
  PathWhiz: 'http://smpdb.ca/pathways/#',
  PomBase: 'https://www.pombase.org/gene/',
  REACT: 'http://www.reactome.org/PathwayBrowser/#/',
  REPODB: 'http://apps.chiragjpgroup.org/repoDB/',
  RFAM: 'http://identifiers.org/rfam/',
  RGD: 'http://identifiers.org/rgd/',
  RHEA: 'http://identifiers.org/rhea/',
  RNACENTRAL: 'http://identifiers.org/rnacentral/',
  RO: 'http://purl.obolibrary.org/obo/RO_',
  RXCUI: 'https://mor.nlm.nih.gov/RxNav/search?searchBy=RXCUI&searchTerm=',
  RXNORM: 'http://purl.bioontology.org/ontology/RXNORM/',
  ResearchID: 'https://publons.com/researcher/',
  'SEED.REACTION': 'https://modelseed.org/biochem/reactions/',
  SEMMEDDB: 'https://skr3.nlm.nih.gov/SemMedDB',
  SEPIO: 'http://purl.obolibrary.org/obo/SEPIO_',
  SGD: 'http://identifiers.org/sgd/',
  'SIDER.DRUG': 'http://identifiers.org/sider.drug/',
  SIO: 'http://semanticscience.org/resource/SIO_',
  SMART: 'http://identifiers.org/smart/',
  SMPDB: 'http://identifiers.org/smpdb/',
  SNOMED: 'http://www.snomedbrowser.com/Codes/Details/',
  SNOMEDCT: 'http://www.snomedbrowser.com/Codes/Details/',
  SO: 'http://purl.obolibrary.org/obo/SO_',
  STATO: 'http://purl.obolibrary.org/obo/STATO_',
  STY: 'http://purl.bioontology.org/ontology/STY/',
  SUPFAM: 'http://identifiers.org/supfam/',
  ScopusID: 'https://www.scopus.com/authid/detail.uri?authorId=',
  TAXRANK: 'http://purl.obolibrary.org/obo/TAXRANK_',
  TCDB: 'http://identifiers.org/tcdb/',
  TIGRFAM: 'http://identifiers.org/tigrfam/',
  TO: 'http://purl.obolibrary.org/obo/TO_',
  UBERGRAPH: 'http://translator.renci.org/ubergraph-axioms.ofn#',
  UBERON: 'http://purl.obolibrary.org/obo/UBERON_',
  UBERON_CORE: 'http://purl.obolibrary.org/obo/uberon/core#',
  UBERON_NONAMESPACE: 'http://purl.obolibrary.org/obo/core#',
  UMLS: 'http://identifiers.org/umls/',
  UMLSSG: 'https://lhncbc.nlm.nih.gov/semanticnetwork/download/sg_archive/SemGroups-v04.txt',
  UNII: 'http://identifiers.org/unii/',
  'UNIPROT.ISOFORM': 'http://identifiers.org/uniprot.isoform/',
  'UO-PROPERTY': 'http://purl.obolibrary.org/obo/uo#',
  UPHENO: 'http://purl.obolibrary.org/obo/UPHENO_',
  UniProtKB: 'http://identifiers.org/uniprot/',
  VANDF: 'https://www.nlm.nih.gov/research/umls/sourcereleasedocs/current/VANDF/',
  VMC: 'https://github.com/ga4gh/vr-spec/',
  WB: 'http://identifiers.org/wb/',
  WBPhenotype: 'http://purl.obolibrary.org/obo/WBPhenotype_',
  WBVocab: 'http://bio2rdf.org/wormbase_vocabulary',
  WIKIDATA: 'https://www.wikidata.org/wiki/',
  WIKIDATA_PROPERTY: 'https://www.wikidata.org/wiki/Property:',
  WIKIPATHWAYS: 'http://identifiers.org/wikipathways/',
  WormBase: 'https://www.wormbase.org/get?name=',
  XCO: 'http://purl.obolibrary.org/obo/XCO_',
  XPO: 'http://purl.obolibrary.org/obo/XPO_',
  Xenbase: 'http://www.xenbase.org/gene/showgene.do?method=display&geneId=',
  ZFIN: 'http://identifiers.org/zfin/',
  ZP: 'http://purl.obolibrary.org/obo/ZP_',
  alliancegenome: 'https://www.alliancegenome.org/',
  apollo: 'https://github.com/GMOD/Apollo',
  biolink: 'https://w3id.org/biolink/vocab/',
  bioschemas: 'https://bioschemas.org/',
  dcat: 'http://www.w3.org/ns/dcat#',
  dcid: 'https://datacommons.org/browser/',
  dct: 'http://purl.org/dc/terms/',
  dctypes: 'http://purl.org/dc/dcmitype/',
  dictyBase: 'http://dictybase.org/gene/',
  doi: 'https://doi.org/',
  fabio: 'http://purl.org/spar/fabio/',
  faldo: 'http://biohackathon.org/resource/faldo#',
  foaf: 'http://xmlns.com/foaf/0.1/',
  'foodb.compound': 'http://foodb.ca/compounds/',
  gff3: 'https://github.com/The-Sequence-Ontology/Specifications/blob/master/gff3.md#',
  gpi: 'https://github.com/geneontology/go-annotation/blob/master/specs/gpad-gpi-2-0.md#',
  gtpo: 'https://rdf.guidetopharmacology.org/ns/gtpo#',
  interpro: 'https://www.ebi.ac.uk/interpro/entry/',
  isbn: 'https://www.isbn-international.org/identifier/',
  isni: 'https://isni.org/isni/',
  issn: 'https://portal.issn.org/resource/ISSN/',
  linkml: 'https://w3id.org/linkml/',
  medgen: 'https://www.ncbi.nlm.nih.gov/medgen/',
  'metacyc.reaction': 'https://identifiers.org/metacyc.reaction:',
  mirbase: 'http://identifiers.org/mirbase',
  oboInOwl: 'http://www.geneontology.org/formats/oboInOwl#',
  oboformat: 'http://www.geneontology.org/formats/oboInOwl#',
  os: 'https://github.com/cmungall/owlstar/blob/master/owlstar.ttl',
  owl: 'http://www.w3.org/2002/07/owl#',
  pav: 'http://purl.org/pav/',
  prov: 'http://www.w3.org/ns/prov#',
  qud: 'http://qudt.org/1.1/schema/qudt#',
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  schema: 'http://schema.org/',
  skos: 'http://www.w3.org/2004/02/skos/core#',
  wgs: 'http://www.w3.org/2003/01/geo/wgs84_pos',
  xsd: 'http://www.w3.org/2001/XMLSchema#'
}

export const sentenceToAnnotate = [
  {
    text: 'Iloperidone tablets are indicated for the treatment of schizophrenia in adults.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=eeb0fcfd-e4e8-4fb1-9635-901dc9446235'
  },
  {
    text: 'Clozapine is indicated for the treatment of severely ill patients with schizophrenia who fail to respond adequately to standard antipsychotic treatment',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=25c0c6d5-f7b0-48e4-e054-00144ff8d46c'
  },
  {
    text: 'Clonidine hydrochloride injection is indicated in combination with opiates for the treatment of severe pain in cancer patients that is not adequately relieved by opioid analgesics alone',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=d2b11e61-b2ef-4d20-8973-a4afc6b951ae'
  },
  {
    text: 'For the management of acute pain in adults',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=27d813ea-7798-09cb-734b-b970d7248f1f'
  },
  {
    text: "ARICEPT is indicated for the treatment of dementia of the Alzheimer's type.",
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2b1b7b5f-2f20-418c-b1ac-794c2ef1ce5e'
  },
  {
    text: 'Buspirone hydrochloride tablets are indicated for the management of anxiety disorders or the short-term relief of the symptoms of anxiety. Anxiety or tension associated with the stress of everyday life usually does not require treatment with an anxiolytic.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=33999f17-f689-40a1-955a-fb19c0590e0e'
  },
  {
    text: 'Lithium Carbonate Extended-Release Tablets USP are indicated in the treatment of manic episodes of Bipolar Disorder.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ebda1da0-38a2-49a0-8478-5d1d991a63bd'
  },
  {
    text: "Memantine hydrochloride oral solution is indicated for the treatment of moderate to severe dementia of the Alzheimer's type.",
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=4076d3ef-d0a9-96c5-1a15-812c1e42929c'
  },
  {
    text: 'Clonazepam is useful alone or as an adjunct in the treatment of the Lennox-Gastaut syndrome (petit mal variant), akinetic and myoclonic seizures.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=acbce0e8-5098-4785-943b-8bdb5ff17fab'
  },
  {
    text: 'Clonazepam is indicated for the treatment of panic disorder, with or without agoraphobia, as defined in DSM-IV',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=acbce0e8-5098-4785-943b-8bdb5ff17fab'
  },
  {
    text: 'Venlafaxine tablets, USP are indicated for the treatment of major depressive disorder.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b23637e5-d37f-41b5-ba76-fc053e903bc2'
  },
  {
    text: 'AIMOVIG is indicated for the preventive treatment of migraine in adults.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b998ed05-94b0-47fd-b28f-cddd1e128fd8'
  },
  {
    text: 'AMRIX (cyclobenzaprine hydrochloride extended-release capsules) is indicated as an adjunct to rest and physical therapy for relief of muscle spasm associated with acute, painful musculoskeletal conditions.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3902123b-1365-ac3c-0934-afff9eeeb1bd'
  },
  {
    text: 'Amphetamine sulfate tablets, USP 5 mg and 10 mg are indicated for: Narcolepsy',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=53d40847-e0d3-48ec-81a7-ec5478553565'
  },
  {
    text: 'Amphetamine sulfate tablets, USP 5 mg and 10 mg are indicated for: Attention Deficit Disorder with Hyperactivity as an integral part of a total treatment program which typically includes other remedial measures (psychological, educational, social) for a stabilizing effect in children with behavioral syndrome characterized by the following group of developmentally inappropriate symptoms: moderate to severe distractibility, short attention span, hyperactivity, emotional lability, and impulsivity. The diagnosis of the syndrome should not be made with finality when these symptoms are only of comparatively recent origin. Nonlocalizing (soft) neurological signs, learning disability, and abnormal EEG may or may not be present, and a diagnosis of central nervous system dysfunction may or not be warranted.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=53d40847-e0d3-48ec-81a7-ec5478553565'
  },
  {
    text: 'Clonazepam is useful alone or as an adjunct in the treatment of the Lennox-Gastaut syndrome (petit mal variant), akinetic and myoclonic seizures.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=acbce0e8-5098-4785-943b-8bdb5ff17fab'
  },
  {
    text: 'Methylphenidate Hydrochloride is indicated as an integral part of a total treatment program which typically includes other remedial measures (psychological, educational, social) for a stabilizing effect in children with a behavioral syndrome characterized by the following group of developmentally inappropriate symptoms: moderate-to-severe distractibility, short attention span, hyperactivity, emotional lability, and impulsivity',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2cf1b26b-199d-4c7f-ab64-4805a9def2cc'
  },
  {
    text: 'Indications and Usage: Attention Deficit Disorders, Narcolepsy',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2cf1b26b-199d-4c7f-ab64-4805a9def2cc'
  },
  {
    text: 'Lamotrigine tablets are indicated as adjunctive therapy for the following seizure types in patients aged 2 years and older',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=0b0f0209-edbd-46f3-9bed-762cbea0d737'
  },
  {
    text: 'Lamotrigine tablets are indicated for conversion to monotherapy in adults (aged 16 years and older) with partial-onset seizures who are receiving treatment with carbamazepine, phenytoin, phenobarbital, primidone, or valproate as the single antiepileptic drug (AED).',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=0b0f0209-edbd-46f3-9bed-762cbea0d737'
  },
  {
    text: 'Lamotrigine tablets are indicated for the maintenance treatment of bipolar I disorder to delay the time to occurrence of mood episodes (depression, mania, hypomania, mixed episodes) in patients treated for acute mood episodes with standard therapy',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=0b0f0209-edbd-46f3-9bed-762cbea0d737'
  },
  {
    text: 'Topiramate tablets and topiramate capsules are indicated as initial monotherapy for the treatment of partial-onset or primary generalized tonic-clonic seizures in patients 2 years of age and older',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=6f9d59e3-d10d-48f3-af01-83ba3e1e3a2b'
  },
  {
    text: 'Gabapentin capsules, USP are indicated as adjunctive therapy in the treatment of partial seizures with and without secondary generalization in patients over 12 years of age with epilepsy. Gabapentin capsules, USP are also indicated as adjunctive therapy in the treatment of partial seizures in pediatric patients age 3 to 12 years.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=0936a88f-b569-49c4-951b-14e8f6273b53'
  },
  {
    text: 'Topiramate tablets and topiramate capsules are indicated as adjunctive therapy for for the treatment of partial-onset seizures, primary generalized tonic-clonic seizures, and seizures associated with Lennox-Gastaut syndrome in patients 2 years of age and older',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=6f9d59e3-d10d-48f3-af01-83ba3e1e3a2b'
  },
  {
    text: 'Topiramate tablets and topiramate capsules are indicated for the preventive treatment of migraine in patients 12 years of age and older',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=6f9d59e3-d10d-48f3-af01-83ba3e1e3a2b'
  },
  {
    text: 'Quetiapine tablets are indicated for the treatment of schizophrenia',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=904f80af-44b6-d964-1680-ac9e6b61327b'
  },
  {
    text: 'Quetiapine tablets are indicated for the acute treatment of manic episodes associated with bipolar I disorder, both as monotherapy and as an adjunct to lithium or divalproex',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=904f80af-44b6-d964-1680-ac9e6b61327b'
  },
  {
    text: 'Quetiapine tablets are indicated as monotherapy for the acute treatment of depressive episodes associated with bipolar disorder.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=904f80af-44b6-d964-1680-ac9e6b61327b'
  },
  {
    text: 'Alprazolam extended-release tablets are indicated for the treatment of panic disorder, with or without agoraphobia.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=79619e0f-1600-40ea-e053-2a91aa0a2700'
  },
  {
    text: 'Tizanidine hydrochloride capsules are central alpha-2-adrenergic agonist indicated for the management of spasticity',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=e19636a4-3c5e-4b75-b394-003098f74d48'
  },
  {
    text: 'Uses: temporarily reduces pains and aches due to headache, toothache, backache, menstrual cramps, the common cold, muscular aches, minor pains of arthritis, temporarily reduces fever',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=5c65b691-b795-44a5-abb7-931cd772f1a1'
  },
  {
    text: 'Levetiracetam in Sodium Chloride Injection is indicated as adjunctive therapy in the treatment of partial onset seizures in adults with epilepsy.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=0a9234b7-46b1-8e6c-a992-90f86cfb6e00'
  },
  {
    text: "Tolcapone tablets, USP is indicated as an adjunct to levodopa and carbidopa for the treatment of the signs and symptoms of idiopathic Parkinson's disease",
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=d94891be-2fef-4e39-8e35-ab7afe93e78e'
  },
  {
    text: 'Levetiracetam in Sodium Chloride Injection is indicated as adjunctive therapy in the treatment of myoclonic seizures in adults with juvenile myoclonic epilepsy.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=0a9234b7-46b1-8e6c-a992-90f86cfb6e00'
  },
  {
    text: 'Levetiracetam in Sodium Chloride Injection is indicated as adjunctive therapy in the treatment of primary generalized tonic-clonic seizures in adults with idiopathic generalized epilepsy.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=0a9234b7-46b1-8e6c-a992-90f86cfb6e00'
  },
  {
    text: 'Divalproex sodium delayed-release capsules are indicated as monotherapy and adjunctive therapy in the treatment of adult patients and pediatric patients down to the age of 10 years with complex partial seizures that occur either in isolation or in association with other types of seizures.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f911748c-fb3a-fe1a-ab2a-4b40455e05ef'
  },
  {
    text: 'Uses - temporarily relieves minor aches and pains due to: minor pain of arthritis, backache, headache, muscular aches, menstrual cramps, toothache, common cold, temporarily reduces fever',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=bc5ddcf2-640c-4683-a60f-ca1c8b418873'
  },
  {
    text: 'Baclofen is useful for the alleviation of signs and symptoms of spasticity resulting from multiple sclerosis, particularly for the relief of flexor spasms and concomitant pain, clonus, and muscular rigidity.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=346af8fe-3816-49de-bfd3-5a7425e728f9'
  },
  {
    text: 'Diclofenac potassium tablets are indicated:For relief of mild to moderate pain',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=77b60a0c-e49a-4ad4-abb1-b662c24ab782'
  },
  {
    text: 'Baclofen may also be of some value in patients with spinal cord injuries and other spinal cord diseases.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=346af8fe-3816-49de-bfd3-5a7425e728f9'
  },
  {
    text: 'Mirtazapine tablets, USP are indicated for the treatment of major depressive disorder.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=0039f505-7cd0-4d79-b5dd-bf2d172571a0'
  },
  {
    text: 'Hydrocodone Bitartrate Extended-Release Capsules are indicated for the management of pain severe enough to require daily, around-the-clock, long-term opioid treatment and for which alternative treatment options are inadequate.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a7b8ea07-e926-f0a5-c20d-92f23ed350d0'
  },
  {
    text: 'Almotriptan tablets (almotriptan malate) are indicated for the acute treatment of migraine attacks in patients with a history of migraine with or without aura',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=35617039-9f33-401b-bac3-8f85c65fa2c7'
  },
  {
    text: 'Carisoprodol Tablets are indicated for the relief of discomfort associated with acute, painful musculoskeletal conditions in adults.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ab22f1be-16c8-45b6-adaf-09e08bf7a545'
  },
  {
    text: 'Ropinirole tablets are indicated for the treatment of Parkinson’s disease',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f5ce07b9-ad0d-4b72-9daf-8662775af093'
  },
  {
    text: 'Ropinirole tablets are indicated for the treatment of moderate-to-severe primary Restless Legs Syndrome (RLS).',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f5ce07b9-ad0d-4b72-9daf-8662775af093'
  },
  {
    text: 'Methocarbamol tablets, USP are indicated as an adjunct to rest, physical therapy, and other measures for the relief of discomfort associated with acute, painful musculoskeletal conditions.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=42c0a177-7d62-4bcf-9fce-7dd484cda4d5'
  },
  {
    text: 'Oxcarbazepine oral suspension is indicated for use as monotherapy or adjunctive therapy in the treatment of partial-onset seizures in adults and as monotherapy in the treatment of partial-onset seizures in pediatric patients aged 4 years and above, and as adjunctive therapy in pediatric patients aged 2 years and above with partial-onset seizures.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2515391e-3a88-4226-92e5-f641c8409fe5'
  },
  {
    text: 'Pramipexole dihydrochloride tablets are indicated for the treatment of Parkinson’s disease.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=4fe7106d-4bf6-4794-87cb-8df616994c41'
  },
  {
    text: 'Pramipexole dihydrochloride tablets are indicated for the treatment of moderate-to-severe primary Restless Legs Syndrome (RLS).',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=4fe7106d-4bf6-4794-87cb-8df616994c41'
  },
  {
    text: 'Atomoxetine capsules are indicated for the treatment of Attention-Deficit/Hyperactivity Disorder (ADHD).',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=6f6bea0c-297b-43ff-8960-ecc11243e06e'
  },
  {
    text: 'Topiramate tablets and topiramate capsules are indicated as adjunctive therapy for for the treatment of partial-onset seizures, primary generalized tonic-clonic seizures, and seizures associated with Lennox-Gastaut syndrome in patients 2 years of age and older',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=6f9d59e3-d10d-48f3-af01-83ba3e1e3a2b'
  },
  {
    text: 'PRIALT (ziconotide) solution, intrathecal infusion is indicated for the management of severe chronic pain in adult patients for whom intrathecal therapy is warranted, and who are intolerant of or refractory to other treatment, such as systemic analgesics, adjunctive therapies, or intrathecal morphine',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b025d8ed-937d-4597-9ad1-0b2f6e0ee5b1'
  },
  {
    text: 'Vyvanse is indicated for the treatment of Attention Deficit Hyperactivity Disorder (ADHD).',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a310fc51-2743-4755-8398-fed5402283f6'
  },
  {
    text: 'As an antiaggregant in antiplatelet therapy or for temporary relief of minor aches and pains.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=80ce8064-0e27-4587-b70b-2ea3c9aa2786'
  },
  {
    text: 'Trihexyphenidyl is indicated as an adjunct in the treatment of all forms of parkinsonism (postencephalitic, arteriosclerotic, and idiopathic). It is often useful as adjuvant therapy when treating these forms of parkinsonism with levodopa.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=d6f08000-e973-4bab-810c-b69f6c8ee4f3'
  },
  {
    text: 'Additionally, it is indicated for the control of extrapyramidal disorders caused by central nervous system drugs such as the dibenzoxazepines, phenothiazines, thioxanthenes, and butyrophenones.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=d6f08000-e973-4bab-810c-b69f6c8ee4f3'
  },
  {
    text: 'Dextroamphetamine sulfate tablets are indicated in: Narcolepsy and Attention Deficit Disorder with Hyperactivity: As an integral part of a total treatment program that typically includes other remedial measures (psychological, educational, social) for a stabilizing effect in pediatric patients (ages 3 years to 16 years)',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=bed3c03f4-2829-423f-a595-dc09c9cc0e40'
  },
  {
    text: 'Dextroamphetamine sulfate tablets are indicated in: Narcolepsy and Attention Deficit Disorder with Hyperactivity: As an integral part of a total treatment program that typically includes other remedial measures (psychological, educational, social) for a stabilizing effect in pediatric patients (ages 3 years to 16 years)',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=bed3c03f4-2829-423f-a595-dc09c9cc0e40'
  },
  {
    text: 'Morphine sulfate is indicated for the relief of severe pain',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=e360d6b6-d9ef-487d-bf14-fcbbee8beb29'
  },
  {
    text: 'Pyridostigmine Bromide Oral Solution, USP is useful in the treatment of myasthenia gravis.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ef78ff05-8e0f-463a-88cd-ca9a01aed76a'
  },
  {
    text: 'Buprenorphine Sublingual Tablets are indicated for the treatment of opioid dependence and are preferred for induction',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=1bf8b35a-b769-465c-a2f8-099868dfcd2f'
  },
  {
    text: 'Naltrexone hydrochloride tablets USP 50 mg is indicated in the treatment of alcohol dependence',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=49aa3d6d-2270-4615-aafa-b440859ab870'
  },
  {
    text: "Bromocriptine mesylate tablets are indicated in the treatment of the signs and symptoms of idiopathic or postencephalitic Parkinson's disease. As adjunctive treatment to levodopa (alone or with a peripheral decarboxylase inhibitor), bromocriptine mesylate therapy may provide additional therapeutic benefits in those patients who are currently maintained on optimal dosages of levodopa, those who are beginning to deteriorate (develop tolerance) to levodopa therapy, and those who are experiencing end of dose failure on levodopa therapy. ",
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=93a0696b-b261-4262-9e06-f3180b419f8f'
  },
  {
    text: 'RADICAVA is indicated for the treatment of amyotrophic lateral sclerosis (ALS).',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=0ce2c1c4-2a40-485c-b7cb-96a9b85d9d11'
  },
  {
    text: "Tetrabenazine tablets are indicated for the treatment of chorea associated with Huntington's disease.",
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=471ac1d8-e3ad-7729-87c5-c26ae92c32eb'
  },
  {
    text: 'Riluzole is indicated for the treatment of amyotrophic lateral sclerosis(ALS).',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=dd432c13-389e-46b3-8891-0cf1a58800ff'
  },
  {
    text: 'RUZURGI is indicated for the treatment of Lambert-Eaton myasthenic syndrome (LEMS) in patients 6 to less than 17 years of age.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2731310a-c060-4d3e-ba41-763d791f63a9'
  },
  {
    text: 'USES: For the temporary relief of discomfort and pain associated with - minor burns and skin irritations, minor cuts and scrapes, itching',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=60cafbaf-8ec6-46a5-e053-2a91aa0af11f'
  },
  {
    text: 'Cevimeline hydrochloride capsules are indicated for the treatment of symptoms of dry mouth in patients with Sjögren’s Syndrome.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=773a19e8-4c3e-4414-99a6-aea98c9790ee'
  },
  {
    text: 'temporarily relieves minor aches and pains due to: the common cold headache backache minor pain of arthritis toothache muscular aches premenstrual and menstrual cramps temporarily reduces fever',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=9f7cca9d-4230-49d7-b805-a1fbc73e31c9'
  },
  {
    text: 'temporarily relieves minor aches and pains due to: the common cold headache backache minor pain of arthritis toothache muscular aches premenstrual and menstrual cramps temporarily reduces fever',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=9f7cca9d-4230-49d7-b805-a1fbc73e31c9'
  },
  {
    text: 'Clonazepam is useful alone or as an adjunct in the treatment of the Lennox-Gastaut syndrome (petit mal variant), akinetic and myoclonic seizures.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=acbce0e8-5098-4785-943b-8bdb5ff17fab'
  },
  {
    text: 'Clonazepam is useful alone or as an adjunct in the treatment of the Lennox-Gastaut syndrome (petit mal variant), akinetic and myoclonic seizures.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=acbce0e8-5098-4785-943b-8bdb5ff17fab'
  },
  {
    text: 'Temazepam is indicated for the short-term treatment of insomnia (generally 7 to 10 days).',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a4370eb4-b00d-4247-af8d-980e59fbbec6'
  },
  {
    text: 'Diazepam is a useful adjunct for the relief of skeletal muscle spasm due to reflex spasm to local pathology (such as inflammation of the muscles or joints, or secondary to trauma), spasticity caused by upper motor neuron disorders (such as cerebral palsy and paraplegia); athetosis; stiff man syndrome; and tetanus.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=fa352464-14c8-49e9-b8b7-5a968b1cfa93'
  },
  {
    text: 'Diazepam is a useful adjunct for the relief of skeletal muscle spasm due to reflex spasm to local pathology (such as inflammation of the muscles or joints, or secondary to trauma), spasticity caused by upper motor neuron disorders (such as cerebral palsy and paraplegia); athetosis; stiff man syndrome; and tetanus.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=fa352464-14c8-49e9-b8b7-5a968b1cfa93'
  },
  {
    text: 'Diazepam is a useful adjunct for the relief of skeletal muscle spasm due to reflex spasm to local pathology (such as inflammation of the muscles or joints, or secondary to trauma), spasticity caused by upper motor neuron disorders (such as cerebral palsy and paraplegia); athetosis; stiff man syndrome; and tetanus.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=fa352464-14c8-49e9-b8b7-5a968b1cfa93'
  },
  {
    text: 'Diazepam is a useful adjunct for the relief of skeletal muscle spasm due to reflex spasm to local pathology (such as inflammation of the muscles or joints, or secondary to trauma), spasticity caused by upper motor neuron disorders (such as cerebral palsy and paraplegia); athetosis; stiff man syndrome; and tetanus.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=fa352464-14c8-49e9-b8b7-5a968b1cfa93'
  },
  {
    text: 'Diazepam is a useful adjunct for the relief of skeletal muscle spasm due to reflex spasm to local pathology (such as inflammation of the muscles or joints, or secondary to trauma), spasticity caused by upper motor neuron disorders (such as cerebral palsy and paraplegia); athetosis; stiff man syndrome; and tetanus.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=fa352464-14c8-49e9-b8b7-5a968b1cfa93'
  },
  {
    text: 'Diazepam is a useful adjunct for the relief of skeletal muscle spasm due to reflex spasm to local pathology (such as inflammation of the muscles or joints, or secondary to trauma), spasticity caused by upper motor neuron disorders (such as cerebral palsy and paraplegia); athetosis; stiff man syndrome; and tetanus.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=fa352464-14c8-49e9-b8b7-5a968b1cfa93'
  },
  {
    text: 'Lorazepam injection is indicated for the treatment of status epilepticus.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ae274b1f-27c3-483b-99f1-9a9249dc2459'
  },
  {
    text: 'Lorazepam injection is indicated in adult patients for preanesthetic medication, producing sedation (sleepiness or drowsiness), relief of anxiety, and a decreased ability to recall events related to the day of surgery. It is most useful in those patients who are anxious about their surgical procedure and who would prefer to have diminished recall of the events of the day of surgery',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ae274b1f-27c3-483b-99f1-9a9249dc2459'
  },
  {
    text: 'Amantadine hydrochloride capsules are also indicated in the treatment of parkinsonism and drug-induced extrapyramidal reactions.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=491aea85-5a55-4a7c-b1cf-a123fea4377d'
  },
  {
    text: 'ABSTRAL is indicated for the management of breakthrough pain in cancer patients 18 years of age and older who are already receiving, and who are tolerant to, around-the-clock opioid therapy for their underlying persistent cancer pain.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=e60f00e9-2cf4-4c20-b570-1c2ea426c8c7'
  },
  {
    text: 'Diazepam is indicated for the management of anxiety disorders for the short-term relief of the symptoms of anxiety. Anxiety or tension associated with the stress of everyday life usually does not require treatment with an anxiolytic.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=fa352464-14c8-49e9-b8b7-5a968b1cfa93'
  },
  {
    text: 'Diazepam injection is a useful adjunct in status epilepticus and severe recurrent convulsive seizures.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=fa352464-14c8-49e9-b8b7-5a968b1cfa93'
  },
  {
    text: 'Iloperidone tablets are indicated for the treatment of schizophrenia in adults.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=eeb0fcfd-e4e8-4fb1-9635-901dc9446235'
  },
  {
    text: 'Aripiprazole oral solution is indicated for the treatment of: Schizophrenia',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=7f272100-e02f-4a16-bb39-a2bf844db4f9'
  },
  {
    text: 'Aripiprazole oral solution is indicated for the treatment of: acute Treatment of Manic and Mixed Episodes associated with Bipolar I Disorder ',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=7f272100-e02f-4a16-bb39-a2bf844db4f9'
  },
  {
    text: 'Aripiprazole oral solution is indicated for the treatment of: Adjunctive Treatment of Major Depressive Disorder',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=7f272100-e02f-4a16-bb39-a2bf844db4f9'
  },
  {
    text: 'Aripiprazole oral solution is indicated for the treatment of: Irritability Associated with Autistic Disorder',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=7f272100-e02f-4a16-bb39-a2bf844db4f9'
  },
  {
    text: 'Felbamate oral suspension is recommended for use only in those patients who respond inadequately to alternative treatments and whose epilepsy is so severe that a substantial risk of aplastic anemia and/or liver failure is deemed acceptable in light of the benefits conferred by its use',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2e325d79-d0a4-4af7-b09b-96ee5a5b2a37'
  },
  {
    text: 'Vigabatrin for oral solution is indicated as adjunctive therapy for adults and pediatric patients 2 years of age and older with refractory complex partial seizures who have inadequately responded to several alternative treatments and for whom the potential benefits outweigh the risk of vision loss',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=5b8fb137-848b-45fd-9107-a6db5a675360'
  },
  {
    text: 'Selegiline capsules, USP are indicated as an adjunct in the management of Parkinsonian patients being treated with levodopa/carbidopa who exhibit deterioration in the quality of their response to this therapy.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=1924db3d-6a16-4496-cfd0-6903be146925'
  },
  {
    text: 'Vigabatrin for oral solution is indicated as monotherapy for pediatric patients with infantile spasms 1 month to 2 years of age for whom the potential benefits outweigh the potential risk of vision loss',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=5b8fb137-848b-45fd-9107-a6db5a675360'
  },
  {
    text: 'Extended phenytoin sodium capsules are indicated for the treatment of tonic-clonic (grand mal) and psychomotor (temporal lobe) seizures and prevention and treatment of seizures occurring during or following neurosurgery',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=7e467c02-49a0-4b62-b537-430fdfa4f10e'
  },
  {
    text: 'Fosphenytoin sodium injection is indicated for the treatment of generalized tonic-clonic status epilepticus and prevention and treatment of seizures occurring during neurosurgery.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b60c9c82-e5c7-4e05-98c7-5bbba4af04b2'
  },
  {
    text: 'Risperidone tablets are indicated for the acute and maintenance treatment of schizophrenia',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c0c3eeb6-8a75-0b20-2008-396e63cddcdb'
  },
  {
    text: 'Due to Janssen Pharmaceuticals Corporation’s marketing exclusivity rights, this drug product is not labeled for use in pediatric patients with bipolar mania. Pediatric use information for the treatment of pediatric patients with bipolar mania, 10 to 17 years of age, is approved for Janssen Pharmaceuticals Corporation’s risperidone drug products.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c0c3eeb6-8a75-0b20-2008-396e63cddcdb'
  },
  {
    text: 'Risperidone tablets are indicated for the short-term treatment of acute manic or mixed episodes associated with Bipolar I Disorder in Adults',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c0c3eeb6-8a75-0b20-2008-396e63cddcdb'
  },
  {
    text: 'Combination Therapy - Adults: The combination of risperidone with lithium or valproate is indicated for the short-term treatment of acute manic or mixed episodes associated with Bipolar I Disorder',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c0c3eeb6-8a75-0b20-2008-396e63cddcdb'
  },
  {
    text: 'Risperidone tablets are indicated for the treatment of irritability associated with autistic disorder in children and adolescents aged 5-16 years, including symptoms of aggression towards others, deliberate self-injuriousness, temper tantrums, and quickly changing moods',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c0c3eeb6-8a75-0b20-2008-396e63cddcdb'
  },
  {
    text: 'ONGENTYS is indicated as adjunctive treatment to levodopa/carbidopa in patients with Parkinson’s disease (PD) experiencing “off” episodes',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=278a60c4-2353-4657-b486-f392b93181b7'
  },
  {
    text: 'Entacapone tablets are indicated as an adjunct to levodopa and carbidopa to treat end-of-dose “wearing-off” in patients with Parkinson’s disease',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=e9e94e9f-cd7a-45f5-9aeb-9c28ed804d8c'
  },
  {
    text: 'For the relief of symptoms of depression. Endogenous depression is more likely to be alleviated than other depressive states',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=92ca69d4-cdba-4789-91a9-922664d52498'
  },
  {
    text: 'Sertraline Tablets, USP are indicated for the treatment of major depressive disorder in adults.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f9641190-9151-4f7e-89ff-1e7a818c30ee'
  },
  {
    text: 'Sertraline tablets are indicated for the treatment of obsessions and compulsions in patients with obsessive-compulsive disorder (OCD), as defined in the DSM-III-R; i.e., the obsessions or compulsions cause marked distress, are time-consuming, or significantly interfere with social or occupational functioning.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f9641190-9151-4f7e-89ff-1e7a818c30ee'
  },
  {
    text: 'Sertraline tablets are indicated for the treatment of panic disorder in adults, with or without agoraphobia, as defined in DSM-IV.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f9641190-9151-4f7e-89ff-1e7a818c30ee'
  },
  {
    text: 'Sertraline is indicated for the treatment of posttraumatic stress disorder in adults.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f9641190-9151-4f7e-89ff-1e7a818c30ee'
  },
  {
    text: 'Sertraline tablets are indicated for the treatment of social anxiety disorder, also known as social phobia in adults.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f9641190-9151-4f7e-89ff-1e7a818c30ee'
  },
  {
    text: 'Fluoxetine is indicated for the acute and maintenance treatment of Major Depressive Disorder in adult patients and in pediatric patients aged 8 to18 years',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=59de2889-c3d3-4ebf-8826-13f30a3fa439'
  },
  {
    text: 'Fluoxetine is indicated for the acute and maintenance treatment of obsessions and compulsions in adult patients and in pediatric patients aged 7 to 17 years with Obsessive Compulsive Disorder (OCD)',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=59de2889-c3d3-4ebf-8826-13f30a3fa439'
  },
  {
    text: 'Fluoxetine is indicated for the acute and maintenance treatment of binge-eating and vomiting behaviors in adult patients with moderate to severe Bulimia Nervosa',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=59de2889-c3d3-4ebf-8826-13f30a3fa439'
  },
  {
    text: 'Fluoxetine is indicated for the acute and maintenance treatment of binge-eating and vomiting behaviors in adult patients with moderate to severe Bulimia Nervosa ',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=59de2889-c3d3-4ebf-8826-13f30a3fa439'
  },
  {
    text: 'Fluoxetine is indicated for the acute treatment of Panic Disorder, with or without agoraphobia, in adult patients',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=59de2889-c3d3-4ebf-8826-13f30a3fa439'
  },
  {
    text: 'Xyrem is indicated for the treatment of cataplexy or excessive daytime sleepiness (EDS) in patients 7 years of age and older with narcolepsy.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=926eb076-a4a8-45e4-91ef-411f0aa4f3ca'
  },
  {
    text: 'Fluoxetine and olanzapine in combination is indicated for the acute treatment of depressive episodes associated with Bipolar I Disorder in adult patients.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=59de2889-c3d3-4ebf-8826-13f30a3fa439'
  },
  {
    text: 'Orphenadrine citrate is indicated as an adjunct to rest, physical therapy, and other measures for the relief of discomfort associated with acute, painful musculo-skeletal conditions.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=aec8ad3a-f717-4e74-b7b9-19debdaad79a'
  },
  {
    text: 'Ramelteon tablets are indicated for the treatment of insomnia characterized by difficulty with sleep onset.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a89dae05-6c39-4072-b8ee-c4c35b46f7d4'
  },
  {
    text: 'Frovatriptan succinate tablets are indicated for the acute treatment of migraine with or without aura in adults.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=94b996dc-ddc4-41ce-9a9f-3d91cb187473'
  },
  {
    text: 'Sumatriptan tablets are indicated for the acute treatment of migraine with or without aura in adults.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b2503fff-c978-4efa-b1b4-d7740b6b26f2'
  },
  {
    text: 'Marplan is indicated for the treatment of depression. Because of its potentially serious side effects, Marplan is not an antidepressant of first choice in the treatment of newly diagnosed depressed patient',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ac387aa0-3f04-4865-a913-db6ed6f4fdc5'
  },
  {
    text: 'Pimozide Tablets, USP is indicated for the suppression of motor and phonic tics in patients with Tourette’s Disorder who have failed to respond satisfactorily to standard treatment.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=70b079e2-a1f7-4a93-8685-d60a4d7c1280'
  },
  {
    text: 'Thiothixene capsules are effective in the management of schizophrenia.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=13d90931-e9d8-25f3-a045-608d0404cd7a'
  },
  {
    text: 'Treatment of adult and adolescent patients (13 to 17 years) with schizophrenia',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=afad3051-9df2-4c54-9684-e8262a133af8'
  },
  {
    text: 'Monotherapy treatment of adult and pediatric patients (10 to 17 years) with major depressive episode associated with bipolar I disorder (bipolar depression)',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=afad3051-9df2-4c54-9684-e8262a133af8'
  },
  {
    text: 'Clozapine is indicated for reducing the risk of recurrent suicidal behavior in patients with schizophrenia or schizoaffective disorder who are judged to be at chronic risk for re-experiencing suicidal behavior, based on history and recent clinical state',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=25c0c6d5-f7b0-48e4-e054-00144ff8d46c'
  },
  {
    text: 'Adjunctive treatment with lithium or valproate in adult patients with major depressive episode associated with bipolar I disorder (bipolar depression)',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=afad3051-9df2-4c54-9684-e8262a133af8'
  },
  {
    text: 'Duloxetine delayed-release capsules are indicated for the treatment of: Major Depressive Disorder, Generalized Anxiety Disorder, Diabetic Peripheral Neuropathy, Fibromyalgia, Chronic Muscoskeletal Pain',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ea2dc1a6-22d5-4295-9d39-9bf015dc5a89'
  },
  {
    text: 'Duloxetine delayed-release capsules are indicated for the treatment of: Major Depressive Disorder, Generalized Anxiety Disorder, Diabetic Peripheral Neuropathy, Fibromyalgia, Chronic Muscoskeletal Pain',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ea2dc1a6-22d5-4295-9d39-9bf015dc5a89'
  },
  {
    text: 'Duloxetine delayed-release capsules are indicated for the treatment of: Major Depressive Disorder, Generalized Anxiety Disorder, Diabetic Peripheral Neuropathy, Fibromyalgia, Chronic Muscoskeletal Pain',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ea2dc1a6-22d5-4295-9d39-9bf015dc5a89'
  },
  {
    text: 'Duloxetine delayed-release capsules are indicated for the treatment of: Major Depressive Disorder, Generalized Anxiety Disorder, Diabetic Peripheral Neuropathy, Fibromyalgia, Chronic Muscoskeletal Pain',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ea2dc1a6-22d5-4295-9d39-9bf015dc5a89'
  },
  {
    text: 'Protriptyline hydrochloride is indicated for the treatment of symptoms of mental depression in patients who are under close medical supervision.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=700abc58-9362-4ef5-9d7a-dd3c4d364d0a'
  },
  {
    text: 'Bupropion hydrochloride extended-release tablets (XL) are indicated for the treatment of major depressive disorder (MDD), as defined by the Diagnostic and Statistical Manual (DSM).',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f32a4532-7dfd-4aa5-bb48-afbbd2eefb7c'
  },
  {
    text: 'Bupropion hydrochloride extended-release tablets (XL) are indicated for the prevention of seasonal major depressive episodes in patients with a diagnosis of seasonal affective disorder (SAD).',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f32a4532-7dfd-4aa5-bb48-afbbd2eefb7c'
  },
  {
    text: 'Endogenous depression is more likely to be alleviated than are other depressive states.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=94e984da-3b08-406f-8c10-e78844fca1ff'
  },
  {
    text: 'For the relief of symptoms of depression.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=94e984da-3b08-406f-8c10-e78844fca1ff'
  },
  {
    text: 'Endogenous depression is more likely to be alleviated than other depressive states.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=4f31df66-7dc2-1f04-e054-00144ff88e88'
  },
  {
    text: 'Trimipramine maleate capsules are indicated for the relief of symptoms of depression.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=4f31df66-7dc2-1f04-e054-00144ff88e88'
  },
  {
    text: 'OXYCODONE HCl EXTENDED-RELEASE TABLETS are indicated for the management of pain severe enough to require daily, around-the-clock, long-term opioid treatment and for which alternative treatment options are inadequate in: adults and Opioid-tolerant pediatric patients 11 years of age and older who are already receiving and tolerate a minimum daily opioid dose of at least 20 mg oxycodone orally or its equivalent',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c5b52ff1-21a6-4d28-9982-55b4ac195fac'
  },
  {
    text: 'Clobazam tablet is indicated for the adjunctive treatment of seizures associated with Lennox-Gastaut syndrome (LGS) in patients 2 years of age or older.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=721dde68-db83-4dad-8649-8046cb455372'
  },
  {
    text: 'Perphenazine is indicated for use in the treatment of schizophrenia and for the control of severe nausea and vomiting in adults.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=bb1a3d20-1f93-48a1-9e27-4712a8561757'
  },
  {
    text: 'In acute alcohol withdrawal, diazepam may be useful in the symptomatic relief of acute agitation, tremor, impending or acute delirium tremens and hallucinosis.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=fa352464-14c8-49e9-b8b7-5a968b1cfa93'
  },
  {
    text: 'Fluphenazine Decanoate Injection, USP is a long-acting parenteral antipsychotic drug intended for use in the management of patients requiring prolonged parenteral neuroleptic therapy (e.g., chronic schizophrenics).',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=1967dc24-f2a5-4095-baa9-a9d1c5410311'
  },
  {
    text: 'Phenelzine Sulfate Tablets, USP has been found to be effective in depressed patients clinically characterized as atypical, nonendogenous, or neurotic.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=40483372-448f-4284-976c-8462ef256661'
  },
  {
    text: 'Milnacipran HCl tablets are indicated for the management of fibromyalgia.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=eaa14195-1b9c-423c-9412-d2fe0857e39d'
  },
  {
    text: 'Meprobamate tablets are indicated for the management of anxiety disorders or for the short-term relief of the symptoms of anxiety. Anxiety or tension associated with the stress of everyday life usually do not require treatment with an anxiolytic.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3b255bcd-0218-44f8-830b-971f5ec45276'
  },
  {
    text: 'If these criteria are met and the patient has been fully advised of the risk, and has provided written acknowledgment, felbamate oral suspension can be considered for either monotherapy or adjunctive therapy in the treatment of partial seizures, with and without generalization, in adults with epilepsy and as adjunctive therapy in the treatment of partial and generalized seizures associated with Lennox-Gastaut syndrome in children',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2e325d79-d0a4-4af7-b09b-96ee5a5b2a37'
  },
  {
    text: 'For temporary relief of symptoms related to sleep disorders, Seasonal Affective Disorder, jet lag, and depression.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=fdaf86c2-137d-4926-a63b-9faf7ec7e04c'
  },
  {
    text: 'For temporary relief of symptoms related to sleep disorders, Seasonal Affective Disorder, jet lag, and depression.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=fdaf86c2-137d-4926-a63b-9faf7ec7e04c'
  },
  {
    text: 'EMGALITY is indicated for the treatment of episodic cluster headache in adults.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=33a147be-233a-40e8-a55e-e40936e28db0'
  },
  {
    text: 'For temporary relief of symptoms related to sleep disorders, Seasonal Affective Disorder, jet lag, and depression.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=fdaf86c2-137d-4926-a63b-9faf7ec7e04c'
  },
  {
    text: 'Eszopiclone Tablets are indicated for the treatment of insomnia.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=49f71eb4-15ca-42e2-b62b-7963cc8ef115'
  },
  {
    text: 'Zolpidem Tartrate Tablets is indicated for the short-term treatment of insomnia characterized by difficulties with sleep initiation',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=021153ce-fe27-4ed1-8d88-b4157b0ed734'
  },
  {
    text: 'Quazepam is indicated for the treatment of insomnia characterized by difficulty in falling asleep, frequent nocturnal awakenings, and/or early morning awakenings.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f7d63f3f-5303-48ab-bce2-35fd62c45799'
  },
  {
    text: 'Hydrocodone bitartrate and acetaminophen tablets are indicated for the management of moderate to moderately severe pain severe enough to require an opioid analgesic and for which alternative treatments are inadequate.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=4f505b2a-45a2-4d34-96f6-dedb574cb508'
  },
  {
    text: 'Tramadol hydrochloride tablets are indicated for the management of moderate to moderately severe pain in adults',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ae7c54b1-b440-4cca-97e8-e5b825413d32'
  },
  {
    text: 'Trazodone hydrochloride tablets are indicated for the treatment of major depressive disorder (MDD) in adults',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ed3039d8-3d27-4b71-a4b0-812943c9457f'
  },
  {
    text: 'Citalopram tablets are indicated for the treatment of depression',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2632b547-2e13-447f-ac85-c774e437d6a8'
  },
  {
    text: 'Paroxetine tablets are indicated for the treatment of major depressive disorder.',
    url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=89dd7e24-85fc-4152-89ea-47ec2b48a1ed'
  }
]
