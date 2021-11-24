from flask import Flask, request, jsonify
from pytorch_transformers import GPT2Tokenizer, GPT2LMHeadModel, BertTokenizer, BertModel, BertForMaskedLM
from transformers import pipeline
from flask_cors import CORS, cross_origin
import re

app = Flask(__name__)
cors = CORS(app)


@app.route("/sugestion", methods=['POST'])
@cross_origin(origin='localhost')
def sugestions():
    text = request.get_json()['text']
    text = text.strip()
    processed_text = basicPreprocess(text)

    results = fill_mask(processed_text + " [MASK]")

    words = [fill_mask.tokenizer.convert_ids_to_tokens(
        a["token"]) for a in list(results)]

    return jsonify(words)


def basicPreprocess(text):
    processed_text = text.lower()
    processed_text = re.sub(r"-\n", "", processed_text)
    processed_text = re.sub(r"\n", ' ', processed_text)
    processed_text = re.sub(r" +", " ", processed_text)
    processed_text = processed_text[-512::]
    return processed_text


fill_mask = pipeline("fill-mask", model="allenai/scibert_scivocab_uncased",
                     tokenizer="allenai/scibert_scivocab_uncased")
