from flask import Flask
from routes.train import train_bp
from routes.utterance import utterance_bp
from routes.update_training import update_training_bp
from routes.crawler import crawler_bp

app = Flask(__name__)

# 블루프린트 등록
app.register_blueprint(train_bp, url_prefix='/train')
app.register_blueprint(utterance_bp, url_prefix='/utterance')
app.register_blueprint(update_training_bp, url_prefix='/update_training')
app.register_blueprint(crawler_bp, url_prefix='/crawler')

if __name__ == "__main__":
    app.run(port=7000)
