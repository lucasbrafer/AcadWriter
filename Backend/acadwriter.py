from flask import Flask, request, jsonify
from pytorch_transformers import GPT2Tokenizer, GPT2LMHeadModel, BertTokenizer, BertModel, BertForMaskedLM
from transformers import pipeline
import re

app = Flask(__name__)

@app.route("/", methods = ['POST'])
def hello_world():
    text = request.form['text']
    text = text.strip()
    text = basicPreprocess(text)

    results = fill_mask(text + " [MASK]")

    words = [fill_mask.tokenizer.convert_ids_to_tokens(a["token"]) for a in list(results)]

    return jsonify(words)

def basicPreprocess(text):
    processed_text = text.lower()
    processed_text = re.sub(r"-\n", "", processed_text)
    processed_text = re.sub(r"\n", ' ', processed_text)
    processed_text = re.sub(r" +", " ", processed_text)
    return processed_text

fill_mask = pipeline("fill-mask", model="allenai/scibert_scivocab_uncased", tokenizer="allenai/scibert_scivocab_uncased")