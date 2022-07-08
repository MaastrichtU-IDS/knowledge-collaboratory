import logging
import os
from pathlib import Path

from app.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Automatically executed when the docker container is started

def main() -> None:
    logger.info("🔑 Using keystore folder: " + settings.KEYSTORE_PATH)
    Path(settings.KEYSTORE_PATH).mkdir(parents=True, exist_ok=True)
    logger.info("Keystore folder created")

    if not os.path.exists(f"{settings.NER_MODELS_PATH}/litcoin-ner-model"):
        logger.info("📥️ litcoin-ner-model not present, downloading it")
        os.system(f"wget -O {settings.NER_MODELS_PATH}/litcoin-ner-model.zip https://download.dumontierlab.com/ner-models/litcoin-ner-model.zip")
        Path(f"{settings.NER_MODELS_PATH}/litcoin-ner-model").mkdir(parents=True, exist_ok=True)
        os.system(f'unzip "{settings.NER_MODELS_PATH}/*.zip" -d {settings.NER_MODELS_PATH}')
        os.system(f"rm {settings.NER_MODELS_PATH}/*.zip")
    else:
        logger.info("✅ litcoin-ner-model already present")

    if not os.path.exists(f"{settings.NER_MODELS_PATH}/litcoin-relations-extraction-model"):
        logger.info("📥️ litcoin-relations-extraction-model not present, downloading it")
        os.system(f"wget -O {settings.NER_MODELS_PATH}/litcoin-relations-extraction-model.zip https://download.dumontierlab.com/ner-models/litcoin-relations-extraction-model.zip")
        Path(f"{settings.NER_MODELS_PATH}/litcoin-relations-extraction-model").mkdir(parents=True, exist_ok=True)
        os.system(f'unzip "{settings.NER_MODELS_PATH}/*.zip" -d {settings.NER_MODELS_PATH}')
        os.system(f"rm {settings.NER_MODELS_PATH}/*.zip")
    else:
        logger.info("✅ litcoin-relations-extraction-model already present")



if __name__ == "__main__":
    main()
