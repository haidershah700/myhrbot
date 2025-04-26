# MyHRBot

A Retrieval-Augmented Generation bot built with HTML, CSS, JavaScript, and Bootstrap for the frontend, with Flask powering the backend.

## Description

RAG Bot is an intelligent question-answering system that uses retrieval-augmented generation to provide accurate responses based on your documents. The application allows users to upload PDF documents to the data folder, which are then processed and used as a knowledge base for answering queries.

The system combines the power of large language models with a retrieval component that finds relevant information from your documents before generating responses, resulting in more accurate and context-aware answers.

## Features

- Simple and intuitive web interface
- PDF document processing
- Intelligent question answering based on your documents
- Responsive design with Bootstrap

## Prerequisites

- Python 3.8+
- pip (Python package installer)
- Web browser (Chrome, Firefox, Safari, or Edge recommended)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/haidershah700/myhrbot.git
myhrbot
```

### 2. Create and activate a virtual environment

#### For Windows:

```bash
python -m venv venv
venv\Scripts\activate
```

#### For macOS/Linux:

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

## Adding Your Documents

1. Place your PDF documents in the `data` folder located at the root of the project.
2. You can also upload your word file directly to the data folder
3. The system will automatically process these documents when you start the application.

```
my_hr_chatbot/
│
├── app.py                  # Flask application
├── data/                   # Data directory for documents
│   └── hr_policy.txt       # HR policy document
├── static/                 # Static files
│   ├── css/
│   │   └── style.css       # Custom styling
│   └── js/
│       └── script.js       # Frontend JavaScript
└── templates/              # HTML templates
    └── index.html          # Main page template

## Running the Application

### 1. Start the Flask server

```bash
python app.py
```

### 2. Access the application

Open your web browser and navigate to:

```
(http://127.0.0.1:5000/)
```

## Usage

1. **Upload Documents**: Place PDF documents in the `data` folder before starting the application.
2. **Ask Questions**: Type your questions in the input field on the web interface.
3. **Get Answers**: The system will retrieve relevant information from your documents and generate an answer.

## Troubleshooting

- **Application doesn't start**: Ensure you have all the required dependencies installed and that port 5000 is not in use.
- **Documents not being processed**: Check that your PDFs are in the correct format and placed in the `data` folder.
- **No responses**: Make sure your documents contain relevant information to the questions being asked.

## License

[Ali Haider Syed]

## Acknowledgments


