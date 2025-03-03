const Cart = require('../../models/Cart');

class CartDAO {
  async getById(id) {
    return await Cart.findById(id).populate('products.product');
  }

  async create(cartData) {
    return await Cart.create(cartData);
  }

  async update(id, updateData) {
    return await Cart.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await Cart.findByIdAndDelete(id);
  }
}

module.exports = new CartDAO();
