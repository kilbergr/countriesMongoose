	var mongoose = require("mongoose");
	//Schema is a class, needed to make a model
	var countrySchema = new mongoose.Schema({
   			name: {type: String, required: true},
    		capital: String,
    		//flag: { data: Buffer, contentType: String },
    		flag: String,
    		pop: Number,
    		cities: Array
			});

//Make a model
	var Country = mongoose.model("Country", countrySchema);

//Export model
	module.exports = Country;
