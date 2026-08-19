const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  klantnaam: {
    type: String,
    required: true
  },
  adres: {
    type: String,
    required: true
  },
  ijsConfiguratie: {
    smaak: { type: String, required: true },
    kleur: { type: String, required: true },
    aantalBollen: { type: Number, required: true, min: 1, max: 5 },
    grootte: { type: Number, required: true, min: 0.8, max: 1.4 }
  },
  totaalprijs: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['te verwerken', 'verzonden', 'geannuleerd'],
    default: 'te verwerken'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
