"""
Test configuration for pytest
MYK Seviye 5 uyumlu test altyapısı
"""

import sys
import os

# Add src directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest  # noqa: E402
from main import app as flask_app  # noqa: E402


@pytest.fixture
def app():
    """Flask uygulama fixture'ı"""
    flask_app.config.update(
        {"TESTING": True, "WTF_CSRF_ENABLED": False, "SECRET_KEY": "test-secret-key"}
    )

    yield flask_app


@pytest.fixture
def client(app):
    """Test client fixture'ı"""
    return app.test_client()


@pytest.fixture
def runner(app):
    """CLI runner fixture'ı"""
    return app.test_cli_runner()
