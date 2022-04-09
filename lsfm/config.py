import os

from dotenv import load_dotenv
from pathlib import Path

load_dotenv()


BASE_DIR = Path(__file__).resolve().parent.parent

PYTHON_ENV = os.environ.get("FLASK_ENV", "production")
