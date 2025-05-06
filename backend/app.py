from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True,
        "max_age": 3600
    }
})

@app.route('/api/evaluate-loan', methods=['POST', 'OPTIONS'])
def evaluate_loan():
    if request.method == 'OPTIONS':
        return '', 200
        
    data = request.json
    requested_amount = float(data.get('requestedAmount', 0))
    
    if requested_amount > 50000:
        decision = "Declined"
    elif requested_amount == 50000:
        decision = "Undecided"
    else:
        decision = "Approved"
    
    response = jsonify({
        'decision': decision,
        'requestedAmount': requested_amount
    })
    
    return response

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 