import os
import random
import json
from datetime import datetime, timedelta
from dotenv import load_dotenv
from supabase import create_client, Client
from faker import Faker

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Supabase URL or Key not found in .env file.")
    exit(1)

print("Connecting to Supabase...")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
print("Connected successfully!")

# Initialize Faker with English (India) locale to generate realistic local names/addresses
fake = Faker('en_IN')

blood_groups = ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"]
burnout_risks = ["Low", "Optimal", "Elevated", "Critical"]
risks = ["Low", "Elevated", "High"]
specialties = ["General Medicine", "Pediatrics", "Cardiology", "OB/GYN", "Orthopedics", "Dermatology", "Neurology", "Ophthalmology"]

symptom_med_pred = [
    {
        "symptoms": "High blood pressure, persistent headache, mild chest tightness",
        "prediction": "High probability of chronic hypertension complications. Advise stress reduction and BP tracker.",
        "medications": ["Amlodipine 5mg (Daily)", "Atorvastatin 10mg (Night)"],
        "disease": "Hypertension"
    },
    {
        "symptoms": "Frequent urination, excessive thirst, dry mouth, chronic fatigue",
        "prediction": "Likely onset of Type-2 Diabetes Mellitus. Monitor HbA1c and request blood glucose profile.",
        "medications": ["Metformin 500mg (Twice daily)", "Methylcobalamin 1500mcg"],
        "disease": "Diabetes"
    },
    {
        "symptoms": "High fever, persistent cough, sore throat, severe runny nose, body aches",
        "prediction": "Influenza-like illness. Low risk of acute respiratory distress syndrome.",
        "medications": ["Paracetamol 650mg (For fever)", "Cough Syrup 10ml (Thrice daily)", "Warm fluids hydration"],
        "disease": "Influenza"
    },
    {
        "symptoms": "High fever, sudden joint and body aches, shivering, headache, nausea",
        "prediction": "Suspected Dengue fever. Order immediate blood platelet count check.",
        "medications": ["Paracetamol 650mg (Every 6 hours)", "ORS hydration packets"],
        "disease": "Dengue"
    },
    {
        "symptoms": "Wheezing, shortness of breath, tightness in chest, dry coughing fits",
        "prediction": "Moderate asthma exacerbation. Avoid dust allergens and ensure inhaler compliance.",
        "medications": ["Salbutamol Inhaler (As needed)", "Budecort inhaler (Twice daily)"],
        "disease": "Asthma"
    },
    {
        "symptoms": "Severe headache on one side, light sensitivity, nausea, throbbing temple pain",
        "prediction": "Migraine exacerbation. Recommend quiet dark room rest and trigger identification.",
        "medications": ["Naproxen 500mg", "Domperidone 10mg"],
        "disease": "Migraine"
    }
]

medicines_base = [
    ("Paracetamol 650mg", "Analgesic", "Cipla Ltd"),
    ("ORS Packets", "Dehydration", "Aurobindo"),
    ("Amoxicillin 500mg", "Antibiotic", "Sun Pharma"),
    ("Amlodipine 5mg", "Hypertension", "Lupin"),
    ("Atorvastatin 10mg", "Cholesterol", "Dr. Reddys"),
    ("Metformin 500mg", "Antidiabetic", "Abbott Labs"),
    ("Salbutamol Inhaler", "Bronchodilator", "Cipla Ltd"),
    ("Insulin Glargine 100 IU", "Cold Chain", "Lilly"),
    ("Cough Syrup 100ml", "Expectorant", "Dabur"),
    ("Azithromycin 500mg", "Antibiotic", "Sun Pharma")
]

surv_diseases = ["Dengue", "Malaria", "Influenza", "Covid-19", "Typhoid", "Cholera", "Tuberculosis", "Viral Fever", "Chikungunya"]

print("Generating 200 records in each category using Faker...")

# Helper to generate clean Indian phone numbers
def gen_indian_phone():
    return f"+91 {random.randint(6000, 9999)} {random.randint(10000, 99999)}"

# 1. Patients Table Seeding (200 records)
print("Seeding Patients...")
patients_data = []
for i in range(1, 201):
    gender = random.choice(["M", "F"])
    # Faker generates names suitable for the en_IN locale
    name = fake.name_male() if gender == "M" else fake.name_female()
    age = random.randint(5, 80)
    cond = random.choice(symptom_med_pred)
    
    t_date_1 = fake.date_between(start_date='-15d', end_date='today').strftime("%b %d, %Y")
    t_date_2 = fake.date_between(start_date='-60d', end_date='-16d').strftime("%b %d, %Y")
    
    timeline = [
        {"date": t_date_1, "event": f"Checked in with symptoms: {cond['disease']}", "type": "visit"},
        {"date": t_date_2, "event": "Lab Report: General Routine Panel Checked", "type": "lab"}
    ]
    
    vitals = {
        "hr": random.randint(65, 110),
        "bp": f"{random.randint(110, 150)}/{random.randint(70, 95)}",
        "temp": f"{round(random.uniform(97.5, 102.5), 1)}°F",
        "o2": f"{random.randint(92, 100)}%"
    }
    
    patient = {
        "id": f"IND-{10000 + i}",
        "name": name,
        "age": age,
        "gender": gender,
        "blood": random.choice(blood_groups),
        "phone": gen_indian_phone(),
        "address": fake.address().replace('\n', ', '),
        "emergency": f"{fake.name()} (Family) - {gen_indian_phone()}",
        "insurance": random.choice(["Ayushman Bharat - Active", "Private - Star Health", "Private - HDFC Ergo", "None"]),
        "symptoms": cond["symptoms"],
        "vitals": vitals,
        "healthScore": random.randint(35, 98),
        "risk": random.choice(risks),
        "prediction": cond["prediction"],
        "medications": cond["medications"],
        "followUp": f"Recommend review or tele-consult in {random.randint(3, 14)} days.",
        "timeline": timeline
    }
    patients_data.append(patient)

