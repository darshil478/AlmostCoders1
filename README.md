# AlmostCoders
cd frontend
npm install
npm install tailwindcss @tailwindcss/vite
cd backend
npm install
npm install express cors


#### test
pip install fastapi uvicorn python-multipart
pip install firebase-admin
pip install google-generativeai
pip install pandas
uvicorn main:app --reload


git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

shsharmavl@PSH-Ni2xgrP5NVh MINGW64 ~/Downloads/AlmostCoders-main/AlmostCoders-main/phc-ai-dashboard/phc-ai-dashboard (main)
$ ^C

shsharmavl@PSH-Ni2xgrP5NVh MINGW64 ~/Downloads/AlmostCoders-main/AlmostCoders-main/phc-ai-dashboard/phc-ai-dashboard (main)
$ # 1. Fetch the absolute latest state from GitHub
git fetch origin main

# 2. Force your local folder to match GitHub exactly, overwriting the conflicting files
git reset --hard origin/main
From https://github.com/darshil478/AlmostCoders
 * branch            main       -> FETCH_HEAD
HEAD is now at 695d965 Update README.md


                    🏥 PHC AI Copilot

                  ┌────────────────────┐
                  │     Frontend       │
                  │ React + Tailwind   │
                  └─────────┬──────────┘
                            │ REST APIs
                            ▼
                  ┌────────────────────┐
                  │      Backend       │
                  │ FastAPI APIs       │
                  └─────────┬──────────┘
                            │
        ┌───────────────────┼────────────────────┐
        ▼                   ▼                    ▼
   AI Engine          Event Engine         Firebase



   https://chatgpt.com/g/g-p-6a4a02b5720481918cb6691d475462c7-walk/project


   +---------------------------------------------------------------+
| 🏥 PHC AI Copilot                              👤 Admin        |
+---------------------------------------------------------------+

+---------+-----------------------------------------------+
| Sidebar | Patients Today | Queue | Health | Doctor      |
|         |      15        | 20min | 91/100 | Present     |
|---------+-----------------------------------------------|
| Home    |                                       AI Box  |
|Patient  | Inventory Table                     ----------|
|Medicine |                                       Summary |
|Doctor   |                                               |
|Events   |-----------------------------------------------|
|AI       | Recent Activity                              |
|Settings | Rahul Checked In                             |
|         | Medicine Dispensed                           |
|         | Low Stock Alert                              |
+---------+-----------------------------------------------+


git push only


git add . 
git commit -m "your addition in comment"
git push origin main



Primary Health Centres (PHCs), especially in rural and semi-urban areas, still rely on manual processes for managing patients, medicine inventory, doctor attendance, and daily operations. This leads to long patient waiting times, unexpected medicine shortages, inefficient resource utilization, and delayed decision-making. Healthcare workers lack real-time insights and predictive tools to proactively manage operations and respond to emerging health trends. Existing systems focus only on record-keeping and do not provide intelligent recommendations or analytics. As a result, the quality of healthcare delivery is affected, and administrative workload increases. There is a need for an AI-powered, data-driven platform that can automate PHC operations, predict future challenges, and enable smarter, faster healthcare management.



for above provide me full code with it proper AI ;;; use gemini ,cluade,gpt and 1 other , in it ;





phc-ai-backend/
│
├── ai/
│   ├── agents/
│   │   ├── queue_agent.py
│   │   ├── health_agent.py
│   │   ├── recommendation_agent.py
│   │   ├── outbreak_agent.py
│   │   ├── summary_agent.py
│   │   └── orchestrator.py
│   │
│   ├── providers/
│   │   ├── gemini_provider.py
│   │   ├── openai_provider.py
│   │   ├── claude_provider.py
│   │   ├── groq_provider.py
│   │   └── router.py
│   │
│   ├── prompts/
│   ├── tools/
│   ├── schemas/
│   ├── memory/
│   ├── utils/
│   └── config.py
│
├── routers/
├── services/
├── database/
├── firebase/
├── models/
├── main.py
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
