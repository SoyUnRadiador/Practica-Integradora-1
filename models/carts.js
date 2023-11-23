const mongoose = require('mongoose');
const express = require('express');

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ],
  // Otros campos necesarios para el carrito...
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
