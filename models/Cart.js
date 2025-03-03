const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true, min: 1 }
    }
  ]
});

// ✅ Verifica si el modelo ya está definido antes de crearlo
module.exports = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
