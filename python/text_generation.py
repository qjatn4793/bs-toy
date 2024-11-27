import tensorflow as tf
from tensorflow.keras.layers import Input, Dense, Embedding, LayerNormalization, Dropout
from tensorflow.keras.models import Model, load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
import numpy as np
from flask import Flask, request, jsonify
import os

# 파일 경로 설정
MODEL_PATH = 'model/my_model.h5'
DATA_PATH = 'model/data.npz'

# 초기 데이터 준비 (예시 데이터)
questions = ["What is the capital of France?", "Who wrote Hamlet?", "What is 2+2?"]
answers = ["The capital of France is Paris.", "Hamlet was written by Shakespeare.", "2+2 is 4."]

# 전역 변수로 max_length 정의
max_length = 0
vocab = []  # vocab을 전역 변수로 선언

# char_to_idx와 idx_to_char도 전역으로 정의
char_to_idx = {}
idx_to_char = {}

# TransformerBlock 구현
class TransformerBlock(tf.keras.layers.Layer):
    def __init__(self, embed_dim, num_heads, ff_dim):
        super(TransformerBlock, self).__init__()
        self.attention = tf.keras.layers.MultiHeadAttention(num_heads=num_heads, key_dim=embed_dim)
        self.ffn = tf.keras.Sequential([  # Feed-forward Network
            tf.keras.layers.Dense(ff_dim, activation='relu'),
            tf.keras.layers.Dense(embed_dim)
        ])
        self.layernorm1 = tf.keras.layers.LayerNormalization(epsilon=1e-6)
        self.layernorm2 = tf.keras.layers.LayerNormalization(epsilon=1e-6)
        self.dropout1 = tf.keras.layers.Dropout(0.1)
        self.dropout2 = tf.keras.layers.Dropout(0.1)

    def call(self, inputs, training):
        # Multi-Head Attention
        attn_output = self.attention(inputs, inputs)
        attn_output = self.dropout1(attn_output, training=training)
        out1 = self.layernorm1(inputs + attn_output)
        
        # Feed-forward Network
        ffn_output = self.ffn(out1)
        ffn_output = self.dropout2(ffn_output, training=training)
        
        return self.layernorm2(out1 + ffn_output)

# 기존 모델이 있으면 로드하고, 없으면 새로 학습하여 저장
def load_or_create_model():
    global max_length, vocab, char_to_idx, idx_to_char
    if os.path.exists(MODEL_PATH):
        print("Loading existing model...")
        # TransformerBlock을 custom_object_scope 안에서 로드
        with tf.keras.utils.custom_object_scope({'TransformerBlock': TransformerBlock}):
            model = load_model(MODEL_PATH)  # 모델을 파일에서 로드
    else:
        print("Creating new model...")
        model = create_model()
        model.save(MODEL_PATH)  # 모델을 파일에 저장
    return model

def create_model():
    global max_length, vocab, char_to_idx, idx_to_char  # vocab과 관련된 변수들 전역으로 사용
    # 데이터를 로드하고 vocab을 생성합니다.
    input_data, target_data = load_data()  # 데이터를 로드하여 vocab을 업데이트합니다.
    
    # vocab과 관련된 변수들 업데이트
    vocab = list(set(" ".join(questions + answers)))  # 질문과 답변에서 문자 집합 생성
    vocab.extend(['Q', ':', 'A'])  # 포맷 문자열에 포함된 문자 추가
    vocab = list(set(vocab))  # 중복 제거
    char_to_idx = {char: idx for idx, char in enumerate(vocab)}
    idx_to_char = {idx: char for char, idx in char_to_idx.items()}
    
    # 모델 구조 정의
    embed_dim = 32  # 임베딩 차원
    num_heads = 2  # Multi-head Attention의 헤드 수
    ff_dim = 64    # Feed-forward network의 내부 차원

    input_seq = Input(shape=(max_length,))
    x = Embedding(input_dim=len(vocab), output_dim=embed_dim)(input_seq)
    transformer_block = TransformerBlock(embed_dim, num_heads, ff_dim)
    x = transformer_block(x, training=False)  # 학습 모드에서 호출

    x = Dense(len(vocab), activation="softmax")(x)

    model = Model(inputs=input_seq, outputs=x)
    model.compile(optimizer="adam", loss="sparse_categorical_crossentropy")
    return model

