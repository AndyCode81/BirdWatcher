import numpy as np
from sklearn.ensemble import IsolationForest

def load_network_data():
    # Replace this with your actual data extraction logic
    # Here we simulate with random data
    data = np.random.rand(100, 3) * 100  # 100 samples, 3 features each
    # Introduce a few anomalies
    data[5] = [900, 2.5, 5]
    data[20] = [850, 3.0, 4]
    return data

def train_model(X):
    model = IsolationForest(n_estimators=100, contamination=0.1, random_state=42)
    model.fit(X)
    return model

def detect_anomalies(model, X):
    predictions = model.predict(X)
    anomaly_indices = np.where(predictions == -1)[0]
    anomalies = X[anomaly_indices]
    return anomaly_indices, anomalies

def main():
    # Step 1: Load and preprocess network data
    data = load_network_data()
    
    # Step 2: Train the Isolation Forest model
    model = train_model(data)
    
    # Step 3: Detect anomalies in the data
    anomaly_indices, anomalies = detect_anomalies(model, data)
    
    print("Anomaly Indices:", anomaly_indices)
    print("Anomalies Detected:\n", anomalies)

if __name__ == "__main__":
    main()
