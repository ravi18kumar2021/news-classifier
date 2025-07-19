import os
import re
import pickle
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, 'models')

def load_pickle_file(filename):
    try:
        with open(os.path.join(MODEL_DIR, filename), 'rb') as f:
            return pickle.load(f)
    except Exception as e:
        raise RuntimeError(f"Error loading {filename}: {str(e)}")

def tokenize_text(text):
    text = re.sub(r'[^\w\s]', '', text.lower())
    return text.split()

def top_predictions(probs, class_labels):
    prob_dict = {label: float(prob) for label, prob in zip(class_labels, probs)}
    return prob_dict

def predict_text(text, method):
    if not text.strip():
        return None, 'Text is empty'

    clean_text = text.strip()
    result = {}

    if method == 'onehot':
        # One-hot: use tokens
        vectorizer = load_pickle_file('vectorizer_onehot.pkl')
        model = load_pickle_file('model_onehot.pkl')
        tokens = tokenize_text(clean_text)
        transformed = vectorizer.transform([tokens])  # token list wrapped in outer list
    elif method in ['bow', 'tfidf', 'ngram']:
        # Load both vectorizer and model
        vectorizer = load_pickle_file(f'vectorizer_{method}.pkl')
        model = load_pickle_file(f'model_{method}.pkl')
        transformed = vectorizer.transform([clean_text])  # just wrap as list of string
    else:
        return None, 'Invalid vectorization method'

    prediction = model.predict(transformed)
    probs = model.predict_proba(transformed)

    class_labels = load_pickle_file('class_labels.pkl')
    probabilities = top_predictions(probs[0], list(class_labels))
    result['prediction'] = prediction[0]
    result['probabilities'] = probabilities
    result['confidence'] = round(probabilities[prediction[0]], 3)

    return result, None
