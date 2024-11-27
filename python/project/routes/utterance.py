from flask import Blueprint, request, jsonify
from model import SimpleLLM
from IntentClassifier import IntentClassifier
import datetime

utterance_bp = Blueprint('utterance', __name__)

# LLM 모델 초기화
llm = SimpleLLM()

# 의도 분류기 초기화
intent_classifier = IntentClassifier()

# 현재 시간 가져오기
def get_current_time():
    # 현재 시스템 시간 가져오기
    now = datetime.datetime.now()
    # 시간을 12시간제로 포맷팅 (예: 12:00 PM)
    return now.strftime("%I:%M %p")

@utterance_bp.route('/', methods=['POST'])
def utterance():
    data = request.get_json()
    question = data.get('question')

    if question:
        answer = llm.predict(question)
        return jsonify({"answer": answer}), 200
    else:
        return jsonify({"error": "Question is required."}), 400

@utterance_bp.route('/intent', methods=['POST'])
def intent():
    # 사용자 질문을 요청에서 가져오기
    data = request.get_json()
    question = data.get('question', '')

    if not question:
        return jsonify({'error': '질문을 제공해주세요.'}), 400

    # 의도 예측
    try:
        intents = intent_classifier.predict_intent(question)  # predict_intent 메서드 호출
        
        # 예측된 의도가 없으면 적합한 답변을 찾을 수 없다고 응답
        if not intents:  # 예측된 의도가 없을 경우
            return jsonify({'answer': '질문에 대한 적합한 답변을 찾을 수 없습니다.', 'intents': []}), 200

        # 의도에 따라 다르게 응답 생성
        responses = []
        for intent in intents:
            # greeting 의도 처리
            if intent == 'greeting':
                # 인사말에 따라 llm.predict로 동적으로 응답 생성
                if '안녕' in question or '반갑습니다' in question:
                    # 인사하고 대화 시작하는 방법
                    response = llm.predict("인사하고 대화를 시작하는 방법을 알려주세요.")
                elif '잘 지내?' in question or '오늘 기분 어때요?' in question:
                    # 기분에 대한 질문을 하고 대화하는 방법
                    response = llm.predict("잘 지내?")
                else:
                    # 일반적인 인사를 하고 대화하는 방법
                    response = llm.predict("인사를 하고싶어요")
                
                responses.append(response)

            # 건강 관련 의도 처리
            elif intent == 'health':
                if '두통' in question or '머리' in question:
                    response = llm.predict(f"두통에 대한 치료 방법을 알려주세요.")
                elif '운동' in question or '체중' in question:
                    response = llm.predict(f"체중 감소를 위한 운동 추천을 해주세요.")
                elif '영양' in question:
                    response = llm.predict(f"영양이 좋은 음식 추천을 해주세요.")
                else:
                    response = llm.predict(f"건강을 유지하는 방법을 알려주세요.")
                responses.append(response)
            
            # 스포츠 관련 의도 처리
            elif intent == 'sports':
                if '축구' in question:
                    response = llm.predict(f"축구 규칙과 경기 방법에 대해 설명해주세요.")
                elif '농구' in question:
                    response = llm.predict(f"농구의 기본 규칙과 전략을 알려주세요.")
                elif '야구' in question:
                    response = llm.predict(f"야구의 경기 규칙과 팀 전략에 대해 알려주세요.")
                else:
                    response = llm.predict(f"스포츠에 대한 일반적인 정보와 조언을 주세요.")
                responses.append(response)
                
            # 다른 의도 처리 (예: food, travel, education, etc.)
            elif intent == 'food':
                if '매운' in question:
                    response = llm.predict(f"매운 음식 추천을 해주세요.")
                elif '디저트' in question:
                    response = llm.predict(f"디저트 추천을 해주세요.")
                elif '다이어트' in question:
                    response = llm.predict(f"다이어트에 좋은 음식 추천을 해주세요.")
                else:
                    response = llm.predict(f"오늘의 음식 추천을 해주세요.")
                responses.append(response)

            elif intent == 'travel':
                if '여행지' in question:
                    response = llm.predict(f"추천할 만한 여행지를 알려주세요.")
                elif '여행 준비' in question:
                    response = llm.predict(f"여행 준비물에 대한 체크리스트를 알려주세요.")
                elif '비행기' in question:
                    response = llm.predict(f"비행기 예약에 필요한 정보와 팁을 주세요.")
                else:
                    response = llm.predict(f"여행에 대한 일반적인 정보를 제공해주세요.")
                responses.append(response)

            elif intent == 'education':
                if '온라인 강의' in question:
                    response = llm.predict(f"추천할 만한 온라인 강의를 알려주세요.")
                elif '자기개발' in question:
                    response = llm.predict(f"자기개발을 위한 좋은 학습 자료를 알려주세요.")
                elif '자격증' in question:
                    response = llm.predict(f"추천할 만한 자격증을 알려주세요.")
                else:
                    response = llm.predict(f"학습 방법과 팁에 대해 알려주세요.")
                responses.append(response)

            elif intent == 'technology':
                if '인공지능' in question:
                    response = llm.predict(f"인공지능 기술의 발전과 미래에 대해 설명해주세요.")
                elif '컴퓨터' in question:
                    response = llm.predict(f"컴퓨터 과학에 대한 입문 자료를 알려주세요.")
                elif '웹 개발' in question:
                    response = llm.predict(f"웹 개발을 시작하는 데 필요한 정보를 알려주세요.")
                else:
                    response = llm.predict(f"최신 기술 트렌드에 대해 알려주세요.")
                responses.append(response)

            elif intent == 'lifestyle':
                if '시간 관리' in question:
                    response = llm.predict(f"효율적인 시간 관리 방법을 알려주세요.")
                elif '스트레스' in question:
                    response = llm.predict(f"스트레스 해소 방법을 알려주세요.")
                elif '취미' in question:
                    response = llm.predict(f"추천할 만한 취미 활동을 알려주세요.")
                else:
                    response = llm.predict(f"삶의 질을 향상시키는 방법을 알려주세요.")
                responses.append(response)

            elif intent == 'news':
                if '오늘' in question:
                    response = llm.predict(f"오늘의 주요 뉴스에 대해 알려주세요.")
                elif '정치' in question:
                    response = llm.predict(f"오늘의 정치 뉴스를 알려주세요.")
                elif '경제' in question:
                    response = llm.predict(f"오늘의 경제 뉴스를 알려주세요.")
                else:
                    response = llm.predict(f"오늘의 주요 뉴스를 알려주세요.")
                responses.append(response)

            elif intent == 'business':
                if '스타트업' in question:
                    response = llm.predict(f"스타트업 창업에 대해 알려주세요.")
                elif '투자' in question:
                    response = llm.predict(f"투자 관련 정보를 알려주세요.")
                elif '기업 운영' in question:
                    response = llm.predict(f"기업 운영에 대해 알려주세요.")
                else:
                    response = llm.predict(f"비즈니스 관련 정보를 알려주세요.")
                responses.append(response)

            elif intent == 'stocks':
                if '주식 투자' in question:
                    response = llm.predict(f"주식 투자 방법에 대해 알려주세요.")
                elif '주식 시장' in question:
                    response = llm.predict(f"현재 주식 시장 동향에 대해 알려주세요.")
                elif '주식 추천' in question:
                    response = llm.predict(f"추천할 만한 주식을 알려주세요.")
                else:
                    response = llm.predict(f"주식 관련 정보를 알려주세요.")
                responses.append(response)

            elif intent == 'shopping':
                if '쇼핑몰' in question:
                    response = llm.predict(f"추천할 만한 쇼핑몰을 알려주세요.")
                elif '할인' in question:
                    response = llm.predict(f"현재 진행 중인 할인 정보를 알려주세요.")
                elif '전자 제품' in question:
                    response = llm.predict(f"추천할 만한 전자 제품을 알려주세요.")
                else:
                    response = llm.predict(f"쇼핑에 관한 정보를 제공해주세요.")
                responses.append(response)

            elif intent == 'time':
                response = f"현재 시간은 {get_current_time()}입니다."
                responses.append(response)    

            else:
                responses.append("질문에 대한 적합한 답변을 찾을 수 없습니다.")

        # 여러 개의 의도가 예측된 경우 각 의도에 대한 답변을 모두 반환
        return jsonify({"answers": responses, "intents": intents}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500