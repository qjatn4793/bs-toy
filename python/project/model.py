import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os


class SimpleLLM:
    def __init__(self, qa_file='data/qa_pairs.json'):
        self.qa_file = qa_file
        self.qa_pairs = self.load_qa_pairs()
        self.vectorizer = TfidfVectorizer()
        self.tfidf_matrix = None  # Initialize tfidf_matrix
        self.train_tfidf_matrix()

    def load_qa_pairs(self):
        try:
            with open(self.qa_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                print(f"[DEBUG] 질문-답변 쌍 로드 완료: {data}")
                return data
        except FileNotFoundError:
            print(f"[DEBUG] 파일을 찾을 수 없습니다: {self.qa_file}")
            return []
        except json.JSONDecodeError:
            print(f"[DEBUG] JSON 파일 형식이 잘못되었습니다: {self.qa_file}")
            return []

    def save_qa_pairs(self):
        with open(self.qa_file, 'w', encoding='utf-8') as f:
            json.dump(self.qa_pairs, f, ensure_ascii=False, indent=4)
            print(f"[DEBUG] 질문-답변 쌍 저장 완료: {self.qa_pairs}")

    def is_duplicate(self, question, answer):
        # 질문과 답변이 모두 동일한 항목이 있는지 확인
        for qa in self.qa_pairs:
            if qa['question'] == question and qa['answer'] == answer:
                print(f"[DEBUG] 중복된 질문-답변 쌍 발견: 질문='{question}', 답변='{answer}'")
                return True
        return False

    def add_qa_pair(self, question, answer):
        # 중복된 질문-답변 쌍 확인
        if self.is_duplicate(question, answer):
            print(f"[DEBUG] 중복된 질문-답변 쌍 무시: 질문='{question}', 답변='{answer}'")
            return

        # 새로운 질문-답변 쌍 추가
        self.qa_pairs.append({'question': question, 'answer': answer})
        print(f"[DEBUG] 새로운 질문-답변 쌍 추가: 질문='{question}', 답변='{answer}'")
        self.save_qa_pairs()
        self.train_tfidf_matrix()

    def train_tfidf_matrix(self):
        # qa_pairs가 업데이트되면 새로운 TF-IDF 행렬을 학습
        questions = [qa['question'] for qa in self.qa_pairs]
        if questions:
            print(f"[DEBUG] TF-IDF 행렬 학습 중: 질문 리스트={questions}")
            self.tfidf_matrix = self.vectorizer.fit_transform(questions)
        else:
            print("[DEBUG] TF-IDF 행렬 학습을 위한 질문이 없습니다.")
            self.tfidf_matrix = None

    def predict(self, question):
        # qa_pairs나 tfidf_matrix가 비어있다면 예측 불가
        if not self.qa_pairs or self.tfidf_matrix is None or self.tfidf_matrix.shape[0] == 0:
            print("[DEBUG] 예측 불가: 데이터가 없습니다.")
            return "데이터가 없습니다."

        # 입력된 질문을 벡터화하고, 기존의 tfidf_matrix와 유사도 계산
        question_vec = self.vectorizer.transform([question])
        similarity_scores = cosine_similarity(question_vec, self.tfidf_matrix)[0]
        print(f"[DEBUG] 입력된 질문 '{question}'에 대한 유사도 점수: {similarity_scores}")

        best_match_index = similarity_scores.argmax()
        best_score = similarity_scores[best_match_index]

        print(f"[DEBUG] 최고 유사도 인덱스: {best_match_index}, 점수: {best_score}")

        if best_score > 0:
            best_answer = self.qa_pairs[best_match_index]['answer']
            print(f"[DEBUG] 예측된 답변: {best_answer}")
            return best_answer
        else:
            print("[DEBUG] 적합한 매칭 결과를 찾을 수 없습니다.")
            return "적합한 답변을 찾을 수 없습니다."

    def run_conversation(self):
        # 대화를 통해 점진적으로 학습
        print("안녕하세요! 질문을 해주세요.")
        while True:
            question = input("Q: ")
            if question.lower() in ['exit', 'quit', '종료']:
                print("대화를 종료합니다.")
                break

            # 예측 및 대화 흐름 생성
            answer = self.predict(question)
            print(f"A: {answer}")

            # 새로운 질문과 답변 추가
            feedback = input("이 답변은 만족스러웠나요? (yes/no): ")
            if feedback.lower() == "no":
                new_answer = input("새로운 답변을 입력해주세요: ")
                self.add_qa_pair(question, new_answer)
                print(f"[DEBUG] 새로운 답변 추가됨: 질문='{question}', 답변='{new_answer}'")
