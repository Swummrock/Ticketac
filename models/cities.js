var mongoose = require('./connection')

var citySchema = mongoose.Schema({
    name: String,
    lon: Number,
    lat: Number,
})

var cityModel = mongoose.model('cities', citySchema)

module.exports = cityModel;