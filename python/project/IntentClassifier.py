import json
import logging
from konlpy.tag import Okt
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.multiclass import OneVsRestClassifier

# 로그 설정
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

class IntentClassifier:
    def __init__(self, intents_file='data/intents.json'):
        # 의도 데이터를 로드
        self.intents_file = intents_file
        self.intents = self.load_intents()
        self.okt = Okt()  # 형태소 분석기
        logging.info("IntentClassifier 초기화 완료.")
        # 모델을 학습
        self.model, self.mlb = self.create_intent_classifier(self.intents)

    def load_intents(self):
        """JSON 형식으로 저장된 의도 데이터를 로드"""
        try:
            logging.info(f"'{self.intents_file}' 파일을 로드하는 중...")
            with open(self.intents_file, 'r', encoding='utf-8') as f:
                intents = json.load(f)
            logging.info("의도 데이터 로드 성공.")
            return intents
        except FileNotFoundError:
            logging.error(f"[ERROR] {self.intents_file} 파일을 찾을 수 없습니다.")
            return []
        except json.JSONDecodeError:
            logging.error(f"[ERROR] JSON 형식이 잘못되었습니다: {self.intents_file}")
            return []

    def tokenize_text(self, text):
        """형태소 분석기를 사용해 한글 텍스트를 토큰화"""
        logging.debug(f"입력 텍스트: {text}")
        tokens = self.okt.nouns(text)  # 명사 추출
        tokenized_text = ' '.join(tokens)
        logging.debug(f"토큰화된 텍스트: {tokenized_text}")
        return tokenized_text

    def create_intent_classifier(self, intents):
        """TF-IDF + OneVsRestClassifier + Naive Bayes 모델을 사용하여 의도 분류기를 학습"""
        logging.info("의도 분류기 학습 시작...")
        texts = [self.tokenize_text(intent['text']) for intent in intents]
        labels = [intent['intent'] for intent in intents]
        
        # 다중 라벨 인코딩
        mlb = MultiLabelBinarizer()
        labels_bin = mlb.fit_transform([[label] for label in labels])  # 각 의도 라벨을 이진 배열로 변환
        
        logging.info("TF-IDF + Naive Bayes 모델 학습 중...")
        # OneVsRestClassifier + Naive Bayes 모델 파이프라인
        model = make_pipeline(TfidfVectorizer(), OneVsRestClassifier(MultinomialNB()))
        model.fit(texts, labels_bin)
        logging.info("모델 학습 완료.")
        
        return model, mlb

    def predict_intent(self, question, threshold=0.5):
        """주어진 질문에 대해 하나의 의도를 예측 (확률 기반으로)"""
        logging.info(f"질문: '{question}'에 대해 의도를 예측합니다.")
        
        # 질문을 토큰화
        tokenized_question = self.tokenize_text(question)
        
        # 각 클래스에 대한 확률 예측
        probas = self.model.predict_proba([tokenized_question])[0]
        
        # 각 클래스의 이름과 확률을 로그에 출력
        for i, prob in enumerate(probas):
            logging.info(f"클래스: {self.mlb.classes_[i]}, 확률: {prob:.4f}")
        
        # 확률이 threshold 이상인 의도를 찾기
        predicted_labels = [self.mlb.classes_[i] for i, prob in enumerate(probas) if prob >= threshold]
        
        # 만약 threshold 이상인 의도가 없다면, 가장 높은 확률을 가진 의도를 반환
        if not predicted_labels:
            # 가장 높은 확률을 가진 클래스의 인덱스를 찾고 해당 클래스 반환
            max_prob_index = probas.argmax()  # 가장 높은 확률 인덱스
            predicted_labels = [self.mlb.classes_[max_prob_index]]
        
        logging.info(f"예측된 의도들: {predicted_labels}")
        return predicted_labels