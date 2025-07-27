"""
Configuration module for database and application settings.
Uses Pydantic for settings management and validation.
Supports environment variables through .env file.
"""

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """
    Application settings class that manages configuration.
    Loads settings from environment variables or uses defaults.
    """
    
    # Database default settings
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_USER: str = "postgres"
    DB_PASSWORD: str = ""
    DB_NAME: str = "DemoApiTest"
    
    # Project paths
    BASE_DIR: Path = Path(__file__).parent.parent
    SQL_DIR: Path = BASE_DIR / "SQL"
    
    @property
    def DATABASE_URL(self) -> str:
        """Constructs PostgreSQL database URL from settings."""
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

# Create global settings instance
settings = Settings()
print(settings.DATABASE_URL)