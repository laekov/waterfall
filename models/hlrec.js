var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Hlrec = new Schema({
    userId: String,
    message: String,
    lifeTime: Number
});
module.exports = mongoose.model('hlrec', Hlrec);
