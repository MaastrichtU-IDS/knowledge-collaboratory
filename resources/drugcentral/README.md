## The data

https://drugcentral.org/download

Use the full SQL database?

> Download Database dump 9/18/2020 (Postgres v10.12) - Contains all information in DrugCentral. Requires a new or existing Postgres database setup, please see Postgresql documentation on how to install, configure and load database contents.
>
> Also available via public instance at drugcentral:unmtid-dbs.net:5433, username="drugman", password="dosage", with responsiveness depending on user load. 

Or the TSV? 4.5M

## Query DrugCentral SQL database

Public instance available (use pgAdmin to connect and explore)

* Host: unmtid-dbs.net:5433
* Database: drugcentral
* username="drugman"
* password="dosage"

Get all indications for `acetylsalicylic acid` drug:

```sql
select o.*
from structures s, omop_relationship o
where
s.name = 'acetylsalicylic acid'
AND s.id = o.struct_id
AND o.relationship_name='indication'
```

Get all indications for all drugs (11.138 rows):

```sql
select o.*
from structures s, omop_relationship o
where
s.id = o.struct_id
AND o.relationship_name='indication'
```

To query indications with doid and drugbank_id:

```sql
select * from omop_relationship as o
INNER JOIN identifier on identifier.struct_id = o.struct_id
where o.relationship_name = ‘indication’ and identifier.id_type = ‘DRUGBANK_ID’
```

and

```sql
select * from omop_relationship as o
INNER JOIN doid_xref on doid_xref.xref=o.umls_cui
INNER JOIN identifier on identifier.struct_id = o.struct_id
where o.relationship_name = ‘indication’ and identifier.id_type = ‘DRUGBANK_ID’
```

Example queries from DrugCentral:

```sql
-- select all FDA approved drugs including discontinued and withdrawn
select structures.* from structures,approval where structures.id = approval.struct_id and approval.type = 'FDA';

-- select all FDA approved drugs with 1 or more currently marketed formulation
select structures.* from structures where no_formulations > 0;

-- select drug - target complex PDB ids for mechanism of action targets only
select pdb.struct_id,structures.name,pdb.pdb, pdb.chain_id,pdb.ligand_id,pdb.accession,
      target_component.gene
from pdb,structures,act_table_full,td2tc,target_component where
  pdb.struct_id = structures.id and
  pdb.struct_id = act_table_full.struct_id
  and act_table_full.moa = 1
  and act_table_full.target_id = td2tc.target_id
  and td2tc.component_id = target_component.id
  and target_component.accession = pdb.accession;
  
-- select mechanism of action targets for human targets only
select struct_id,structures.name,target_name,target_class,accession,gene,swissprot,act_value,
	act_type,act_type,act_source,act_source_url,moa_source,moa_source_url from act_table_full,structures where
  	act_table_full.struct_id = structures.id
	and moa = 1 and organism = 'Homo sapiens';


-- select all pharmaceutical formulations containing acetylsalicylic acid (aspirin) from FDA Orange Book
select ob_product.* from ob_product,struct2obprod,structures where
    structures.name = 'acetylsalicylic acid' and structures.id = struct2obprod.struct_id
    and struct2obprod.prod_id = ob_product.id;
    
-- select all significant adverse events associated with Atorvastatin from FDA FAERS database based on likelihood ratio test
select meddra_name,meddra_code,llr,llr_threshold from faers,structures
        where structures.id = faers.struct_id and structures.name = 'atorvastatin'
        and llr > llr_threshold order by llr desc;
```

## Ontop

Example files: https://ontop-vkg.org/tutorial/basic/university-1.html#ontology-classes-and-properties

## How it is published

Each association is published as a separate nanopublication in the Nanopublication network (http://nanopub.org/wordpress/). 

Associations are represented using the BioLink model: https://biolink.github.io/biolink-model

You will need to setup you nanopub private key to run this script (be careful it will publish a duplicate of the nanopublications)

