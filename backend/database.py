import os
import json
from datetime import datetime

# Check if Supabase is available
db_client = None
use_supabase = False

try:
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_ANON_KEY")
    
    if supabase_url and supabase_key:
        from supabase import create_client, Client
        db_client: Client = create_client(supabase_url, supabase_key)
        use_supabase = True
        print("[Supabase] connected successfully!")
    else:
        print("[Database] Supabase URL or Key not found in environment variables. Falling back to local persistent JSON storage.")
except Exception as e:
    print(f"[Supabase] Error initializing Supabase: {e}. Falling back to local storage.")

# Local Database File Path
LOCAL_DB_PATH = os.path.join(os.path.dirname(__file__), "local_db.json")

# Default Seed Data
SEED_DATA = {
    "patients": [
        {
            "id": "IND-88392",
            "name": "Rajesh Kumar",
            "age": 45,
            "gender": "M",
            "blood": "O+",
            "phone": "+91 98765 43210",
            "address": "Sector 4, Indore",
            "emergency": "Sunita (Wife) - 98765 00000",
            "insurance": "Ayushman Bharat - Active",
            "symptoms": "High blood pressure, headache, chest tightness",
            "vitals": { "hr": 88, "bp": "140/90", "temp": "98.6°F", "o2": "96%" },
            "healthScore": 72,
            "risk": "Elevated",
            "prediction": "85% probability of Hypertension exacerbation within 30 days.",
            "medications": ["Amlodipine 5mg (Daily)", "Atorvastatin 10mg (Night)"],
            "followUp": "Recommend tele-consult in 7 days for BP monitoring.",
            "timeline": [
                { "date": "Oct 12, 2025", "event": "Lab Report: Complete Lipid Panel", "type": "lab" },
                { "date": "Sep 28, 2025", "event": "Clinic Visit: Routine checkup (BP Elevated)", "type": "visit" }
            ]
        },
        {
            "id": "IND-10294",
            "name": "Priya Sharma",
            "age": 32,
            "gender": "F",
            "blood": "A-",
            "phone": "+91 91234 56789",
            "address": "Vijay Nagar, Indore",
            "emergency": "Amit (Brother) - 91234 00000",
            "insurance": "Private - HDFC Ergo",
            "symptoms": "Mild seasonal cough, sneezing",
            "vitals": { "hr": 72, "bp": "118/75", "temp": "98.4°F", "o2": "99%" },
            "healthScore": 94,
            "risk": "Low",
            "prediction": "Vitals optimal. No immediate anomalies detected.",
            "medications": ["Multivitamins"],
            "followUp": "Annual checkup due in 8 months.",
            "timeline": [
                { "date": "Mar 04, 2025", "event": "Clinic Visit: General Consultation", "type": "visit" }
            ]
        },
        {
            "id": "IND-44211",
            "name": "Amit Patel",
            "age": 28,
            "gender": "M",
            "blood": "B+",
            "phone": "+91 95432 12345",
            "address": "Sudama Nagar, Indore",
            "emergency": "Ramesh (Father) - 95432 00000",
            "insurance": "None",
            "symptoms": "High fever, body aches, shivering, headache",
            "vitals": { "hr": 102, "bp": "110/70", "temp": "102.4°F", "o2": "95%" },
            "healthScore": 55,
            "risk": "High",
            "prediction": "Possible Dengue / Malaria. Requires immediate blood count test.",
            "medications": ["Paracetamol 650mg (Every 6h)", "ORS hydration packets"],
            "followUp": "Return in 48 hours for platelet count check.",
            "timeline": [
                { "date": "Jul 07, 2026", "event": "Check-in: High fever symptoms", "type": "visit" }
            ]
        },
        {
            "id": "IND-50112",
            "name": "Karan Malhotra",
            "age": 62,
            "gender": "M",
            "blood": "AB+",
            "phone": "+91 94321 54321",
            "address": "Palasia, Indore",
            "emergency": "Rohan (Son) - 94321 00000",
            "insurance": "Ayushman Bharat - Active",
            "symptoms": "Frequent urination, excessive thirst, foot numbness, fatigue",
            "vitals": { "hr": 78, "bp": "130/85", "temp": "98.6°F", "o2": "97%" },
            "healthScore": 65,
            "risk": "Elevated",
            "prediction": "Risk of peripheral neuropathy. Optimize Metformin dosage and advise daily foot checks.",
            "medications": ["Metformin 500mg (Twice daily)", "Methylcobalamin 1500mcg"],
            "followUp": "Return in 14 days for fasting blood glucose level monitoring.",
            "timeline": [
                { "date": "Jun 20, 2026", "event": "Clinic Visit: Diabetic Follow-up", "type": "visit" }
            ]
        },
        {
            "id": "IND-66014",
            "name": "Sneha Reddy",
            "age": 8,
            "gender": "F",
            "blood": "O+",
            "phone": "+91 97531 97531",
            "address": "Rajwada, Indore",
            "emergency": "Kavitha (Mother) - 97531 00000",
            "insurance": "None",
            "symptoms": "Wheezing, shortness of breath, dry cough, chest tightness",
            "vitals": { "hr": 95, "bp": "110/70", "temp": "99.1°F", "o2": "93%" },
            "healthScore": 48,
            "risk": "High",
            "prediction": "Moderate asthma flare-up. Monitor SpO2 levels closely and ensure inhaler compliance.",
            "medications": ["Salbutamol Inhaler (As needed)", "Budecort inhaler (Twice daily)"],
            "followUp": "Urgent tele-consult if SpO2 drops below 92%. Follow-up visit in 3 days.",
            "timeline": [
                { "date": "Jul 05, 2026", "event": "Emergency Room: Nebulization therapy", "type": "visit" }
            ]
        },
        {
            "id": "IND-77890",
            "name": "Vikram Singh",
            "age": 38,
            "gender": "M",
            "blood": "A+",
            "phone": "+91 96420 96420",
            "address": "Annapurna, Indore",
            "emergency": "Meera (Sister) - 96420 00000",
            "insurance": "Private - Star Health",
            "symptoms": "High fever, persistent cough, running nose, sore throat, fatigue",
            "vitals": { "hr": 84, "bp": "120/80", "temp": "101.2°F", "o2": "98%" },
            "healthScore": 78,
            "risk": "Low",
            "prediction": "Influenza-like illness. Low risk of acute respiratory distress syndrome.",
            "medications": ["Paracetamol 650mg (For fever)", "Cough Syrup 10ml (Thrice daily)", "Warm hydration"],
            "followUp": "Self-isolate for 5 days. Call if breathing difficulty develops.",
            "timeline": [
                { "date": "Jul 07, 2026", "event": "Check-in: Flu symptoms", "type": "visit" }
            ]
        }
    ],
    "inventory": [
        {"id": "1", "medicine": "Paracetamol 650mg", "type": "Analgesic", "stock": 120, "capacity": 500, "status": "Optimal", "location": "Main Fridge", "expiry": "2027-12", "supplier": "Cipla Ltd"},
        {"id": "2", "medicine": "ORS Packets", "type": "Dehydration", "stock": 60, "capacity": 300, "status": "Low Stock", "location": "Shelf B", "expiry": "2026-08", "supplier": "Aurobindo"},
        {"id": "3", "medicine": "Amoxicillin 500mg", "type": "Antibiotic", "stock": 18, "capacity": 200, "status": "Critical", "location": "Cabinet A", "expiry": "2026-11", "supplier": "Sun Pharma"},
        {"id": "4", "medicine": "Amlodipine 5mg", "type": "Hypertension", "stock": 150, "capacity": 400, "status": "Optimal", "location": "Shelf C", "expiry": "2027-04", "supplier": "Lupin"},
        {"id": "5", "medicine": "Atorvastatin 10mg", "type": "Cholesterol", "stock": 90, "capacity": 300, "status": "Optimal", "location": "Shelf C", "expiry": "2027-02", "supplier": "Dr. Reddys"},
        {"id": "6", "medicine": "Metformin 500mg", "type": "Antidiabetic", "stock": 240, "capacity": 500, "status": "Optimal", "location": "Shelf D", "expiry": "2027-09", "supplier": "Abbott Labs"},
        {"id": "7", "medicine": "Salbutamol Inhaler", "type": "Bronchodilator", "stock": 12, "capacity": 100, "status": "Critical", "location": "Cabinet B", "expiry": "2026-10", "supplier": "Cipla Ltd"},
        {"id": "8", "medicine": "Insulin Glargine 100 IU", "type": "Cold Chain", "stock": 35, "capacity": 150, "status": "Low Stock", "location": "Main Fridge", "expiry": "2026-09", "supplier": "Lilly"},
        {"id": "9", "medicine": "Cough Syrup 100ml", "type": "Expectorant", "stock": 180, "capacity": 300, "status": "Optimal", "location": "Shelf B", "expiry": "2027-05", "supplier": "Dabur"},
        {"id": "10", "medicine": "Azithromycin 500mg", "type": "Antibiotic", "stock": 15, "capacity": 150, "status": "Critical", "location": "Cabinet A", "expiry": "2027-01", "supplier": "Sun Pharma"}
    ],
    "doctor": {
        "name": "Dr. Sharma",
        "present": False,
        "check_in": None
    },
    "doctors": [
        {
            "id": "DOC-001",
            "name": "Dr. Alok Verma",
            "specialty": "Cardiology",
            "location": "District Hospital",
            "experience": "15 Yrs",
            "rating": 4.9,
            "telemedicine": True,
            "patientLoad": 92,
            "burnoutRisk": "Critical",
            "schedule": "Shift: 08:00 - 20:00 (Overtime)",
            "isEmergencyAssigned": True,
            "present": False,
            "check_in": None
        },
        {
            "id": "DOC-042",
            "name": "Dr. Neha Sharma",
            "specialty": "Pediatrics",
            "location": "PHC Sector 4",
            "experience": "8 Yrs",
            "rating": 4.7,
            "telemedicine": True,
            "patientLoad": 65,
            "burnoutRisk": "Low",
            "schedule": "Shift: 10:00 - 18:00",
            "isEmergencyAssigned": False,
            "present": False,
            "check_in": None
        },
        {
            "id": "DOC-018",
            "name": "Dr. R.K. Singh",
            "specialty": "General Surgery",
            "location": "CHC Indore East",
            "experience": "22 Yrs",
            "rating": 4.8,
            "telemedicine": False,
            "patientLoad": 85,
            "burnoutRisk": "Elevated",
            "schedule": "Shift: 09:00 - 17:00",
            "isEmergencyAssigned": False,
            "present": False,
            "check_in": None
        },
        {
            "id": "DOC-089",
            "name": "Dr. Maya Patel",
            "specialty": "OB/GYN",
            "location": "PHC Mhow",
            "experience": "5 Yrs",
            "rating": 4.6,
            "telemedicine": True,
            "patientLoad": 40,
            "burnoutRisk": "Optimal",
            "schedule": "Shift: 12:00 - 20:00",
            "isEmergencyAssigned": False,
            "present": False,
            "check_in": None
        },
        {
            "id": "DOC-010",
            "name": "Dr. Sharma",
            "specialty": "General Medicine",
            "location": "PHC Sector 4",
            "experience": "12 Yrs",
            "rating": 4.8,
            "telemedicine": True,
            "patientLoad": 30,
            "burnoutRisk": "Optimal",
            "schedule": "Shift: 09:00 - 17:00",
            "isEmergencyAssigned": False,
            "present": False,
            "check_in": None
        }
    ],
    "notifications": [
        {
            "id": 1,
            "type": "success",
            "message": "PHC System Online & Active",
            "time": "08:00 AM"
        }
    ],
    "events": [
        {
            "message": "PHC System Initialized",
            "level": "INFO",
            "time": datetime.now().strftime("%d-%m-%Y %H:%M:%S")
        }
    ],
    "surveillance": [
        {"id": "DS-001", "disease": "Dengue", "district": "Indore", "cases": 24, "status": "Active", "risk": "Critical", "lastUpdated": "2026-07-08"},
        {"id": "DS-002", "disease": "Malaria", "district": "Bhopal", "cases": 12, "status": "Active", "risk": "High", "lastUpdated": "2026-07-07"},
        {"id": "DS-003", "disease": "Influenza", "district": "Ujjain", "cases": 35, "status": "Active", "risk": "Moderate", "lastUpdated": "2026-07-06"},
        {"id": "DS-004", "disease": "Covid-19", "district": "Jabalpur", "cases": 5, "status": "Monitored", "risk": "Low", "lastUpdated": "2026-07-05"}
    ]
}


