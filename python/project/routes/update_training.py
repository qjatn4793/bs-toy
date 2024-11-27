from flask import Blueprint, request, jsonify
from model import SimpleLLM

update_training_bp = Blueprint('update_training', __name__)

# LLM 모델 초기화
llm = SimpleLLM()

@update_training_bp.route('/', methods=['POST'])
def update_training():
    data = request.get_json()
    question = data.get('question')
    answer = data.get('answer')

    if question and answer:
        # 새로운 질문-답변 쌍을 모델에 추가
        llm.add_qa_pair(question, answer)
        return jsonify({"message": "Training data updated with new response."}), 200
    else:
        return jsonify({"error": "Question and answer are required."}), 400
