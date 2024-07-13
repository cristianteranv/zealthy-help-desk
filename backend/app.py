from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Ticket, Response
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
load_dotenv()

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
with app.app_context():
    db.create_all()
    db.session.commit()
    db.engine.dispose()


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

@app.route('/api/tickets/<int:ticket_id>', methods=['GET'])
def get_ticket(ticket_id):
    ticket = Ticket.query.get_or_404(ticket_id)
    responses = Response.query.filter_by(ticket_id=ticket_id).order_by(Response.created_at).all()
    print(ticket)
    return jsonify({
        'ticket': {
            'id': ticket.id,
            'name': ticket.name,
            'email': ticket.email,
            'description': ticket.description,
            'status': ticket.status,
            'created_at': ticket.created_at.isoformat(),
            'updated_at': ticket.updated_at.isoformat()
        },
        'responses': [{
            'id': r.id,
            'message': r.message,
            'created_at': r.created_at.isoformat()
        } for r in responses]
    })

@app.route('/api/tickets/<int:ticket_id>/respond', methods=['POST'])
def respond_to_ticket(ticket_id):
    ticket = Ticket.query.get_or_404(ticket_id)
    data = request.json
    response = Response(ticket_id=ticket_id, message=data['message'])
    print('response message', response.message)
    db.session.add(response)
    ticket.updated_at = db.func.now()
    db.session.commit()
    print(f"Would normally send email here with body: New response for ticket #{ticket_id}")
    return jsonify({"message": "Response added successfully", "id": response.id}), 201

@app.route('/api/tickets/<int:ticket_id>/status', methods=['PUT'])
def update_ticket_status(ticket_id):
    ticket = Ticket.query.get_or_404(ticket_id)
    data = request.json
    ticket.status = data['status']
    ticket.updated_at = db.func.now()
    db.session.commit()
    print(f"Would normally send email here with body: Status updated for ticket #{ticket_id}")
    return jsonify({"message": "Status updated successfully"})


if __name__ == '__main__':
    app.run(debug=True)