var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Access = new Schema({
    uId: String,
    list: Array,
});
module.exports = mongoose.model('accesslib', Access);
