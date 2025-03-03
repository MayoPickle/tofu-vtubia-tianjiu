# config.py
import os

class Config:
    """基础配置类"""
    DEBUG = False
    TESTING = False
    SECRET_KEY = os.environ.get('SECRET_KEY', 'mysecretkey')
    UPLOAD_FOLDER = 'uploads'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB
    DB_PATH = os.environ.get('DB_PATH', 'songs.db')

class ProductionConfig(Config):
    """生产环境配置"""
    pass

class DevelopmentConfig(Config):
    """开发环境配置"""
    DEBUG = True

class TestingConfig(Config):
    """测试环境配置"""
    TESTING = True
    DB_PATH = 'test_songs.db'

# 根据环境变量选择配置
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

def get_config():
    """根据环境变量获取配置"""
    env = os.environ.get('FLASK_ENV', 'default')
    return config.get(env, config['default']) 