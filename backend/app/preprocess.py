import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

nltk.download('stopwords', quiet=True)
nltk.download('wordnet')

stop_words = set(stopwords.words('english'))
stemmer = PorterStemmer()

def preprocess_text(text, options):
    if options.get('lowercase'):
        text = text.lower()
    if options.get('remove_punctuation'):
        text = re.sub(r'[^\w\s]', '', text)
    if options.get('remove_numbers'):
        text = re.sub(r'\d+', '', text)
    if options.get('remove_stopwords'):
        text = ' '.join([word for word in text.split() if word not in stop_words])
    if options.get('stemming'):
        text = ' '.join([stemmer.stem(word) for word in text.split()])
    if options.get('strip_whitespace'):
        text = ' '.join(text.split())
    return text