from fastapi import APIRouter
from pydantic import BaseModel
import database

router = APIRouter()

class DispenseRequest(BaseModel):
    id: str
    quantity: int

class RestockRequest(BaseModel):
    id: str
    quantity: int

@router.get("/inventory")
def get_inventory():
    return database.get_inventory()

@router.post("/dispense")
def dispense(data: DispenseRequest):
    inventory = database.get_inventory()
    target_item = None
    for item in inventory:
        if str(item["id"]) == str(data.id):
            target_item = item
            break
            
    if not target_item:
        database.add_event(f"Medicine dispense failed: Item ID {data.id} not found", "ERROR")
        database.add_notification("danger", "Medicine not found")
        return {"success": False, "message": "Medicine not found"}
        
    if target_item["stock"] < data.quantity:
        database.add_event(f"Dispense failed: Insufficient stock for {target_item['medicine']}", "WARNING")
        database.add_notification("danger", f"Not enough stock for {target_item['medicine']}")
        return {"success": False, "message": "Not enough stock"}
        
    new_stock = target_item["stock"] - data.quantity
    updated_item = database.update_inventory_stock(data.id, new_stock)
    
    database.add_event(f"Dispensed {data.quantity} units of {target_item['medicine']}", "INFO")
    database.add_notification("success", f"{data.quantity} {target_item['medicine']} dispensed successfully")
    
    if new_stock < 20:
        database.add_event(f"{target_item['medicine']} stock is LOW ({new_stock} remaining)", "WARNING")
        database.add_notification("warning", f"{target_item['medicine']} stock is LOW")
        
    return {
        "success": True,
        "message": "Medicine Dispensed",
        "medicine": updated_item
    }

@router.post("/restock")
def restock(data: RestockRequest):
    inventory = database.get_inventory()
    target_item = None
    for item in inventory:
        if str(item["id"]) == str(data.id):
            target_item = item
            break
            
    if not target_item:
        database.add_event(f"Restock failed: Item ID {data.id} not found", "ERROR")
        return {"success": False, "message": "Medicine not found"}
        
    new_stock = target_item["stock"] + data.quantity
    updated_item = database.update_inventory_stock(data.id, new_stock)
    
    database.add_event(f"Restocked {data.quantity} units of {target_item['medicine']}", "INFO")
    database.add_notification("success", f"{target_item['medicine']} restocked successfully")
    
    return {
        "success": True,
        "message": "Medicine Restocked",
        "medicine": updated_item
    }