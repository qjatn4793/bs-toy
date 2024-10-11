from flask import Flask, request, jsonify
from transformers import AutoModelForCausalLM, AutoTokenizer
import logging

app = Flask(__name__)

# 로깅 설정
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# 모델과 토크나이저를 로드합니다.
model_name = "microsoft/DialoGPT-medium"  # 대화 모델
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# 챗봇 모델에서 응답을 생성하는 함수
def get_response(user_input):
    logging.info(f"Received user input: {user_input}")  # 사용자 입력 로그

    input_ids = tokenizer.encode(user_input + tokenizer.eos_token, return_tensors='pt')
    response_ids = model.generate(input_ids, max_length=1000, pad_token_id=tokenizer.eos_token_id)
    
    response = tokenizer.decode(response_ids[:, input_ids.shape[-1]:][0], skip_special_tokens=True)
    
    logging.info(f"Generated response: {response}")  # 생성된 응답 로그
    return response

# API 엔드포인트: /chat
@app.route('/chat', methods=['POST'])
def chat():
    # 클라이언트가 보낸 요청에서 메시지를 추출
    user_input = request.json.get('message')
    
    if user_input:  # 입력이 비어있지 않은 경우
        logging.info(f"User input received: {user_input}")  # 사용자 입력 로그
        response = get_response(user_input)
    else:
        logging.warning("Received empty input.")  # 빈 입력 로그
        response = "입력이 비어있습니다."  # 빈 입력에 대한 응답
    
    # JSON으로 응답 반환
    return jsonify({'response': response})

# 서버 실행
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