def load_local_db():
    if not os.path.exists(LOCAL_DB_PATH):
        save_local_db(SEED_DATA)
        return SEED_DATA
    try:
        with open(LOCAL_DB_PATH, "r") as f:
            data = json.load(f)
            # Ensure all keys exist
            for key in SEED_DATA:
                if key not in data:
                    data[key] = SEED_DATA[key]
            return data
    except Exception as e:
        print(f"Error loading local DB: {e}. Reverting to seed data.")
        return SEED_DATA

def save_local_db(data):
    try:
        with open(LOCAL_DB_PATH, "w") as f:
            json.dump(data, f, indent=4)
    except Exception as e:
        print(f"Error saving local DB: {e}")

# Helper functions to abstract Supabase vs Local JSON DB

def get_patients():
    if use_supabase:
        try:
            response = db_client.table("patients").select("*").execute()
            return response.data
        except Exception as e:
            print(f"Supabase error in get_patients: {e}. Falling back to local.")
    
    # Fallback to local
    return load_local_db()["patients"]

def add_patient(patient_data):
    if use_supabase:
        try:
            p_id = patient_data.get("id")
            if not p_id:
                existing = db_client.table("patients").select("id").execute()
                patient_data["id"] = f"IND-{len(existing.data) + 10000 + 1}"
            
            db_client.table("patients").upsert(patient_data).execute()
            return patient_data
        except Exception as e:
            print(f"Supabase error in add_patient: {e}. Falling back to local.")
            
    local_data = load_local_db()
    if "id" not in patient_data or not patient_data["id"]:
        patient_data["id"] = f"IND-{len(local_data['patients']) + 10000}"
    local_data["patients"].append(patient_data)
    save_local_db(local_data)
    return patient_data

