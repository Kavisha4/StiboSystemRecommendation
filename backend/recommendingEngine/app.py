import os
import xml.etree.ElementTree as ET
import pandas as pd
from flask import Flask, request, jsonify, send_file

app = Flask(__name__)

UPLOAD_FOLDER = "./uploads"
PROCESSED_FOLDER = "./processed"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Server is running!"})

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    file.save(f"./{file.filename}")  # Save the file in the current directory
    return jsonify({"message": "File uploaded successfully!"})


@app.route("/process", methods=["POST"])
def process_file():
    """Parses XML, extracts data, applies Apriori, and generates CSV"""
    try:
        file_name = request.json.get("file_name")
        if not file_name:
            return jsonify({"error": "No file name provided"}), 400

        file_path = os.path.join(UPLOAD_FOLDER, file_name)

        if not os.path.exists(file_path):
            return jsonify({"error": "File not found"}), 404

        # Parse XML
        tree = ET.parse(file_path)
        root = tree.getroot()

        # Extract product categories
        product_data = []
        for product in root.findall(".//Product"):
            product_id = product.get("ID")
            name = product.find("Name").text if product.find("Name") is not None else "Unknown"
            category = product.get("ParentID", "Unknown Category")

            product_data.append({"ProductID": product_id, "ProductName": name, "Category": category})

        # Convert to DataFrame
        df = pd.DataFrame(product_data)

        # Dummy Apriori Algorithm (For now, we just group by category)
        grouped = df.groupby("Category")["ProductName"].apply(list).reset_index()

        # Save as CSV
        output_csv = os.path.join(PROCESSED_FOLDER, "recommendations.csv")
        grouped.to_csv(output_csv, index=False)

        return jsonify({"message": "Processing complete!", "csv_file": output_csv})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/download", methods=["GET"])
def download_csv():
    """Allows frontend to download the generated CSV"""
    csv_path = os.path.join(PROCESSED_FOLDER, "recommendations.csv")
    
    if not os.path.exists(csv_path):
        return jsonify({"error": "CSV file not found"}), 404

    return send_file(csv_path, as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True)
