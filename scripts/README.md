# 📬️ Scripts to publish Nanopubs

A collection of python scripts to publish Nanopublications from small structured datasets (e.g. CSV)

## Install

Require java installed

Install requirements:

```bash
pip install -e .
```

You will need to have your nanopub profile (with your public/private key pair) setup in `~/.nanopub` 

Checkout the [official Nanopub documentation](https://nanopub.readthedocs.io) to set it up if it is not already done.

## Run

Publish off-label drug indications stored in gdocs:

```bash
python publish_offlabel_drug_indications.py
```

Publish drug indications used for OpenPredict gold standard:

```bash
python publish_predict_drugdisease.py
```