def get_inventory():
    if use_supabase:
        try:
            response = db_client.table("inventory").select("*").execute()
            inv_list = response.data
            if not inv_list:
                for item in SEED_DATA["inventory"]:
                    db_client.table("inventory").upsert(item).execute()
                return SEED_DATA["inventory"]
            try:
                inv_list.sort(key=lambda x: int(x["id"]))
            except Exception:
                pass
            return inv_list
        except Exception as e:
            print(f"Supabase error in get_inventory: {e}. Falling back to local.")
            
    return load_local_db()["inventory"]

def update_inventory_stock(item_id, stock):
    if use_supabase:
        try:
            status = "Optimal"
            if stock < 20:
                status = "Critical"
            elif stock < 50:
                status = "Low Stock"
            
            response = db_client.table("inventory").select("*").eq("id", str(item_id)).execute()
            if response.data:
                update_resp = db_client.table("inventory").update({"stock": stock, "status": status}).eq("id", str(item_id)).execute()
                if update_resp.data:
                    return update_resp.data[0]
        except Exception as e:
            print(f"Supabase error in update_inventory_stock: {e}. Falling back to local.")
            
    local_data = load_local_db()
    for item in local_data["inventory"]:
        if str(item["id"]) == str(item_id):
            item["stock"] = stock
            if stock < 20:
                item["status"] = "Critical"
            elif stock < 50:
                item["status"] = "Low Stock"
            else:
                item["status"] = "Optimal"
            save_local_db(local_data)
            return item
    return None

