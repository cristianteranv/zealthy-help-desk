from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Ticket, Response
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)
load_dotenv()

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.route('/api/tickets', methods=['POST'])
def create_ticket():
    data = request.json
    ticket = Ticket(name=data['name'], email=data['email'], description=data['description'])
    db.session.add(ticket)
    db.session.commit()
    print(f"Would normally send email here")
    return jsonify({"message": "Ticket created successfully"}), 201

@app.route('/api/tickets', methods=['GET'])
def get_tickets():
    tickets = Ticket.query.all()
    return jsonify([{
        'id': t.id,
        'name': t.name,
        'email': t.email,
        'description': t.description,
        'status': t.status,
        'created_at': t.created_at,
        'updated_at': t.updated_at
    } for t in tickets])


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)