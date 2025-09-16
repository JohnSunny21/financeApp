from flask import Flask, request , jsonify
from flask_cors import CORS
from ml_service import analyze_spending_patterns



# 1. Initialiaze the Flask App
app = Flask(__name__)

# 2. Enable CORS for all routes, allowing our Spring Boot app to call this API
CORS(app)


# Create a simple "Health Check" endpoint
# This is a standard practice to verify that the service is running.

@app.route('/health', methods=['GET'])
def health_check():

    # jsonify is a Flask helper that converts a Python dict to a JSON response.
    return jsonify({"status": "healthy","message": "ML Service is running!"})



# This defines the "contract" for our API. It will receive a list of transactions.
@app.route('/analyze',methods=['POST'])
def analyze_transactions():

    # Get the JSON data sent from the Spring Boot Application
    transaction_data = request.get_json()

    #----- Basic Validation ---
    if not transaction_data:
        return jsonify({"error": "No data provided"}), 400
    

    # Call the service layer to do all the heavy lifting
    try:
        analysis_results = analyze_spending_patterns(transaction_data)

        # Return the results from the service as a JSON response
        return jsonify(analysis_results)
    except Exception as e:
        # A simple error handler to catch unexpected issues in the ML code
        print(f"An error occured durnig analysis: {e}")
        return jsonify({"error": "An internal error occured during analysis."}), 500

# 5. Make the app runnable
# This block ensures the server only runs when you execute the script directly
if __name__ == "__main__":
    # We'll run on port 5001 to avoid conflicts with React vite (5173) and Spring (8080)
    app.run(port=5001,debug=True)