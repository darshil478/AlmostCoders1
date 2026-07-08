from fastapi import APIRouter
import database

router = APIRouter()

@router.get("/firebase/test")
def firebase_test():
    if database.use_supabase:
        try:
            # Test query to verify connection
            database.db_client.table("doctor").select("id").limit(1).execute()
            return {
                "success": True,
                "message": "Supabase Connected Successfully"
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Supabase Connection Error: {e}"
            }
    else:
        return {
            "success": False,
            "message": "Supabase not enabled. Local persistent storage is active."
        }