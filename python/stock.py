import logging
from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
import numpy as np
import math
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)  # 모든 경로에 대해 CORS 활성화

# 로그 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/api/predict', methods=['GET'])
def predict_stock_price():
    ticker = request.args.get('ticker')  # 주식 심볼
    start_date = request.args.get('start')  # 시작 날짜
    end_date = request.args.get('end')  # 종료 날짜
    future_steps = int(request.args.get('future_steps', 30))  # 예측할 미래 날짜 수 (기본값: 30일)

    # 로그에 요청 변수 출력
    logger.info(f"Received request for stock price prediction with parameters:")
    logger.info(f"Ticker: {ticker}")
    logger.info(f"Start Date: {start_date}")
    logger.info(f"End Date: {end_date}")
    logger.info(f"Future Steps: {future_steps}")

    # 1단계: 데이터 수집
    logger.info(f"Downloading stock data for {ticker}.")
    data = yf.download(ticker, start=start_date, end=end_date)
    
    if data.empty:
        logger.error("No data found for the specified ticker.")
        return jsonify({"error": "No data found for the specified ticker."}), 404

    data = data[['Close']]
    
    # 2단계: 데이터 전처리
    logger.info("Starting data preprocessing.")
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data)

    # 시퀀스 생성
    def create_dataset(data, time_step=1):
        X, y = [], []
        for i in range(len(data) - time_step - 1):
            a = data[i:(i + time_step), 0]
            X.append(a)
            y.append(data[i + time_step, 0])
        return np.array(X), np.array(y)

    time_step = 60
    X, y = create_dataset(scaled_data, time_step)

    # 데이터셋을 훈련 세트와 테스트 세트로 분할
    train_size = int(len(X) * 0.8)
    X_train, X_test = X[:train_size], X[train_size:]
    y_train, y_test = y[:train_size], y[train_size:]

    # LSTM 입력 형식으로 변환
    X_train = X_train.reshape(X_train.shape[0], X_train.shape[1], 1)
    X_test = X_test.reshape(X_test.shape[0], X_test.shape[1], 1)

    # 3단계: LSTM 모델 생성 및 학습
    logger.info("Creating and training the LSTM model.")
    model = Sequential()
    model.add(LSTM(units=50, return_sequences=True, input_shape=(X_train.shape[1], 1)))
    model.add(Dropout(0.2))
    model.add(LSTM(units=50))
    model.add(Dropout(0.2))
    model.add(Dense(units=1))  # 예측할 값은 1개 (종가)

    # 모델 컴파일
    model.compile(optimizer='adam', loss='mean_squared_error')

    # 모델 학습
    model.fit(X_train, y_train, epochs=10, batch_size=32)  # epochs와 batch_size 조정
    logger.info("Model training complete.")

    # 4단계: 모델 평가 및 예측
    train_predict = model.predict(X_train)
    test_predict = model.predict(X_test)

    # 데이터 역정규화
    train_predict = scaler.inverse_transform(train_predict)
    test_predict = scaler.inverse_transform(test_predict)

    # RMSE 계산
    train_rmse = math.sqrt(mean_squared_error(y_train, train_predict))
    test_rmse = math.sqrt(mean_squared_error(y_test, test_predict))
    logger.info(f"Train RMSE: {train_rmse}, Test RMSE: {test_rmse}")

    # 미래 예측 추가
    last_sequence = scaled_data[-time_step:]  # 마지막 시퀀스
    future_predictions = []

    for _ in range(future_steps):
        last_sequence = last_sequence.reshape((1, time_step, 1))  # LSTM 입력 형태로 변환
        next_prediction = model.predict(last_sequence)
        future_predictions.append(next_prediction[0, 0])  # 예측 값 추가
        last_sequence = np.append(last_sequence[:, 1:, :], next_prediction.reshape(1, 1, 1), axis=1)  # 시퀀스 업데이트

    # 예측 값 역정규화
    future_predictions = scaler.inverse_transform(np.array(future_predictions).reshape(-1, 1))

    # 결과 데이터 생성
    result = {
        "train_rmse": train_rmse,
        "test_rmse": test_rmse,
        "actual": data['Close'].values[-len(test_predict):].tolist(),
        "predicted": test_predict.flatten().tolist(),
        "future_predictions": future_predictions.flatten().tolist(),  # 미래 예측 추가
    }

    # 날짜 정보 추가
    dates = data.index[-len(test_predict):].tolist()
    result["dates"] = [date.strftime('%Y-%m-%d') for date in dates]  # 날짜를 문자열 형식으로 변환
    
    # 미래 날짜 계산
    last_date = dates[-1] + timedelta(days=1)  # 마지막 날짜 다음 날부터 시작
    future_dates = [(last_date + timedelta(days=i)).strftime('%Y-%m-%d') for i in range(future_steps)]
    result["future_dates"] = future_dates  # 미래 날짜 추가

    logger.info("Prediction completed successfully.")
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5100)
