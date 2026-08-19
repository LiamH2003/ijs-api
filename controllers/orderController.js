const mongoose = require('mongoose');
const Order = require('../models/Order');

const PRIJS_PER_BOL = 1.75;

function isGeldigId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

exports.createOrder = async (req, res) => {
  try {
    const { klantnaam, adres, ijsConfiguratie } = req.body;
    const order = new Order({
      klantnaam,
      adres,
      ijsConfiguratie,
      totaalprijs: (ijsConfiguratie?.aantalBollen || 0) * PRIJS_PER_BOL
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    if (!isGeldigId(req.params.id)) {
      return res.status(400).json({ error: 'Ongeldig bestelling-ID' });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Bestelling niet gevonden' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    if (!isGeldigId(req.params.id)) {
      return res.status(400).json({ error: 'Ongeldig bestelling-ID' });
    }
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ error: 'Bestelling niet gevonden' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    if (!isGeldigId(req.params.id)) {
      return res.status(400).json({ error: 'Ongeldig bestelling-ID' });
    }
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'Bestelling niet gevonden' });
    res.json({ message: 'Bestelling verwijderd' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