def get_doctor():
    if use_supabase:
        try:
            response = db_client.table("doctor").select("*").eq("id", "main").execute()
            if response.data:
                doc_data = response.data[0]
                doc_data.pop("id", None)
                return doc_data
            else:
                db_client.table("doctor").insert({"id": "main", **SEED_DATA["doctor"]}).execute()
                return SEED_DATA["doctor"]
        except Exception as e:
            print(f"Supabase error in get_doctor: {e}. Falling back to local.")
            
    return load_local_db()["doctor"]

def update_doctor(present, check_in=None):
    update_data = {"present": present, "check_in": check_in}
    if use_supabase:
        try:
            db_client.table("doctor").update(update_data).eq("id", "main").execute()
            return update_data
        except Exception as e:
            print(f"Supabase error in update_doctor: {e}. Falling back to local.")
            
    local_data = load_local_db()
    local_data["doctor"]["present"] = present
    local_data["doctor"]["check_in"] = check_in
    save_local_db(local_data)
    return local_data["doctor"]

def get_doctors():
    if use_supabase:
        try:
            response = db_client.table("doctors").select("*").execute()
            docs_list = response.data
            if not docs_list:
                for item in SEED_DATA["doctors"]:
                    db_client.table("doctors").upsert(item).execute()
                return SEED_DATA["doctors"]
            try:
                docs_list.sort(key=lambda x: x["id"])
            except Exception:
                pass
            return docs_list
        except Exception as e:
            print(f"Supabase error in get_doctors: {e}. Falling back to local.")
            
    return load_local_db()["doctors"]

