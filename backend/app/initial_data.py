import logging
from pathlib import Path

from app.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def main() -> None:
    logger.info("Creating keystore folder: " + settings.KEYSTORE_PATH)
    Path(settings.KEYSTORE_PATH).mkdir(parents=True, exist_ok=True)
    logger.info("Keystore folder created")


if __name__ == "__main__":
    main()
