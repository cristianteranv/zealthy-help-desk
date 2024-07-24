from flask import jsonify, request
from models import db, Ticket, Response

def create_ticket():
  data = request.json
  ticket = Ticket(name=data['name'], email=data['email'], description=data['description'])
  db.session.add(ticket)
  db.session.commit()
  print(f"Would normally send email here")
  return jsonify({"message": "Ticket created successfully"}), 201

def get_tickets():
  page = request.args.get('page', 1, type=int)
  per_page= request.args.get('per_page', 10, type=int)
  pagination = Ticket.query.order_by(Ticket.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)

  tickets = pagination.items
  return jsonify({
    'tickets': [{
      'id': t.id,
      'name': t.name,
      'email': t.email,
      'description': t.description,
      'status': t.status,
      'created_at': t.created_at,
      'updated_at': t.updated_at
    } for t in tickets],
    'total': pagination.total,
    'pages': pagination.pages,
    'current_page': pagination.page,
    })

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

def update_ticket_status(ticket_id):
  ticket = Ticket.query.get_or_404(ticket_id)
  data = request.json
  ticket.status = data['status']
  ticket.updated_at = db.func.now()
  db.session.commit()
  print(f"Would normally send email here with body: Status updated for ticket #{ticket_id}")
  return jsonify({"message": "Status updated successfully"})