def update_doctor_presence(doctor_id, present, check_in=None):
    update_data = {"present": present, "check_in": check_in}
    if use_supabase:
        try:
            response = db_client.table("doctors").select("*").eq("id", str(doctor_id)).execute()
            if response.data:
                update_resp = db_client.table("doctors").update(update_data).eq("id", str(doctor_id)).execute()
                full_doc = update_resp.data[0]
                if str(doctor_id) == "DOC-010" or full_doc.get("name") == "Dr. Sharma":
                    db_client.table("doctor").update(update_data).eq("id", "main").execute()
                return full_doc
            else:
                seed_doc = next((d for d in SEED_DATA["doctors"] if str(d["id"]) == str(doctor_id)), None)
                if seed_doc:
                    new_doc = {**seed_doc, **update_data}
                    db_client.table("doctors").insert(new_doc).execute()
                    if str(doctor_id) == "DOC-010" or new_doc.get("name") == "Dr. Sharma":
                        db_client.table("doctor").update(update_data).eq("id", "main").execute()
                    return new_doc
                return update_data
        except Exception as e:
            print(f"Supabase error in update_doctor_presence: {e}. Falling back to local.")
            
    local_data = load_local_db()
    for doc in local_data["doctors"]:
        if str(doc["id"]) == str(doctor_id):
            doc["present"] = present
            doc["check_in"] = check_in
            if str(doctor_id) == "DOC-010" or doc["name"] == "Dr. Sharma":
                local_data["doctor"]["present"] = present
                local_data["doctor"]["check_in"] = check_in
            save_local_db(local_data)
            return doc
    return None

def get_events():
    if use_supabase:
        try:
            response = db_client.table("events").select("*").execute()
            events_list = response.data
            events_list.sort(key=lambda x: x.get("time", ""), reverse=True)
            return events_list
        except Exception as e:
            print(f"Supabase error in get_events: {e}. Falling back to local.")
            
    events_list = load_local_db()["events"]
    events_list.sort(key=lambda x: x.get("time", ""), reverse=True)
    return events_list

def add_event(message, level="INFO"):
    event_data = {
        "message": message,
        "level": level,
        "time": datetime.now().strftime("%d-%m-%Y %H:%M:%S")
    }
    if use_supabase:
        try:
            db_client.table("events").insert(event_data).execute()
            return event_data
        except Exception as e:
            print(f"Supabase error in add_event: {e}. Falling back to local.")
            
    local_data = load_local_db()
    local_data["events"].append(event_data)
    if len(local_data["events"]) > 100:
        local_data["events"] = local_data["events"][-100:]
    save_local_db(local_data)
    return event_data

def get_notifications():
    if use_supabase:
        try:
            response = db_client.table("notifications").select("*").execute()
            return response.data
        except Exception as e:
            print(f"Supabase error in get_notifications: {e}. Falling back to local.")
            
    return load_local_db()["notifications"]

def add_notification(notification_type, message):
    notif_data = {
        "type": notification_type,
        "message": message,
        "time": datetime.now().strftime("%I:%M %p")
    }
    if use_supabase:
        try:
            existing = db_client.table("notifications").select("id").execute()
            notif_data["id"] = str(len(existing.data) + 1)
            db_client.table("notifications").insert(notif_data).execute()
            return notif_data
        except Exception as e:
            print(f"Supabase error in add_notification: {e}. Falling back to local.")
            
    local_data = load_local_db()
    notif_data["id"] = len(local_data["notifications"]) + 1
    local_data["notifications"].append(notif_data)
    save_local_db(local_data)
    return notif_data

def clear_notifications():
    if use_supabase:
        try:
            db_client.table("notifications").delete().neq("id", "").execute()
            return True
        except Exception as e:
            print(f"Supabase error in clear_notifications: {e}. Falling back to local.")
            
    local_data = load_local_db()
    local_data["notifications"] = []
    save_local_db(local_data)
    return True

