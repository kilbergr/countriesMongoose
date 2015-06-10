	var mongoose = require("mongoose");
	var countrySchema = new mongoose.Schema({
   			name: {type: String, required: true},
    		capital: String,
    		flag: { data: Buffer, contentType: String },
    		pop: Number,
    		cities: Array
			});

	// var imgSchema = new mongoose.Schema({
	// 		flag: { data: Buffer, contentType: String }
	// })
	var Country = mongoose.model("Country", countrySchema);
	// var Img = mongoose.model("Image", imgSchema);

	module.exports = Country;
	// module.exports = Img;