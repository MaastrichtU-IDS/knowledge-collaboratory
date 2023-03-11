---
title: About the Knowledge Collaboratory
layout: ../layouts/MarkdownLayout.astro
---

## ℹ️ About

The Knowledge Collaboratory is a web service to help annotate biomedical text, query and publish [Nanopublications](https://nanopub.net/) for the [NIH NCATS Biomedical Data Translator project](https://ncats.nih.gov/translator). It provide the following functionalities:

🔎 **Browse Nanopublications** through the web UI, or query them using the **Translator Reasoner API (TRAPI)** specifications.

✒️ **Annotate biomedical text** and publish the annotations as nanopublications after login with your [ORCID](https://orcid.org/).

Developed and hosted by the [Institute of Data Science](https://www.maastrichtuniversity.nl/research/institute-data-science) at Maastricht University.

## ⚙️ How it works

The Knowledge Collaboratory consists in an OpenAPI service and a  user-friendly web UI to query the Nanopublications network, store  Nanopublication authentication keys, and publish Nanopublications.

🗄️ **Backend API**: an OpenAPI built with Python and FastAPI, to store the keys on the server, and run the process to publish a Nanopublication.

🌐 **Webapp frontend**: a website built with TypeScript, ReactJS and Astro, to provide a user-friendly access to the Nanopublication network.