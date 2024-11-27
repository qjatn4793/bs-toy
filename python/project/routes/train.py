from flask import Blueprint, request, jsonify
from model import SimpleLLM
import json

train_bp = Blueprint('train', __name__)

# LLM 모델 초기화
llm = SimpleLLM()

@train_bp.route('/', methods=['POST'])
def train():
    data = request.get_json()
    question = data.get('question')
    answer = data.get('answer')

    if question and answer:
        # 새로운 질문-답변 쌍 학습
        llm.add_qa_pair(question, answer)
        return jsonify({"message": "Training data updated."}), 200
    else:
        return jsonify({"error": "Question and answer are required."}), 400