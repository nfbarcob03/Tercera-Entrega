const mongoose =require("mongoose");
//Para ingresos a la BD unicos npm i mongoose-unique-validator
//var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const usuarioSchema =new Schema({
	nombre:{ 
		type:String,
		require:true,
		trim:true  //Evitar errores por espacios al ingresarun string
		//enum:{values:['maria','daniel,'felipe,'juan,'ana']}  es para restringir lps valores que entran
		},
	password:{
		type:String,
		require:true
	},
	identificacion:{
		type:String,
		require:true,
		trim:true
		},
	correo:{
		type:String,
		require:true,
		trim:true
		},
	telefono :{
		type:String,
		require:true,
		trim:true
		},
	tipo:{
		type:String,
		require:true,
		trim:true
	}
});

//Para ingresos a la BD unicos
//usuarioSchema.plugin(uniqueValidator);
const Usuario=mongoose.model('Usuario', usuarioSchema);
module.exports=Usuario;