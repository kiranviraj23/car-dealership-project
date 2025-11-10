from flask import Flask, request, jsonify
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer

# download vader lexicon (first run will download; ok to run every time)
nltk.download('vader_lexicon')

sia = SentimentIntensityAnalyzer()
app = Flask(__name__)

@app.route('/analyze')
def analyze():
    text = request.args.get('text', '')
    if not text:
        return jsonify({'error':'no text provided'}), 400
    s = sia.polarity_scores(text)
    compound = s['compound']
    if compound >= 0.05:
        label = 'positive'
    elif compound <= -0.05:
        label = 'negative'
    else:
        label = 'neutral'
    return jsonify({'label': label, 'score': compound, 'raw': s})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=6001)
