import random

WORKLOAD_TYPES = [
    "BIM Render Engine",
    "Drone Survey Processor",
    "CAD Database",
    "Structural Simulation",
    "Project Scheduler"
]

REGIONS = [
    "us-east",
    "eu-west",
    "asia-south",
    "us-west"
]

def generate_workloads():
    workloads = []

    for i in range(1, 6):
        cpu = random.randint(10, 100)

        workloads.append({
            "id": i,
            "name": WORKLOAD_TYPES[i % len(WORKLOAD_TYPES)],
            "cpu": cpu,
            "memory": random.randint(20, 90),
            "encryption": random.choice([True, False]),
            "region": random.choice(REGIONS),
            "cost_per_hour": round(random.uniform(1.0, 6.0), 2),
            "idle": cpu < 20
        })

    return workloads