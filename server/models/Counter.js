const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g., 'userId'
  seq: { type: Number, default: 0 }
});
const CounterModel = mongoose.model('Counter', CounterSchema);
module.exports = CounterModel;