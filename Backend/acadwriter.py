from flask import Flask, request, jsonify
import torch
from pytorch_transformers import GPT2Tokenizer, GPT2LMHeadModel, BertTokenizer, BertModel, BertForMaskedLM
from transformers import pipeline
import re
import time
import transformers
import math
import copy
import json
import os

app = Flask(__name__)

@app.route("/", methods = ['POST'])
def hello_world():
    text = request.form['text']
    text = text.strip()
    text = basicPreprocess(text)

    results = fill_mask(text + " [MASK]")

    words = [fill_mask.tokenizer.convert_ids_to_tokens(a["token"]) for a in list(results)]
    for word in words:
        print(word)
    return jsonify(words)



def basicPreprocess(text):
    processed_text = text.lower()
    processed_text = re.sub(r"-\n", "", processed_text) # when a word is line broken
    processed_text = re.sub(r"\n", ' ', processed_text)
    processed_text = re.sub(r" +", " ", processed_text)
    return processed_text


fill_mask = pipeline("fill-mask", model="allenai/scibert_scivocab_uncased", tokenizer="allenai/scibert_scivocab_uncased")

#fill_mask = pipeline("fill-mask", model="./newriter2021_2", tokenizer="./newriter2021_2")


def score(sentence, pipe):
    tokenize_input = pipe.tokenizer.tokenize(sentence)
    tensor_input = torch.tensor([pipe.tokenizer.convert_tokens_to_ids(tokenize_input)])
    loss = pipe.model(tensor_input, labels=tensor_input)
    return math.exp(loss[0])