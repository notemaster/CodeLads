let mongoose = require('mongoose');

//User Schema
let userSchema= mongoose.Schema({
    name:{
	type: String,
	required: true
    },
    username:{
	type: String,
	required: true
    },
    password:{
	type: String,
	required: true
    },
    projects:{
	type: [String],
	required: true
    }

});

let User = module.exports = mongoose.model('User', userSchema);