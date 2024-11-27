from flask import Blueprint, request, jsonify
import requests
from bs4 import BeautifulSoup
import time
import random
import threading
from model import SimpleLLM

# 네이버 지식IN에서 질문과 답변을 추출하는 함수
def extract_qa_from_url(url):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')

        # 질문 추출
        question_tag = soup.find('div', {'class': 'endTitleSection'})
        if question_tag:
            question = question_tag.get_text(strip=True)
        else:
            raise ValueError("질문을 추출할 수 없습니다.")

        # 답변 추출 (여러 개의 답변이 있을 수 있음)
        answers = []
        answer_tags = soup.find_all('div', {'class': 'se-component-content'})
        for answer_tag in answer_tags:
            answer_text = answer_tag.get_text(strip=True)
            if answer_text:
                answers.append(answer_text)

        if not answers:
            raise ValueError("답변을 추출할 수 없습니다.")

        return question, answers

    except Exception as e:
        print(f"[ERROR] URL에서 질문과 답변을 추출하는 중 오류 발생: {url}, 오류: {str(e)}")
        return None, None

# 크롤링을 실행하는 함수
def start_crawling(start_doc_id, end_doc_id, filename='data/qa_pairs.json'):
    qa_pairs = []

    # SimpleLLM 객체 생성 (질문-답변 저장을 위해)
    llm = SimpleLLM(qa_file=filename)

    # 주어진 범위의 URL을 순차적으로 크롤링
    for doc_id in range(start_doc_id, end_doc_id + 1):
        url = f"https://kin.naver.com/qna/detail.naver?d1id=3&dirId=30104&docId={doc_id}"

        print(f"[INFO] 크롤링 중: {url}")

        question, answers = extract_qa_from_url(url)
        if question and answers:
            for answer in answers:
                # SimpleLLM의 add_qa_pair 메서드를 사용하여 질문과 답변 추가
                llm.add_qa_pair(question, answer)

        # 크롤링 후 딜레이를 주어 무차별 대입공격 방지
        time.sleep(random.uniform(1, 3))  # 1~3초의 랜덤 딜레이

    print(f"[INFO] 크롤링 완료. 총 {len(qa_pairs)}개의 질문-답변 쌍 저장됨.")

# Flask 블루프린트 생성
crawler_bp = Blueprint('crawler', __name__)

# '/naver' 경로로 POST 요청이 오면 크롤링 시작
@crawler_bp.route('/naver', methods=['POST'])
def naver_crawl():
    # 클라이언트에서 start_doc_id와 end_doc_id를 요청 본문에서 가져옴
    data = request.get_json()
    start_doc_id = data.get('start_doc_id', 478288786)
    end_doc_id = data.get('end_doc_id', 478288886)
    
    # 크롤링을 백그라운드에서 실행
    threading.Thread(target=start_crawling, args=(start_doc_id, end_doc_id)).start()
    return "크롤링이 시작되었습니다!"