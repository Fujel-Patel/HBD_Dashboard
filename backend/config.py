import os
from dotenv import load_dotenv
load_dotenv()
class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")  

    SQLALCHEMY_DATABASE_URI = (
    f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}"
    f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT','3306')}/{os.getenv('DB_NAME')}"
)
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
    }

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret")  # for token

    # Add ETL/Google Drive/Batch config for Celery tasks
    SERVICE_ACCOUNT_FILE = os.getenv(
        "SERVICE_ACCOUNT_FILE",
        os.path.join(os.getcwd(), "model", "honey-bee-digital-d96daf6e6faf.json")
    )
    DATABASE_URI = os.getenv(
        "DATABASE_URI",
        f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD_PLAIN') or ''}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT', '3306')}/{os.getenv('DB_NAME')}"
    )
    MAX_FILE_SIZE_MB = int(os.getenv("MAX_FILE_SIZE_MB", "100"))
    ETL_VERSION = os.getenv("ETL_VERSION", "2.0.0")
    BATCH_SIZE = int(os.getenv("BATCH_SIZE", "2000"))

# Instantiate config for import convenience
config = Config()