# 데이터 로드 및 저장
def load_data():
    global max_length  # max_length를 전역 변수로 사용
    if os.path.exists(DATA_PATH):
        data = np.load(DATA_PATH, allow_pickle=True)
        input_data = data['input_data']
        target_data = data['target_data']
        # max_length 업데이트
        max_length = max(max(len(x) for x in input_data), max(len(x) for x in target_data))
    else:
        input_data, target_data = prepare_data(questions, answers)
        np.savez(DATA_PATH, input_data=input_data, target_data=target_data)  # 초기 데이터 저장
    return input_data, target_data

def prepare_data(questions, answers):
    global max_length  # max_length를 전역 변수로 사용
    # 데이터를 숫자로 변환
    input_data = [encode(f"Q: {q} A: ") for q in questions]
    target_data = [encode(a) for a in answers]

    # max_length는 load_data에서 계산되므로 여기서는 패딩만 진행
    input_data = pad_sequences(input_data, maxlen=max_length, padding="post")
    target_data = pad_sequences(target_data, maxlen=max_length, padding="post")
    return input_data, target_data

# 텍스트를 숫자 시퀀스로 변환하는 함수
def encode(text):
    return [char_to_idx[char] for char in text if char in char_to_idx]

# 숫자 시퀀스를 텍스트로 변환하는 함수
def decode(sequence):
    return ''.join([idx_to_char[idx] for idx in sequence if idx in idx_to_char])

# 텍스트 생성 함수
def generate_text(question, model, max_len=100):
    input_seq = encode(f"Q: {question} A: ")
    input_seq = pad_sequences([input_seq], maxlen=max_length, padding="post")
    output_seq = []

    # 텍스트를 생성하는 부분
    for _ in range(max_len):
        preds = model.predict(input_seq)[0]  # 예측 결과, 첫 번째 배치만 사용
        next_idx = np.random.choice(len(vocab), p=preds[-1])  # 마지막 예측값만 사용

        if next_idx == char_to_idx[" "]:  # 공백 문자(또는 종료 조건) 처리
            break

        output_seq.append(next_idx)

        # 다음 토큰을 input_seq에 추가하되, max_length를 초과하지 않도록 처리
        if len(input_seq[0]) < max_length:
            input_seq[0].append(next_idx)
            input_seq = pad_sequences([input_seq[0]], maxlen=max_length, padding="post")
        else:
            input_seq[0][:-1] = input_seq[0][1:]  # 가장 오래된 값은 버리고 새로운 값 추가
            input_seq[0][-1] = next_idx

    return decode(output_seq)

# Cosine Similarity를 사용해 답변이 올바른지 판단하는 함수
def check_answer_validity(question, generated_answer):
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([question, generated_answer])
    similarity = cosine_similarity(vectors[0:1], vectors[1:])
    return similarity[0][0]  # 0과 1의 유사도 반환

# 학습 함수
def train_model(model, input_data, target_data):
    model.fit(input_data, target_data, epochs=1, batch_size=2)
    model.save(MODEL_PATH)  # 학습 후 모델 저장

# Flask 애플리케이션
app = Flask(__name__)

# 질문에 대한 답변을 생성하는 엔드포인트
@app.route('/generate-answer', methods=['POST'])
def generate_answer():
    # 질문 파라미터 가져오기
    data = request.get_json()
    question = data.get("question", "")
    if not question:
        return jsonify({"error": "Please provide a question in the 'question' field."}), 400

    # 모델 로드
    model = load_or_create_model()
    
    # 답변 생성
    answer = generate_text(question, model)
    
    return jsonify({"answer": answer})

# 새로운 데이터를 모델에 추가하는 엔드포인트
@app.route('/train-model', methods=['POST'])
def train_model_endpoint():
    data = request.get_json()
    question = data.get("question", "")
    answer = data.get("answer", "")
    if not question or not answer:
        return jsonify({"error": "Please provide both 'question' and 'answer' fields."}), 400

    # 새 데이터 추가
    questions.append(question)
    answers.append(answer)

    # 모델 재학습
    input_data, target_data = load_data()
    model = load_or_create_model()
    train_model(model, input_data, target_data)

    return jsonify({"message": "Model trained with new data successfully!"})

# 서버 시작
if __name__ == '__main__':
    app.run(debug=True, port=7000)
