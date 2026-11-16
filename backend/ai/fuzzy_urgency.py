
import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl


# ==========================================
# STEP 1: DEFINE INPUT VARIABLES
# ==========================================

severity = ctrl.Antecedent(np.arange(0, 101, 1), "severity")
public_impact = ctrl.Antecedent(np.arange(0, 101, 1), "public_impact")
safety_risk = ctrl.Antecedent(np.arange(0, 101, 1), "safety_risk")
duration = ctrl.Antecedent(np.arange(0, 101, 1), "duration")


# ==========================================
# STEP 2: DEFINE OUTPUT VARIABLE
# ==========================================

urgency = ctrl.Consequent(np.arange(0, 101, 1), "urgency")


# ==========================================
# STEP 3: MEMBERSHIP FUNCTIONS
# ==========================================

# Severity
severity["low"] = fuzz.trimf(severity.universe, [0, 0, 50])
severity["medium"] = fuzz.trimf(severity.universe, [25, 50, 75])
severity["high"] = fuzz.trimf(severity.universe, [50, 100, 100])

# Public impact
public_impact["low"] = fuzz.trimf(public_impact.universe, [0, 0, 50])
public_impact["medium"] = fuzz.trimf(public_impact.universe, [25, 50, 75])
public_impact["high"] = fuzz.trimf(public_impact.universe, [50, 100, 100])

# Safety risk
safety_risk["low"] = fuzz.trimf(safety_risk.universe, [0, 0, 50])
safety_risk["medium"] = fuzz.trimf(safety_risk.universe, [25, 50, 75])
safety_risk["high"] = fuzz.trimf(safety_risk.universe, [50, 100, 100])

# Duration
duration["short"] = fuzz.trimf(duration.universe, [0, 0, 40])
duration["medium"] = fuzz.trimf(duration.universe, [20, 50, 80])
duration["long"] = fuzz.trimf(duration.universe, [60, 100, 100])

# Urgency output
urgency["low"] = fuzz.trimf(urgency.universe, [0, 0, 40])
urgency["medium"] = fuzz.trimf(urgency.universe, [25, 50, 75])
urgency["high"] = fuzz.trimf(urgency.universe, [60, 100, 100])


# ==========================================
# STEP 4: DEFINE FUZZY IF-THEN RULES
# ==========================================

# High urgency conditions

rule1 = ctrl.Rule(
    safety_risk["high"],
    urgency["high"]
)

rule2 = ctrl.Rule(
    severity["high"] & public_impact["high"],
    urgency["high"]
)

rule3 = ctrl.Rule(
    severity["high"] & public_impact["medium"],
    urgency["high"]
)

rule4 = ctrl.Rule(
    severity["medium"] & public_impact["high"],
    urgency["high"]
)

rule5 = ctrl.Rule(
    duration["long"] & severity["medium"],
    urgency["high"]
)


# Medium urgency conditions

rule6 = ctrl.Rule(
    severity["medium"] & public_impact["medium"],
    urgency["medium"]
)

rule7 = ctrl.Rule(
    severity["low"] & public_impact["medium"],
    urgency["medium"]
)

rule8 = ctrl.Rule(
    severity["medium"] & safety_risk["medium"],
    urgency["medium"]
)

rule9 = ctrl.Rule(
    duration["long"] & severity["low"] & public_impact["medium"],
    urgency["medium"]
)


# Low urgency conditions

rule10 = ctrl.Rule(
    severity["low"] & public_impact["low"] & safety_risk["low"],
    urgency["low"]
)

rule11 = ctrl.Rule(
    severity["low"] & safety_risk["low"] & duration["short"],
    urgency["low"]
)

rule12 = ctrl.Rule(
    severity["medium"] & public_impact["low"] & safety_risk["low"],
    urgency["low"]
)


# Create fuzzy control system with all 12 rules

urgency_control = ctrl.ControlSystem([
    rule1, rule2, rule3, rule4, rule5, rule6,
    rule7, rule8, rule9, rule10, rule11, rule12
])


# ==========================================
# STEP 5: CALCULATE URGENCY SCORE
# ==========================================

def calculate_urgency(severity_value, impact_value,
                      safety_value, duration_value):

    urgency_simulation = ctrl.ControlSystemSimulation(
        urgency_control
    )

    urgency_simulation.input["severity"] = severity_value
    urgency_simulation.input["public_impact"] = impact_value
    urgency_simulation.input["safety_risk"] = safety_value
    urgency_simulation.input["duration"] = duration_value

    # Perform fuzzy inference and defuzzification
    urgency_simulation.compute()

    # Get final numerical urgency score
    score = urgency_simulation.output["urgency"]

    return round(score, 2)


# ==========================================
# STEP 6: GENERATE EXPLANATION
# ==========================================

def explain_urgency(severity_value, impact_value,
                    safety_value, duration_value):

    inputs = {
        "Severity": (severity, severity_value),
        "Public Impact": (public_impact, impact_value),
        "Safety Risk": (safety_risk, safety_value),
        "Duration": (duration, duration_value)
    }

    explanations = []

    for name, (variable, value) in inputs.items():

        memberships = {}

        # Calculate membership degree for each category
        for term in variable.terms:

            degree = fuzz.interp_membership(
                variable.universe,
                variable[term].mf,
                value
            )

            memberships[term] = degree

        # Find strongest fuzzy category
        strongest_category = max(
            memberships,
            key=memberships.get
        )

        degree = memberships[strongest_category]

        explanations.append(
            f"{name}: {value}/100 - "
            f"{strongest_category} "
            f"(membership: {degree:.2f})"
        )

    # Generate overall human-readable explanation

    high_factors = []
    medium_factors = []

    for explanation in explanations:

        category = explanation.split(" - ")[1].split(" ")[0]

        if category == "high" or category == "long":
            high_factors.append(explanation.split(":")[0])

        elif category == "medium":
            medium_factors.append(explanation.split(":")[0])

    if high_factors:
        summary = (
            "This complaint may require urgent attention because "
            + ", ".join(high_factors)
            + " have significant values."
        )

    elif medium_factors:
        summary = (
            "This complaint has moderate urgency because "
            + ", ".join(medium_factors)
            + " have moderate values."
        )

    else:
        summary = (
            "This complaint has relatively low urgency based on "
            "the provided inputs."
        )

    return {
        "input_explanations": explanations,
        "overall_summary": summary
    }


# ==========================================
# STEP 7: TEST FUZZY URGENCY SYSTEM
# ==========================================

if __name__ == "__main__":

    severity_value = 85
    impact_value = 90
    safety_value = 80
    duration_value = 70

    score = calculate_urgency(
        severity_value,
        impact_value,
        safety_value,
        duration_value
    )

    explanation = explain_urgency(
        severity_value,
        impact_value,
        safety_value,
        duration_value
    )

    print("\nComplaint Urgency Score:", score, "/100")

    print("\nWhy was this score assigned?")

    for reason in explanation["input_explanations"]:
        print("-", reason)

    print("\nOverall Explanation:")
    print(explanation["overall_summary"])
