from flask import Blueprint, request, jsonify
from .preprocess import preprocess_text
from .vectorizer import predict_text

main = Blueprint('main', __name__)

@main.route('/text_preprocess', methods=['POST'])
def preprocess():
    data = request.get_json()
    text = data.get('text', '')
    options = data.get('options', {})

    if not text.strip():
        return jsonify({'error': 'Text is empty'}), 400
    
    processed = preprocess_text(text, options)
    return jsonify({
        'original': text,
        'processed': processed
    })

@main.route('/text_vectorize', methods=['POST'])
def classify_text():
    data = request.get_json()
    text = data.get('text', '').strip()
    method = data.get('method', 'bow')
    result, error = predict_text(text, method)
    if error:
        return jsonify({'error': error}), 400
    return jsonify({'result': result})

@main.route('/')
def home():
    return 'App is working...'