def get_surveillance():
    if use_supabase:
        try:
            response = db_client.table("surveillance").select("*").execute()
            surv_list = response.data
            if not surv_list:
                for item in SEED_DATA["surveillance"]:
                    db_client.table("surveillance").upsert(item).execute()
                return SEED_DATA["surveillance"]
            try:
                surv_list.sort(key=lambda x: x["id"])
            except Exception:
                pass
            return surv_list
        except Exception as e:
            print(f"Supabase error in get_surveillance: {e}. Falling back to local.")
            
    return load_local_db().get("surveillance", SEED_DATA["surveillance"])

def add_surveillance_case(case_data):
    if use_supabase:
        try:
            c_id = case_data.get("id")
            response = db_client.table("surveillance").select("*").execute()
            surveillance_list = response.data
            
            existing = next((item for item in surveillance_list 
                             if item["disease"].lower() == case_data["disease"].lower() 
                             and item["district"].lower() == case_data["district"].lower()), None)
            if existing:
                existing["cases"] += 1
                existing["lastUpdated"] = datetime.now().strftime("%Y-%m-%d")
                if existing["cases"] >= 25:
                    existing["risk"] = "Critical"
                elif existing["cases"] >= 15:
                    existing["risk"] = "High"
                elif existing["cases"] >= 5:
                    existing["risk"] = "Moderate"
                else:
                    existing["risk"] = "Low"
                case_data = existing
                db_client.table("surveillance").upsert(case_data).execute()
            else:
                if not c_id:
                    case_data["id"] = f"DS-{len(surveillance_list) + 1001}"
                case_data["cases"] = 1
                case_data["status"] = "Active"
                case_data["risk"] = "Low"
                case_data["lastUpdated"] = datetime.now().strftime("%Y-%m-%d")
                db_client.table("surveillance").upsert(case_data).execute()
            return case_data
        except Exception as e:
            print(f"Supabase error in add_surveillance_case: {e}. Falling back to local.")
            
    local_data = load_local_db()
    if "surveillance" not in local_data:
        local_data["surveillance"] = SEED_DATA["surveillance"]
    
    existing = next((item for item in local_data["surveillance"] 
                     if item["disease"].lower() == case_data["disease"].lower() 
                     and item["district"].lower() == case_data["district"].lower()), None)
    if existing:
        existing["cases"] += 1
        existing["lastUpdated"] = datetime.now().strftime("%Y-%m-%d")
        if existing["cases"] >= 25:
            existing["risk"] = "Critical"
        elif existing["cases"] >= 15:
            existing["risk"] = "High"
        elif existing["cases"] >= 5:
            existing["risk"] = "Moderate"
        else:
            existing["risk"] = "Low"
        case_data = existing
    else:
        if "id" not in case_data or not case_data["id"]:
            case_data["id"] = f"DS-{len(local_data['surveillance']) + 1001}"
        case_data["cases"] = 1
        case_data["status"] = "Active"
        case_data["risk"] = "Low"
        case_data["lastUpdated"] = datetime.now().strftime("%Y-%m-%d")
        local_data["surveillance"].append(case_data)
        
    save_local_db(local_data)
    return case_data


# Initialize database (seeds Supabase if empty and connected)
if use_supabase:
    try:
        # Check doctor
        doc_resp = db_client.table("doctor").select("*").eq("id", "main").execute()
        if not doc_resp.data:
            db_client.table("doctor").insert({"id": "main", **SEED_DATA["doctor"]}).execute()
        # Check inventory
        inv_resp = db_client.table("inventory").select("*").limit(1).execute()
        if not inv_resp.data:
            for item in SEED_DATA["inventory"]:
                db_client.table("inventory").insert(item).execute()
        # Check patients
        p_resp = db_client.table("patients").select("*").limit(1).execute()
        if not p_resp.data:
            for p in SEED_DATA["patients"]:
                db_client.table("patients").insert(p).execute()
        # Check doctors
        d_resp = db_client.table("doctors").select("*").limit(1).execute()
        if not d_resp.data:
            for d in SEED_DATA["doctors"]:
                db_client.table("doctors").insert(d).execute()
        # Check surveillance
        s_resp = db_client.table("surveillance").select("*").limit(1).execute()
        if not s_resp.data:
            for s in SEED_DATA["surveillance"]:
                db_client.table("surveillance").insert(s).execute()
    except Exception as e:
        print(f"Error seeding Supabase: {e}")
else:
    load_local_db()