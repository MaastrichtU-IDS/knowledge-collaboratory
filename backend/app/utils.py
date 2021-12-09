# import json
# import rdflib
# from rdflib import ConjunctiveGraph
# from app.config import settings

mime_types = {
    'datacite_json': 'application/vnd.datacite.datacite+json',
    'datacite_xml': 'application/vnd.datacite.datacite+xml',
    'schemaorg': 'application/vnd.schemaorg.ld+json, application/ld+json',
    'html': 'text/html, application/xhtml+xml',
    'html_xml': 'text/html, application/xhtml+xml, application/xml;q=0.5, text/xml;q=0.5, application/rdf+xml;q=0.5',
    'xml': 'application/xml, text/xml;q=0.5',
    'json': 'application/json, text/json;q=0.5',
    'jsonld': 'application/ld+json',
    'atom': 'application/atom+xml',
    'rdfjson': 'application/rdf+json',
    'nt': 'text/n3, application/n-triples',
    'rdfxml': 'application/rdf+xml, text/rdf;q=0.5, application/xml;q=0.1, text/xml;q=0.1',
    'turtle': 'text/ttl, text/turtle, application/turtle, application/x-turtle;q=0.6, text/n3;q=0.3, text/rdf+n3;q=0.3, application/rdf+n3;q=0.3',
    # 'rdf': 'text/turtle, application/turtle, application/x-turtle;q=0.8, application/rdf+xml, text/n3;q=0.9, text/rdf+n3;q=0.9,application/ld+json',
    'rdf': 'application/ld+json;q=0.9, text/turtle, application/turtle, application/x-turtle;q=0.8, application/rdf+xml, text/n3, text/rdf+n3;q=0.7',
    'default': '*/*'
}



# def send_email(
#     email_to: str,
#     subject_template: str = "",
#     html_template: str = "",
#     environment: Dict[str, Any] = {},
# ) -> None:
#     assert settings.EMAILS_ENABLED, "no provided configuration for email variables"
#     message = emails.Message(
#         subject=JinjaTemplate(subject_template),
#         html=JinjaTemplate(html_template),
#         mail_from=(settings.EMAILS_FROM_NAME, settings.EMAILS_FROM_EMAIL),
#     )
#     smtp_options = {"host": settings.SMTP_HOST, "port": settings.SMTP_PORT}
#     if settings.SMTP_TLS:
#         smtp_options["tls"] = True
#     if settings.SMTP_USER:
#         smtp_options["user"] = settings.SMTP_USER
#     if settings.SMTP_PASSWORD:
#         smtp_options["password"] = settings.SMTP_PASSWORD
#     response = message.send(to=email_to, render=environment, smtp=smtp_options)
#     logging.info(f"send email result: {response}")

# def send_test_email(email_to: str) -> None:
#     project_name = settings.PROJECT_NAME
#     subject = f"{project_name} - Test email"
#     with open(Path(settings.EMAIL_TEMPLATES_DIR) / "test_email.html") as f:
#         template_str = f.read()
#     send_email(
#         email_to=email_to,
#         subject_template=subject,
#         html_template=template_str,
#         environment={"project_name": settings.PROJECT_NAME, "email": email_to},
#     )