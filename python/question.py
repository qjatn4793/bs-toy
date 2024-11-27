import requests

def ask_question(question):
    url = "http://localhost:7000/generate-answer"
    payload = {"question": question}
    response = requests.post(url, json=payload)

    if response.status_code == 200:
        data = response.json()
        print(f"Question: {data['question']}")
        print(f"Answer: {data['answer']}")
        print(f"Similarity Score: {data['similarity_score']}")
    else:
        print("Error:", response.json())

# 예시로 질문 보내기
ask_question("Who wrote Hamlet?")
