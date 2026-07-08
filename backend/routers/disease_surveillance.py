from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import database

router = APIRouter()

class CaseReportRequest(BaseModel):
    disease: str
    district: str

@router.get("/surveillance")
def get_surveillance_data():
    try:
        return database.get_surveillance()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/surveillance/case")
def report_case(data: CaseReportRequest):
    try:
        new_case = {
            "disease": data.disease,
            "district": data.district
        }
        res = database.add_surveillance_case(new_case)
        # Log case as event
        database.add_event(f"New case of {data.disease} reported in {data.district}", "WARNING")
        # Add a notification
        database.add_notification("warning", f"New case of {data.disease} in {data.district}! Total cases: {res['cases']}")
        return {"status": "success", "data": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/surveillance/mitigation")
def get_mitigation_plan():
    return {
        "plans": [
            {
                "disease": "Dengue",
                "district": "Indore",
                "actions": [
                    "Vector control (fogging & larvicide spraying) in Sector 4.",
                    "Distribute insecticide-treated bed nets to vulnerable households.",
                    "Set up mobile fever triage clinics at primary school buildings."
                ],
                "authority": "District Health Officer (DHO)",
                "status": "In Progress"
            },
            {
                "disease": "Influenza",
                "district": "Ujjain",
                "actions": [
                    "Public health advisory on respiratory hygiene and mask wearing.",
                    "Prioritize influenza antiviral drug distribution to CHC East.",
                    "Allocate extra pediatric beds at Civil Hospital."
                ],
                "authority": "State Epidemiologist Office",
                "status": "Initiated"
            },
            {
                "disease": "Malaria",
                "district": "Bhopal",
                "actions": [
                    "Conduct mass drug administration screen-and-treat campaigns.",
                    "Verify cold chain stability for rapid diagnostic tests.",
                    "Public awareness campaigns on standing water removal."
                ],
                "authority": "Bhopal Municipal Corporation",
                "status": "Monitored"
            }
        ]
    }
