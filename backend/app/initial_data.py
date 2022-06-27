import logging
import os
from pathlib import Path

from app.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# NOT USED

def main() -> None:
    logger.info("Creating keystore folder: " + settings.KEYSTORE_PATH)
    Path(settings.KEYSTORE_PATH).mkdir(parents=True, exist_ok=True)
    logger.info("Keystore folder created")

    if not os.path.exists(f"{settings.NER_MODELS_PATH}/litcoin-ner-model"):
        os.system("wget https://download.dumontierlab.com/ner-models/litcoin-ner-model.zip")
        os.system(f'mkdir -p {settings.NER_MODELS_PATH}/litcoin-ner-model"')
        os.system(f'unzip "{settings.NER_MODELS_PATH}/*.zip" -d {settings.NER_MODELS_PATH}/litcoin-ner-model"')
        os.system(f"rm {settings.NER_MODELS_PATH}/*.zip")

    if not os.path.exists(f"{settings.NER_MODELS_PATH}/litcoin-relations-extraction-model"):
        os.system("wget https://download.dumontierlab.com/ner-models/litcoin-relations-extraction-model.zip")
        os.system(f'mkdir -p {settings.NER_MODELS_PATH}/litcoin-ner-model"')
        os.system(f'unzip "{settings.NER_MODELS_PATH}/*.zip" -d {settings.NER_MODELS_PATH}/litcoin-ner-model"')
        os.system(f"rm {settings.NER_MODELS_PATH}/*.zip")



if __name__ == "__main__":
    main()
