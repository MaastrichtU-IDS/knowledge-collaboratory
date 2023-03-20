export const settings = {
  frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:4000',
  nanopubGrlcUrl: process.env.GRLC_URL || 'https://grlc.np.dumontierlab.com/api/local/local',
  nanopubSparqlUrl: 'https://virtuoso.nps.petapico.org/sparql',
  orcidClientId: process.env.ORCID_CLIENT_ID || 'APP-TEANCMSUOPYZOGJ3'
};

export const genericContext = {
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  biolink: 'https://w3id.org/biolink/vocab/',
  infores: 'https://w3id.org/biolink/infores/',
  dct: 'http://purl.org/dc/terms/'
};

// https://purl.org/np/RAuN1kyW1BD9754LCUVWozDOhkrUaLUyb5LTu0HcsulIE
export const samples: any = {
  'Drug indication with the BioLink model': {
    '@context': 'https://raw.githubusercontent.com/biolink/biolink-model/master/context.jsonld',
    '@wizardQuestions': {
      'rdf:subject': 'Subject of the association:',
      'rdf:predicate': 'Predicate of the association:',
      'rdf:object': 'Object of the association:',
      'biolink:provided_by': 'Association provided by dataset:',
      'biolink:publications': 'Publication supporting the association:',
      'biolink:association_type': 'Type of the association:',
      'biolink:relation': 'Type of drug indication:',
      'biolink:has_population_context': 'Population context of the drug indication:'
    },
    '@type': 'rdf:Statement',
    'rdfs:label':
      'An atypical drug is now increasingly used as an off-label indication for the management of cancer patients',
    'rdf:subject': {
      '@id': 'https://go.drugbank.com/drugs/DB00334',
      '@type': 'biolink:Drug'
    },
    'rdf:predicate': {
      '@id': 'biolink:treats'
    },
    'rdf:object': {
      '@id': 'https://identifiers.org/HP:0002017',
      '@type': 'biolink:Disease'
    },
    'biolink:association_type': {
      '@id': 'biolink:ChemicalToDiseaseOrPhenotypicFeatureAssociation'
    },
    'biolink:relation': {'@id': 'https://w3id.org/um/neurodkg/OffLabelIndication'},
    'biolink:provided_by': {'@id': 'https://w3id.org/um/NeuroDKG'},
    'biolink:publications': {'@id': 'https://pubmed.ncbi.nlm.nih.gov/29061799/'},
    'biolink:has_population_context': {
      'rdfs:label': 'Adults',
      'biolink:category': {'@id': 'biolink:Cohort'},
      'biolink:has_phenotype': {
        '@id': 'https://identifiers.org/MONDO:0004992',
        '@type': 'biolink:Phenotype'
      }
    }
  },
  'Dataset summary with schema.org': {
    '@context': 'https://schema.org',
    '@wizardQuestions': {
      name: 'Provide the name of this entity:',
      description: 'Give a short description of the content:',
      creator: 'Provide the details of the person who created, or initiated, the creation of this work:',
      contributor: 'Other persons who contributed to, or co-authored, the dataset:',
      publisher: 'Person, or organization, who published this work:',
      inLanguage:
        'What language is used in the description of this dataset? Use ISO 2 language code e.g. EN for English',
      version: 'What is the version number for this dataset? e.g. 1.1.1 or v1.2',
      license: 'Link to the full text of the terms of use (license) for this dataset:',
      encodingFormat: 'What is the file format of this data?',
      url: 'Link to the website or homepage:',
      temporalCoverage:
        'What is the creation or publishing date range for the documents or contents of this dataset? Use https://en.wikipedia.org/wiki/ISO_8601#Time_intervals format - e.g. 2007-03-01/2008-05-11:',
      keywords: 'Provide keywords describing the content in this dataset:',
      distribution: 'Supply a direct download link for this dataset:',
      contentSize: 'How large is the download file size e.g. 128KB, 54MB, 1.5GB?',
      isBasedOn: 'Was this dataset generated with the aid of or using a piece of software?',
      applicationCategory: 'Indicate type of software e.g. Python script or Java GUI application:',
      citation: 'Is there an academic publication which describes or centrally makes use of this dataset?',
      datePublished: 'On what date was the dataset published? YYYY-MM-DD',
      dateCreated: 'On what date was the dataset created? YYYY-MM-DD',
      affiliation: 'This person is affiliated to or employed by:',
      logo: 'Link to an image depicting the logo of this organisation:',
      image: 'Provide a link (URL) to a profile photo of the author of the dataset:',
      sameAs: 'Provide a Digital Object Identifier (DOI) for this publication:',
      frequency: 'How often does a new version get published for this dataset? e.g. daily, weekly, monthly'
    },
    '@type': 'Dataset',
    name: 'ECJ case law text similarity analysis',
    description:
      'results from a study to analyse how closely the textual similarity of ECJ cases resembles the citation network of the cases.',
    version: 'v2.0',
    url: 'https://doi.org/10.5281/zenodo.4228652',
    license: 'https://www.gnu.org/licenses/agpl-3.0.txt',
    encodingFormat: 'CSV',
    temporalCoverage: '2019-09-14/2020-07-01',
    dateCreated: {
      '@type': 'Date',
      '@value': '2019-09-14'
    },
    datePublished: {
      '@type': 'Date',
      '@value': '2020-07-01'
    },
    distribution: {
      '@type': 'DataDownload',
      contentUrl: {
        '@type': 'URL',
        '@value': 'https://zenodo.org/record/4228652/files/docona_cjeu_results_2018_v2_html.zip?download=1'
      },
      encodingFormat: 'application/zip',
      contentSize: '1.1MB'
    },
    inLanguage: {
      '@type': 'Language',
      name: 'EN',
      alternateName: 'EN'
    },
    keywords: ['case law', 'court decisions', 'text similarity', 'network analysis'],
    creator: {
      '@type': 'Person',
      name: 'concat @givenName @familyName',
      givenName: 'Kody',
      familyName: 'Moodley',
      image:
        'https://www.maastrichtuniversity.nl/sites/default/files/styles/text_with_image_mobile_portrait/public/profile/kody.moodley/kody.moodley_photo_kmoodley.jpg?itok=bN7b8s_-&timestamp=1583505301',
      jobTitle: 'Postdoctoral researcher',
      email: 'kody.moodley@maastrichtuniversity.nl',
      affiliation: {
        '@type': 'Organization',
        name: 'Maastricht Law & Tech Lab',
        url: {
          '@type': 'URL',
          '@value': 'https://www.maastrichtuniversity.nl/about-um/faculties/law/research/law-and-tech-lab'
        },
        logo: {
          '@type': 'ImageObject',
          contentUrl:
            'https://www.maastrichtuniversity.nl/sites/default/files/styles/page_photo/public/compacte20versie20law20and20tech20lab.jpg?itok=7lm6PEQF'
        }
      }
    },
    contributor: [
      {
        '@type': 'Person',
        givenName: 'Pedro',
        familyName: 'Hernandez Serrano',
        jobTitle: 'Data Scientist',
        email: 'p.hernandezserrano@maastrichtuniversity.nl',
        image:
          'https://www.maastrichtuniversity.nl/sites/default/files/styles/text_with_image_mobile_portrait/public/profile/p.hernandezserrano/p.hernandezserrano_PP%20%287%20of%2013%29.jpg?itok=IUdreoIw&timestamp=1610395201',
        affiliation: {
          '@type': 'Organization',
          name: 'Institute of Data Science',
          url: {
            '@type': 'URL',
            '@value': 'https://www.maastrichtuniversity.nl/research/institute-data-science'
          },
          logo: {
            '@type': 'ImageObject',
            contentUrl: 'https://avatars.githubusercontent.com/u/36262526?s=280&v=4'
          }
        }
      }
    ],
    publisher: {
      '@type': 'Person',
      name: 'Kody Moodley',
      givenName: 'Kody',
      familyName: 'Moodley',
      jobTitle: 'Postdoctoral researcher',
      image:
        'https://www.maastrichtuniversity.nl/sites/default/files/styles/text_with_image_mobile_portrait/public/profile/kody.moodley/kody.moodley_photo_kmoodley.jpg?itok=bN7b8s_-&timestamp=1583505301',
      email: 'kody.moodley@maastrichtuniversity.nl',
      affiliation: {
        '@type': 'Organization',
        name: 'Maastricht Law & Tech Lab',
        url: {
          '@type': 'URL',
          '@value': 'https://www.maastrichtuniversity.nl/about-um/faculties/law/research/law-and-tech-lab'
        },
        logo: {
          '@type': 'ImageObject',
          contentUrl:
            'https://www.maastrichtuniversity.nl/sites/default/files/styles/page_photo/public/compacte20versie20law20and20tech20lab.jpg?itok=7lm6PEQF'
        }
      }
    }
  }
};
