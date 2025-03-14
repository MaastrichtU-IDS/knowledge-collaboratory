import logging
import secrets
from typing import Optional, Union

from pydantic import validator, BaseSettings
# from pydantic_settings import BaseSettings
# from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROD_URL: str = "https://collaboratory-api.transltr.io"
    TEST_URL: str = "https://collaboratory-api.test.transltr.io"
    STAGING_URL: str = "https://collaboratory-api.ci.transltr.io"
    DEV_URL: str = "https://api.collaboratory.semanticscience.org"

    VIRTUAL_HOST: Optional[str] = None

    BIOLINK_VERSION: str = "3.1.0"
    TRAPI_VERSION: str = "1.5.0" #1.4.0

    OPENAI_APIKEY: str = ""
    BIOPORTAL_APIKEY: str = ""

    # Those defaults are used by GitHub Actions for testing
    # The settings used by Docker deployment are in the .env file
    PROJECT_NAME: str = "Knowledge Collaboratory API"
    DATA_PATH: str = "/data"
    KEYSTORE_PATH: str = "./nanopub-keystore"
    NER_MODELS_PATH: str = "./ner-models"

    # https://monitor.np.trustyuri.net/
    # NANOPUB_GRLC_URL: str = "https://grlc.np.dumontierlab.com/api/local/local"
    NANOPUB_SPARQL_URL: str = "https://virtuoso.nps.knowledgepixels.com/sparql"

    # NANOPUB_SPARQL_URL: str = "https://virtuoso.test.nps.knowledgepixels.com/sparql"

    # SERVER_NAME: str = 'localhost'
    # SERVER_HOST: AnyHttpUrl = 'http://localhost'

    FRONTEND_URL: str = "http://localhost:19006"
    OAUTH_REDIRECT_FRONTEND: str = "http://localhost:19006"

    ORCID_CLIENT_ID: Optional[str]
    ORCID_CLIENT_SECRET: Optional[str]
    BACKEND_URL: str = "http://localhost"
    # BACKEND_URL: str = "http://localhost:8000"

    API_PATH: str = ""
    SECRET_KEY: str = secrets.token_urlsafe(32)
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    INSTALL_DEV: bool = False
    DEV_MODE: bool = False

    # BACKEND_CORS_ORIGINS is a JSON-formatted list of origins
    # e.g: '["http://localhost", "http://localhost:4200", "http://localhost:3000", \
    # "http://localhost:8080", "http://local.dockertoolbox.tiangolo.com"]'
    BACKEND_CORS_ORIGINS: list[str] = ["*"]

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, list[str]]) -> Union[list[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # SENTRY_DSN: Optional[HttpUrl] = None

    # @validator("SENTRY_DSN", pre=True)
    # def sentry_dsn_can_be_blank(cls, v: str) -> Optional[str]:
    #     if len(v) == 0:
    #         return None
    #     return v

    class Config:
        case_sensitive = True
        env_file = ".env"
    # model_config = SettingsConfigDict(env_file=".env", env_file_encoding='utf-8')

    def __init__(
        self,
        *args,
        **kwargs
    ) -> None:
        super().__init__(
            *args,
            **kwargs,
        )
        self.KEYSTORE_PATH = self.DATA_PATH + "/nanopub-keystore"
        self.NER_MODELS_PATH = self.DATA_PATH + "/ner-models"



settings = Settings()


# Configure logger
logger = logging.getLogger()
logger.setLevel(level=logging.INFO)
console_handler = logging.StreamHandler()
formatter = logging.Formatter("%(asctime)s %(levelname)s: [%(module)s:%(funcName)s] %(message)s")
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)


biolink_context = {
    "APO": "http://purl.obolibrary.org/obo/APO_",
    "AspGD": "http://www.aspergillusgenome.org/cgi-bin/locus.pl?dbid=",
    "BFO": "http://purl.obolibrary.org/obo/BFO_",
    "BIGG.METABOLITE": "http://identifiers.org/bigg.metabolite/",
    "BIGG.REACTION": "http://identifiers.org/bigg.reaction/",
    "BIOGRID": "http://identifiers.org/biogrid/",
    "BIOSAMPLE": "http://identifiers.org/biosample/",
    "BSPO": "http://purl.obolibrary.org/obo/BSPO_",
    "BTO": "http://purl.obolibrary.org/obo/BTO_",
    "CAID": "http://reg.clinicalgenome.org/redmine/projects/registry/genboree_registry/by_caid?caid=",
    "CAS": "http://identifiers.org/cas/",
    "CATH": "http://identifiers.org/cath/",
    "CATH.SUPERFAMILY": "http://identifiers.org/cath.superfamily/",
    "CDD": "http://identifiers.org/cdd/",
    "CHADO": "http://gmod.org/wiki/Chado/",
    "CHEBI": "http://purl.obolibrary.org/obo/CHEBI_",
    "CHEMBL.COMPOUND": "http://identifiers.org/chembl.compound/",
    "CHEMBL.MECHANISM": "https://www.ebi.ac.uk/chembl/mechanism/inspect/",
    "CHEMBL.TARGET": "http://identifiers.org/chembl.target/",
    "CID": "http://pubchem.ncbi.nlm.nih.gov/compound/",
    "CIO": "http://purl.obolibrary.org/obo/CIO_",
    "CL": "http://purl.obolibrary.org/obo/CL_",
    "CLINVAR": "http://identifiers.org/clinvar",
    "CLO": "http://purl.obolibrary.org/obo/CLO_",
    "COAR_RESOURCE": "http://purl.org/coar/resource_type/",
    "COG": "https://www.ncbi.nlm.nih.gov/research/cog-project/",
    "CPT": "https://www.ama-assn.org/practice-management/cpt/",
    "CTD": "http://ctdbase.org/",
    "CTD.CHEMICAL": "http://ctdbase.org/detail.go?type=chem&acc=",
    "CTD.DISEASE": "http://ctdbase.org/detail.go?type=disease&db=MESH&acc=",
    "CTD.GENE": "http://ctdbase.org/detail.go?type=gene&acc=",
    "ChemBank": "http://chembank.broadinstitute.org/chemistry/viewMolecule.htm?cbid=",
    "ClinVarVariant": "http://www.ncbi.nlm.nih.gov/clinvar/variation/",
    "DBSNP": "http://identifiers.org/dbsnp/",
    "DDANAT": "http://purl.obolibrary.org/obo/DDANAT_",
    "DGIdb": "https://www.dgidb.org/interaction_types",
    "DOID": "http://purl.obolibrary.org/obo/DOID_",
    "DOID-PROPERTY": "http://purl.obolibrary.org/obo/doid#",
    "DRUGBANK": "http://identifiers.org/drugbank/",
    "DrugCentral": "http://drugcentral.org/drugcard/",
    "EC": "http://www.enzyme-database.org/query.php?ec=",
    "ECO": "http://purl.obolibrary.org/obo/ECO_",
    "ECTO": "http://purl.obolibrary.org/obo/ECTO_",
    "EDAM-DATA": "http://edamontology.org/data_",
    "EDAM-FORMAT": "http://edamontology.org/format_",
    "EDAM-OPERATION": "http://edamontology.org/operation_",
    "EDAM-TOPIC": "http://edamontology.org/topic_",
    "EFO": "http://www.ebi.ac.uk/efo/EFO_",
    "EGGNOG": "http://identifiers.org/eggnog/",
    "ENSEMBL": "http://identifiers.org/ensembl/",
    "ENVO": "http://purl.obolibrary.org/obo/ENVO_",
    "ExO": "http://purl.obolibrary.org/obo/ExO_",
    "FAO": "http://purl.obolibrary.org/obo/FAO_",
    "FB": "http://identifiers.org/fb/",
    "FBcv": "http://purl.obolibrary.org/obo/FBcv_",
    "FMA": "http://purl.obolibrary.org/obo/FMA_",
    "FOODON": "http://purl.obolibrary.org/obo/FOODON_",
    "FYPO": "http://purl.obolibrary.org/obo/FYPO_",
    "GAMMA": "http://translator.renci.org/GAMMA_",
    "GENEPIO": "http://purl.obolibrary.org/obo/GENEPIO_",
    "GENO": "http://purl.obolibrary.org/obo/GENO_",
    "GO": "http://purl.obolibrary.org/obo/GO_",
    "GOLD.META": "http://identifiers.org/gold.meta/",
    "GOP": "http://purl.obolibrary.org/obo/go#",
    "GOREL": "http://purl.obolibrary.org/obo/GOREL_",
    "GSID": "https://scholar.google.com/citations?user=",
    "GTEx": "https://www.gtexportal.org/home/gene/",
    "GTOPDB": "https://www.guidetopharmacology.org/GRAC/LigandDisplayForward?ligandId=",
    "HAMAP": "http://identifiers.org/hamap/",
    "HANCESTRO": "http://www.ebi.ac.uk/ancestro/ancestro_",
    "HCPCS": "http://purl.bioontology.org/ontology/HCPCS/",
    "HGNC": "http://identifiers.org/hgnc/",
    "HGNC.FAMILY": "http://identifiers.org/hgnc.family/",
    "HMDB": "http://identifiers.org/hmdb/",
    "HP": "http://purl.obolibrary.org/obo/HP_",
    "HsapDv": "http://purl.obolibrary.org/obo/HsapDv_",
    "IAO": "http://purl.obolibrary.org/obo/IAO_",
    "ICD10": "https://icd.codes/icd9cm/",
    "ICD9": "http://translator.ncats.nih.gov/ICD9_",
    "IDO": "http://purl.obolibrary.org/obo/IDO_",
    "INCHI": "http://identifiers.org/inchi/",
    "INCHIKEY": "http://identifiers.org/inchikey/",
    "INO": "http://purl.obolibrary.org/obo/INO_",
    "INTACT": "http://identifiers.org/intact/",
    "IUPHAR.FAMILY": "http://identifiers.org/iuphar.family/",
    "KEGG": "http://identifiers.org/kegg/",
    "KEGG.BRITE": "http://www.kegg.jp/entry/",
    "KEGG.COMPOUND": "http://identifiers.org/kegg.compound/",
    "KEGG.DGROUP": "http://www.kegg.jp/entry/",
    "KEGG.DISEASE": "http://identifiers.org/kegg.disease/",
    "KEGG.DRUG": "http://identifiers.org/kegg.drug/",
    "KEGG.ENVIRON": "http://identifiers.org/kegg.environ/",
    "KEGG.ENZYME": "http://www.kegg.jp/entry/",
    "KEGG.GENE": "http://www.kegg.jp/entry/",
    "KEGG.GLYCAN": "http://identifiers.org/kegg.glycan/",
    "KEGG.MODULE": "http://identifiers.org/kegg.module/",
    "KEGG.ORTHOLOGY": "http://identifiers.org/kegg.orthology/",
    "KEGG.PATHWAY": "https://www.kegg.jp/entry/",
    "KEGG.RCLASS": "http://www.kegg.jp/entry/",
    "KEGG.REACTION": "http://identifiers.org/kegg.reaction/",
    "LOINC": "http://loinc.org/rdf/",
    "MAXO": "http://purl.obolibrary.org/obo/MAXO_",
    "MEDDRA": "http://identifiers.org/meddra/",
    "MESH": "http://id.nlm.nih.gov/mesh/",
    "METANETX.REACTION": "https://www.metanetx.org/equa_info/",
    "MGI": "http://identifiers.org/mgi/",
    "MI": "http://purl.obolibrary.org/obo/MI_",
    "MIR": "http://identifiers.org/mir/",
    "MONDO": "http://purl.obolibrary.org/obo/MONDO_",
    "MP": "http://purl.obolibrary.org/obo/MP_",
    "MPATH": "http://purl.obolibrary.org/obo/MPATH_",
    "MSigDB": "https://www.gsea-msigdb.org/gsea/msigdb/",
    "NBO": "http://purl.obolibrary.org/obo/NBO_",
    "NBO-PROPERTY": "http://purl.obolibrary.org/obo/nbo#",
    "NCBIGene": "http://identifiers.org/ncbigene/",
    "NCBITaxon": "http://purl.obolibrary.org/obo/NCBITaxon_",
    "NCIT": "http://purl.obolibrary.org/obo/NCIT_",
    "NCIT-OBO": "http://purl.obolibrary.org/obo/ncit#",
    "NDC": "http://identifiers.org/ndc/",
    "NDDF": "http://purl.bioontology.org/ontology/NDDF/",
    "NLMID": "https://www.ncbi.nlm.nih.gov/nlmcatalog/?term=",
    "OBAN": "http://purl.org/oban/",
    "OBI": "http://purl.obolibrary.org/obo/OBI_",
    "OBOREL": "http://purl.obolibrary.org/obo/RO_",
    "OGMS": "http://purl.obolibrary.org/obo/OGMS_",
    "OIO": "http://www.geneontology.org/formats/oboInOwl#",
    "OMIM": "http://purl.obolibrary.org/obo/OMIM_",
    "OMIM.PS": "https://www.omim.org/phenotypicSeries/",
    "ORCID": "https://orcid.org/",
    "ORPHA": "http://www.orpha.net/ORDO/Orphanet_",
    "ORPHANET": "http://identifiers.org/orphanet/",
    "PANTHER.FAMILY": "http://www.pantherdb.org/panther/family.do?clsAccession=",
    "PANTHER.PATHWAY": "http://identifiers.org/panther.pathway/",
    "PATO": "http://purl.obolibrary.org/obo/PATO_",
    "PCO": "http://purl.obolibrary.org/obo/PCO_",
    "PFAM": "http://identifiers.org/pfam/",
    "PHARMGKB.PATHWAYS": "http://identifiers.org/pharmgkb.pathways/",
    "PHAROS": "http://pharos.nih.gov",
    "PIRSF": "http://identifiers.org/pirsf/",
    "PMID": "http://www.ncbi.nlm.nih.gov/pubmed/",
    "PO": "http://purl.obolibrary.org/obo/PO_",
    "PR": "http://purl.obolibrary.org/obo/PR_",
    "PRINTS": "http://identifiers.org/prints/",
    "PRODOM": "http://identifiers.org/prodom/",
    "PROSITE": "http://identifiers.org/prosite/",
    "PUBCHEM.COMPOUND": "http://identifiers.org/pubchem.compound/",
    "PUBCHEM.SUBSTANCE": "http://identifiers.org/pubchem.substance/",
    "PW": "http://purl.obolibrary.org/obo/PW_",
    "PathWhiz": "http://smpdb.ca/pathways/#",
    "PomBase": "https://www.pombase.org/gene/",
    "REACT": "http://www.reactome.org/PathwayBrowser/#/",
    "REPODB": "http://apps.chiragjpgroup.org/repoDB/",
    "RFAM": "http://identifiers.org/rfam/",
    "RGD": "http://identifiers.org/rgd/",
    "RHEA": "http://identifiers.org/rhea/",
    "RNACENTRAL": "http://identifiers.org/rnacentral/",
    "RO": "http://purl.obolibrary.org/obo/RO_",
    "RXCUI": "https://mor.nlm.nih.gov/RxNav/search?searchBy=RXCUI&searchTerm=",
    "RXNORM": "http://purl.bioontology.org/ontology/RXNORM/",
    "ResearchID": "https://publons.com/researcher/",
    "SEED.REACTION": "https://modelseed.org/biochem/reactions/",
    "SEMMEDDB": "https://skr3.nlm.nih.gov/SemMedDB",
    "SEPIO": "http://purl.obolibrary.org/obo/SEPIO_",
    "SGD": "http://identifiers.org/sgd/",
    "SIDER.DRUG": "http://identifiers.org/sider.drug/",
    "SIO": "http://semanticscience.org/resource/SIO_",
    "SMART": "http://identifiers.org/smart/",
    "SMPDB": "http://identifiers.org/smpdb/",
    "SNOMED": "http://www.snomedbrowser.com/Codes/Details/",
    "SNOMEDCT": "http://www.snomedbrowser.com/Codes/Details/",
    "SO": "http://purl.obolibrary.org/obo/SO_",
    "STATO": "http://purl.obolibrary.org/obo/STATO_",
    "STY": "http://purl.bioontology.org/ontology/STY/",
    "SUPFAM": "http://identifiers.org/supfam/",
    "ScopusID": "https://www.scopus.com/authid/detail.uri?authorId=",
    "TAXRANK": "http://purl.obolibrary.org/obo/TAXRANK_",
    "TCDB": "http://identifiers.org/tcdb/",
    "TIGRFAM": "http://identifiers.org/tigrfam/",
    "TO": "http://purl.obolibrary.org/obo/TO_",
    "UBERGRAPH": "http://translator.renci.org/ubergraph-axioms.ofn#",
    "UBERON": "http://purl.obolibrary.org/obo/UBERON_",
    "UBERON_CORE": "http://purl.obolibrary.org/obo/uberon/core#",
    "UBERON_NONAMESPACE": "http://purl.obolibrary.org/obo/core#",
    "UMLS": "http://identifiers.org/umls/",
    "UMLSSG": "https://lhncbc.nlm.nih.gov/semanticnetwork/download/sg_archive/SemGroups-v04.txt",
    "UNII": "http://identifiers.org/unii/",
    "UNIPROT.ISOFORM": "http://identifiers.org/uniprot.isoform/",
    "UO-PROPERTY": "http://purl.obolibrary.org/obo/uo#",
    "UPHENO": "http://purl.obolibrary.org/obo/UPHENO_",
    "UniProtKB": "http://identifiers.org/uniprot/",
    "VANDF": "https://www.nlm.nih.gov/research/umls/sourcereleasedocs/current/VANDF/",
    "VMC": "https://github.com/ga4gh/vr-spec/",
    "WB": "http://identifiers.org/wb/",
    "WBPhenotype": "http://purl.obolibrary.org/obo/WBPhenotype_",
    "WBVocab": "http://bio2rdf.org/wormbase_vocabulary",
    "WIKIDATA": "https://www.wikidata.org/wiki/",
    "WIKIDATA_PROPERTY": "https://www.wikidata.org/wiki/Property:",
    "WIKIPATHWAYS": "http://identifiers.org/wikipathways/",
    "WormBase": "https://www.wormbase.org/get?name=",
    "XCO": "http://purl.obolibrary.org/obo/XCO_",
    "XPO": "http://purl.obolibrary.org/obo/XPO_",
    "Xenbase": "http://www.xenbase.org/gene/showgene.do?method=display&geneId=",
    "ZFIN": "http://identifiers.org/zfin/",
    "ZP": "http://purl.obolibrary.org/obo/ZP_",
    "alliancegenome": "https://www.alliancegenome.org/",
    "apollo": "https://github.com/GMOD/Apollo",
    "biolink": "https://w3id.org/biolink/vocab/",
    "bioschemas": "https://bioschemas.org/",
    "dcat": "http://www.w3.org/ns/dcat#",
    "dcid": "https://datacommons.org/browser/",
    "dct": "http://purl.org/dc/terms/",
    "dctypes": "http://purl.org/dc/dcmitype/",
    "dictyBase": "http://dictybase.org/gene/",
    "doi": "https://doi.org/",
    "fabio": "http://purl.org/spar/fabio/",
    "faldo": "http://biohackathon.org/resource/faldo#",
    "foaf": "http://xmlns.com/foaf/0.1/",
    "foodb.compound": "http://foodb.ca/compounds/",
    "gff3": "https://github.com/The-Sequence-Ontology/Specifications/blob/master/gff3.md#",
    "gpi": "https://github.com/geneontology/go-annotation/blob/master/specs/gpad-gpi-2-0.md#",
    "gtpo": "https://rdf.guidetopharmacology.org/ns/gtpo#",
    "interpro": "https://www.ebi.ac.uk/interpro/entry/",
    "isbn": "https://www.isbn-international.org/identifier/",
    "isni": "https://isni.org/isni/",
    "issn": "https://portal.issn.org/resource/ISSN/",
    "linkml": "https://w3id.org/linkml/",
    "medgen": "https://www.ncbi.nlm.nih.gov/medgen/",
    "metacyc.reaction": "https://identifiers.org/metacyc.reaction:",
    "mirbase": "http://identifiers.org/mirbase",
    "oboInOwl": "http://www.geneontology.org/formats/oboInOwl#",
    "oboformat": "http://www.geneontology.org/formats/oboInOwl#",
    "os": "https://github.com/cmungall/owlstar/blob/master/owlstar.ttl",
    "owl": "http://www.w3.org/2002/07/owl#",
    "pav": "http://purl.org/pav/",
    "prov": "http://www.w3.org/ns/prov#",
    "qud": "http://qudt.org/1.1/schema/qudt#",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "schema": "http://schema.org/",
    "skos": "http://www.w3.org/2004/02/skos/core#",
    "wgs": "http://www.w3.org/2003/01/geo/wgs84_pos",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
}
