# app.py
from flask import Flask, request, jsonify, render_template
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.groq import Groq
import os

app = Flask(__name__, static_folder="static", template_folder="templates")

# Initialize LlamaIndex components
def initialize_index():
    # Settings control global defaults
    Settings.embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-base-en-v1.5")
    Settings.llm = Groq(model="llama3-70b-8192", api_key="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")

    # Create a RAG tool using LlamaIndex
    documents = SimpleDirectoryReader("data").load_data()
    index = VectorStoreIndex.from_documents(
        documents,
        # we can optionally override the embed_model here
        # embed_model=Settings.embed_model,
    )
    query_engine = index.as_query_engine()
    return query_engine

# Initialize once at startup
query_engine = initialize_index()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/query', methods=['POST'])
def query():
    user_input = request.json.get('query', '')
    
    if not user_input:
        return jsonify({'response': 'Please provide a query.'})
    
    try:
        # Query the engine with user input
        response = query_engine.query(user_input)
        return jsonify({'response': str(response)})
    except Exception as e:
        return jsonify({'response': f'Error: {str(e)}'})

if __name__ == '__main__':
    # Make sure the data directory exists
    if not os.path.exists("data"):
        os.makedirs("data")
        
    # Make sure there's at least one document for testing
    if not os.listdir("data"):
        with open("data/hr_policy.txt", "w") as f:
            f.write("""
# Introduction

The purpose of this document is to highlight areas within Human Resource
Management and to provide guidelines for devising the Policies and
Procedures of an organization relating to HR. As such the HR Policy
Manual should attempt to guide the management to take decisions for day
to day interactions with and between employees.

# Code of conduct

Management needs to lay down its own Code of conduct, which engulfs the
entire organization. This is a generic code, which will guide employees
in situations where an employee is unsure how to respond to a scenario.
            """)
    
    app.run(debug=True)