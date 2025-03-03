class CartDTO {
    constructor(cart) {
      this.id = cart._id;
      this.products = cart.products.map(p => ({
        id: p.product._id,
        title: p.product.title,
        price: p.product.price,
        quantity: p.quantity
      }));
    }
  }
  
  module.exports = CartDTO;
  