from flask import Flask
from flask_cors import CORS
from models import db
import os
from dotenv import load_dotenv
from controllers import create_ticket, get_tickets, get_ticket, respond_to_ticket, update_ticket_status

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
def create_ticket_route():
    return create_ticket()

@app.route('/api/tickets', methods=['GET'])
def get_tickets_route():
    return get_tickets()

@app.route('/api/tickets/<int:ticket_id>', methods=['GET'])
def get_ticket_route(ticket_id):
    return get_ticket(ticket_id)

@app.route('/api/tickets/<int:ticket_id>/respond', methods=['POST'])
def respond_to_ticket_route(ticket_id):
    return respond_to_ticket(ticket_id)

@app.route('/api/tickets/<int:ticket_id>/status', methods=['PUT'])
def update_ticket_status_route(ticket_id):
    return update_ticket_status(ticket_id)

if __name__ == '__main__':
    app.run(debug=True)