from flask import current_app
from google import genai

_client = None


def get_client():
    global _client

    if _client is None:
        api_key = current_app.config.get("GEMINI_API_KEY")

        if not api_key:
            raise Exception("Missing GEMINI_API_KEY")

        _client = genai.Client(api_key=api_key)

    return _client


def generate_reply(message):
    try:
        if not message or not message.strip():
            return "Bạn chưa nhập nội dung."

        client = get_client()

        response = client.models.generate_content(
            model="models/gemini-flash-latest",  # ✅ đúng format
            contents=message
        )

        if not response or not response.text:
            return "AI không phản hồi."

        return response.text

    except Exception as e:
        print("Gemini error:", e)
        return f"Lỗi AI: {str(e)}"