for chunk in [patients_data[i:i + 50] for i in range(0, len(patients_data), 50)]:
    supabase.table("patients").upsert(chunk).execute()
print("Patients seeded successfully.")

# 2. Inventory Table Seeding (200 records)
print("Seeding Inventory...")
inventory_data = []
for i in range(1, 201):
    med = random.choice(medicines_base)
    stock = random.randint(5, 450)
    capacity = random.randint(200, 600)
    status = "Optimal"
    if stock < 20:
        status = "Critical"
    elif stock < 50:
        status = "Low Stock"
        
    item = {
        "id": str(i),
        "medicine": f"{med[0]} Batch-{random.randint(100, 999)}",
        "type": med[1],
        "stock": stock,
        "capacity": capacity,
        "status": status,
        "location": random.choice(["Main Fridge", "Shelf A", "Shelf B", "Shelf C", "Shelf D", "Cabinet A", "Cabinet B"]),
        "expiry": f"202{random.randint(6, 9)}-{str(random.randint(1, 12)).zfill(2)}",
        "supplier": med[2]
    }
    inventory_data.append(item)

for chunk in [inventory_data[i:i + 50] for i in range(0, len(inventory_data), 50)]:
    supabase.table("inventory").upsert(chunk).execute()
print("Inventory seeded successfully.")

# 3. Doctors Table Seeding (200 records)
print("Seeding Doctors...")
doctors_data = []
for i in range(1, 201):
    gender = random.choice(["M", "F"])
    name = f"Dr. {fake.name_male()}" if gender == "M" else f"Dr. {fake.name_female()}"
    
    d = {
        "id": f"DOC-{str(i).zfill(3)}",
        "name": name,
        "specialty": random.choice(specialties),
        "location": f"{fake.city()} PHC",
        "experience": f"{random.randint(3, 25)} Yrs",
        "rating": round(random.uniform(4.0, 5.0), 1),
        "telemedicine": random.choice([True, False]),
        "patientLoad": random.randint(10, 100),
        "burnoutRisk": random.choice(burnout_risks),
        "schedule": f"Shift: {str(random.randint(8, 12)).zfill(2)}:00 - {str(random.randint(16, 20)).zfill(2)}:00",
        "isEmergencyAssigned": random.choice([True, False]),
        "present": random.choice([True, False]),
        "check_in": fake.date_time_this_month().strftime("%d-%m-%Y %H:%M:%S") if random.choice([True, False]) else None
    }
    doctors_data.append(d)

for chunk in [doctors_data[i:i + 50] for i in range(0, len(doctors_data), 50)]:
    supabase.table("doctors").upsert(chunk).execute()
print("Doctors seeded successfully.")

# 4. Surveillance Table Seeding (200 records)
print("Seeding Outbreak Surveillance...")
surv_data = []
for i in range(1, 201):
    cases = random.randint(1, 45)
    risk = "Low"
    if cases >= 25:
        risk = "Critical"
    elif cases >= 15:
        risk = "High"
    elif cases >= 5:
        risk = "Moderate"
        
    s = {
        "id": f"DS-{1000 + i}",
        "disease": random.choice(surv_diseases),
        "district": fake.city(),
        "cases": cases,
        "status": random.choice(["Active", "Monitored"]),
        "risk": risk,
        "lastUpdated": fake.date_between(start_date='-30d', end_date='today').strftime("%Y-%m-%d")
    }
    surv_data.append(s)

for chunk in [surv_data[i:i + 50] for i in range(0, len(surv_data), 50)]:
    supabase.table("surveillance").upsert(chunk).execute()
print("Surveillance seeded successfully.")

# 5. Events Table Seeding (200 records)
print("Seeding Events...")
levels = ["INFO", "WARNING", "ERROR"]
events_data = []
for i in range(1, 201):
    e = {
        "message": f"Clinical event: {fake.sentence()}",
        "level": random.choice(levels),
        "time": fake.date_time_this_month().strftime("%d-%m-%Y %H:%M:%S")
    }
    events_data.append(e)

for chunk in [events_data[i:i + 50] for i in range(0, len(events_data), 50)]:
    supabase.table("events").insert(chunk).execute()
print("Events seeded successfully.")

# 6. Notifications Table Seeding (200 records)
print("Seeding Notifications...")
notif_types = ["success", "warning", "info", "error"]
notif_data = []
for i in range(1, 201):
    n = {
        "id": str(i),
        "type": random.choice(notif_types),
        "message": f"Alert alert: {fake.sentence()}",
        "time": fake.date_time_this_month().strftime("%I:%M %p")
    }
    notif_data.append(n)

for chunk in [notif_data[i:i + 50] for i in range(0, len(notif_data), 50)]:
    supabase.table("notifications").upsert(chunk).execute()
print("Notifications seeded successfully.")

print("\nSeeding complete! 200 Faker-generated records inserted into each Supabase table successfully.")
