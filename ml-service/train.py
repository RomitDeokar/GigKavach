import json
import os
import pickle

import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier, GradientBoostingRegressor, RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, mean_squared_error, r2_score, classification_report

# Initialize label encoders dictionary
label_encoders = {}
BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def resolve_path(*parts):
    return os.path.join(BASE_DIR, *parts)

def encode_categorical_features(df, fit=False):
    """Encode categorical features to numeric values"""
    df_encoded = df.copy()
    categorical_cols = df_encoded.select_dtypes(include=['object']).columns
    
    for col in categorical_cols:
        if fit:
            # Create new encoder for training data
            le = LabelEncoder()
            df_encoded[col] = le.fit_transform(df_encoded[col])
            label_encoders[col] = le
        else:
            # Use existing encoder for test data
            if col in label_encoders:
                try:
                    df_encoded[col] = label_encoders[col].transform(df_encoded[col])
                except ValueError as e:
                    print(f"Warning: Could not encode {col} - {e}")
    
    return df_encoded

def save_encoders(encoder_path):
    """Save label encoders for later use"""
    encoder_dict = {}
    for col, le in label_encoders.items():
        encoder_dict[col] = le.classes_.tolist()
    
    with open(encoder_path, 'w') as f:
        json.dump(encoder_dict, f)

def train_model(data_path, model_path, encoder_path=None, model_type='classifier', target_col='target'):
    if not os.path.exists(data_path):
        print(f"Data file {data_path} not found.")
        return

    df = pd.read_csv(data_path, sep=None, engine='python')
    if df.empty:
        print(f"Data file {data_path} is empty.")
        return

    # Check if target column exists
    if target_col not in df.columns:
        print(f"Target column '{target_col}' not found in {data_path}")
        print(f"Available columns: {df.columns.tolist()}")
        return

    print(f"\nDataset: {os.path.basename(data_path)}")
    print(f"  Rows: {len(df)}, Features: {len(df.columns) - 1}")

    # Handle missing values
    for col in df.select_dtypes(include=[np.number]).columns:
        if df[col].isna().any():
            df[col].fillna(df[col].median(), inplace=True)
    for col in df.select_dtypes(include=['object']).columns:
        if df[col].isna().any():
            df[col].fillna(df[col].mode().iloc[0] if not df[col].mode().empty else 'Unknown', inplace=True)

    # Encode categorical features
    df_encoded = encode_categorical_features(df, fit=True)
    
    # Make sure target column is numeric
    if df_encoded[target_col].dtype == 'object':
        le = LabelEncoder()
        df_encoded[target_col] = le.fit_transform(df_encoded[target_col])
    
    X = df_encoded.drop(columns=[target_col])
    y = df_encoded[target_col]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    if model_type == 'classifier':
        # Use GradientBoosting for better performance
        model = GradientBoostingClassifier(
            n_estimators=200,
            learning_rate=0.1,
            max_depth=5,
            min_samples_split=5,
            min_samples_leaf=2,
            subsample=0.8,
            random_state=42
        )
    else:
        model = GradientBoostingRegressor(
            n_estimators=200,
            learning_rate=0.1,
            max_depth=5,
            min_samples_split=5,
            min_samples_leaf=2,
            subsample=0.8,
            random_state=42
        )

    model.fit(X_train, y_train)
    
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    
    # Cross-validation score
    cv_scores = cross_val_score(model, X, y, cv=5, scoring='accuracy' if model_type == 'classifier' else 'r2')
    
    print(f"  Model: {os.path.basename(model_path)}")
    print(f"  Train Score: {train_score:.4f}")
    print(f"  Test Score:  {test_score:.4f}")
    print(f"  CV Mean:     {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
    
    if model_type == 'classifier':
        y_pred = model.predict(X_test)
        print(f"  Accuracy:    {accuracy_score(y_test, y_pred):.4f}")
    else:
        y_pred = model.predict(X_test)
        print(f"  RMSE:        {np.sqrt(mean_squared_error(y_test, y_pred)):.4f}")
        print(f"  R2:          {r2_score(y_test, y_pred):.4f}")

    # Feature importance
    importances = model.feature_importances_
    feature_names = X.columns
    top_features = sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True)[:5]
    print(f"  Top Features: {', '.join(f'{name}({imp:.3f})' for name, imp in top_features)}")

    with open(model_path, 'wb') as f:
        pickle.dump(model, f)

    # Save encoders if provided
    if encoder_path:
        save_encoders(encoder_path)

    print(f"  Saved to {os.path.basename(model_path)}")

# Reset encoders for each model
print("=" * 60)
print("  GigKavach ML Model Training (Gradient Boosting)")
print("=" * 60)

label_encoders = {}
train_model(resolve_path('datasets', 'fraud_data.csv'), resolve_path('fraud_model.pkl'), resolve_path('fraud_encoders.json'), 'classifier')

label_encoders = {}
train_model(resolve_path('datasets', 'insurance_data.csv'), resolve_path('price_model.pkl'), resolve_path('price_encoders.json'), 'regressor')

label_encoders = {}
train_model(resolve_path('datasets', 'risk_data.csv'), resolve_path('risk_model.pkl'), resolve_path('risk_encoders.json'), 'regressor')

label_encoders = {}
train_model(resolve_path('datasets', 'claims_data.csv'), resolve_path('claim_model.pkl'), resolve_path('claim_encoders.json'), 'classifier')

print("\n" + "=" * 60)
print("  All models trained and saved successfully!")
print("=" * 60)
