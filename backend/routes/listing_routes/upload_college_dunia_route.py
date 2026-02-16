from flask import Flask, request, jsonify, Blueprint
from werkzeug.utils import secure_filename
from tasks.listings_task.upload_college_dunia_task import process_college_dunia_task
from utils.storage import get_upload_base_dir
import os

college_dunia_bp = Blueprint('college_dunia_bp', __name__)

@college_dunia_bp.route('/upload/college-dunia-data', methods=['POST'])
def upload_college_dunia_data_route():
    # 'files' matches the HTML form input name or API key
    files = request.files.getlist('files')
    if not files:
        return jsonify({"error": "No files provided"}), 400
        
    UPLOAD_DIR = get_upload_base_dir() / "college_dunia"
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    
    paths = []
    for file in files:
        # Prevent crashes from empty file submissions
        if file.filename == '':
            continue
            
        filename = secure_filename(file.filename) # Fixed variable name
        filepath = UPLOAD_DIR / filename
        file.save(filepath)                       # Fixed variable name
        paths.append(str(filepath))
        
    if not paths:
        return jsonify({"error": "No valid files were uploaded"}), 400
        
    try:
        # Offload the heavy parsing to Celery
        task = process_college_dunia_task.delay(paths)
        return jsonify({"status": "files_accepted", "task_id": task.id}), 202
    except Exception as e:
        return jsonify({"error": str(e)}), 500