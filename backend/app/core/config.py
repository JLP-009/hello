from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    backend_env: str = "development"
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000
    database_url: str
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    cors_origins: list[str] = ["http://localhost:3000"]
    firebase_project_id: str
    firebase_web_api_key: str
    rate_limit_per_minute: int = 60


settings = Settings()
