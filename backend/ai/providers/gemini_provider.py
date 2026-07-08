import google.generativeai as genai
from ai.config import GEMINI_API_KEY

def call_gemini(prompt: str, system_instruction: str = None) -> str:
    if not GEMINI_API_KEY:
        raise ValueError("Gemini API Key is not set")
    
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        
        # Configure model parameters
        config = {
            "temperature": 0.2,
            "top_p": 0.95,
        }
        
        # In google-generativeai >= 0.3.0, we can pass system_instruction to GenerativeModel
        model_name = "gemini-2.5-flash"
        try:
            model = genai.GenerativeModel(
                model_name=model_name,
                generation_config=config,
                system_instruction=system_instruction
            )
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            # Fallback to gemini-1.5-flash if 2.5-flash is not available in their region/library version
            print(f"Gemini model fallback error: {e}. Trying gemini-1.5-flash.")
            model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                generation_config=config,
                system_instruction=system_instruction
            )
            response = model.generate_content(prompt)
            return response.text.strip()
            
    except Exception as e:
        print(f"Gemini API call failed: {e}")
        raise e
