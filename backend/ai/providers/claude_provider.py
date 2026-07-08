import httpx
from ai.config import ANTHROPIC_API_KEY

def call_claude(prompt: str, system_instruction: str = None) -> str:
    if not ANTHROPIC_API_KEY:
        raise ValueError("Anthropic API Key is not set")
    
    url = "https://api.anthropic.com/v1/messages"
    headers = {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
    }
    
    payload = {
        "model": "claude-3-5-haiku-20241022",
        "max_tokens": 4096,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.2
    }
    if system_instruction:
        payload["system"] = system_instruction
        
    try:
        with httpx.Client(timeout=30.0) as client:
            response = client.post(url, json=payload, headers=headers)
            response.raise_for_status()
            result = response.json()
            return result["content"][0]["text"].strip()
    except Exception as e:
        print(f"Anthropic API call failed: {e}")
        raise e
