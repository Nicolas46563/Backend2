const Cart = require('../../models/Cart');

class TicketDAO {
  async create(ticketData) {
    return await Ticket.create(ticketData);
  }

  async getById(id) {
    return await Ticket.findById(id);
  }

  async getByCode(code) {
    return await Ticket.findOne({ code });
  }
}

module.exports = new TicketDAO();
