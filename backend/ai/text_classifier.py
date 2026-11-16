
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression


# Step 1: Text preprocessing
def preprocess_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-zA-Z0-9\s]", " ", text)
    text = " ".join(text.split())
    return text


# Step 2: Training dataset
complaints = [
    # Garbage complaints
    "garbage is overflowing near the park",
    "waste is not collected from the street",
    "dustbins are full of garbage",
    "garbage is scattered across the road",
    "the garbage bin has not been emptied",
    "people are dumping waste in the open area",
    "a large pile of garbage is lying near my house",
    "the garbage collection vehicle has not arrived",
    "bad smell is coming from accumulated waste",
    "the public dustbin is overflowing",
    "waste has been lying on the roadside for days",
    "garbage is not being collected in our locality",

    # Water complaints
    "water pipeline is leaking",
    "there is no water supply in our area",
    "water is overflowing from the pipe",
    "drinking water is not available",
    "a water pipe has burst near my house",
    "dirty water is coming from the tap",
    "water is leaking continuously on the road",
    "the main water supply line is damaged",
    "there is water shortage in our locality",
    "sewage water is mixing with drinking water",
    "the public water tap is not working",
    "water is being wasted due to pipeline leakage",

    # Road complaints
    "there is a large pothole on the road",
    "the road is damaged and broken",
    "there are cracks on the road",
    "the road surface is badly damaged",
    "a deep pothole is causing traffic problems",
    "the street has not been repaired",
    "the road is uneven and difficult to drive on",
    "construction has left the road damaged",
    "there are multiple potholes near the market",
    "the road is full of cracks",
    "a damaged road is causing accidents",
    "the road needs urgent repair",

    # Streetlight complaints
    "streetlight is not working",
    "street lights are broken",
    "there is no light on the street",
    "the streetlight has stopped working",
    "the road is dark at night due to broken lights",
    "several streetlights are not functioning",
    "the streetlight near my house is damaged",
    "there is no proper lighting in the park",
    "the streetlights keep switching off",
    "the public road has no working lights",
    "the streetlight pole is not illuminating",
    "our locality has been without streetlights for days"
]


# Step 3: Assign categories to training examples
categories = (
    ["garbage"] * 12
    + ["water"] * 12
    + ["roads"] * 12
    + ["streetlights"] * 12
)


# Step 4: Preprocess training complaints
cleaned_complaints = [
    preprocess_text(text) for text in complaints
]


# Step 5: Convert text into TF-IDF numerical features
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(cleaned_complaints)


# Step 6: Train Logistic Regression model
model = LogisticRegression(max_iter=1000)
model.fit(X, categories)


# Step 7: Predict complaint category

def predict_category(complaint: str) -> str:
    cleaned = preprocess_text(complaint)

    complaint_vector = vectorizer.transform([cleaned])

    probabilities = model.predict_proba(complaint_vector)

    confidence = max(probabilities[0])

    if confidence < 0.40:
        return "other"

    prediction = model.predict(complaint_vector)

    return prediction[0]



# Step 8: Run a sample prediction when executed directly
if __name__ == "__main__":
    test_complaints = [
        "Water is leaking near my house",
        "Garbage is not collected from our street",
        "There is a huge pothole near the school",
        "Streetlights are not working at night"
    ]

    for test_complaint in test_complaints:
        result = predict_category(test_complaint)
        print("Complaint:", test_complaint)
        print("Predicted Category:", result)
        print("-" * 40)
