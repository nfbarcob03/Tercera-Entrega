//npm i bcrypt oara encriptar contraseñas
//npm i express-session manejar datos en sesion

const express= require('express');
const app = express();
const path= require('path');
const hbs=require('hbs');
const Usuario=require('./../models/estudiante');
const Asignatura=require('./../models/asignatura');
const bcrypt = require('bcrypt');
const session = require('express-session');
var salt = bcrypt.genSaltSync(10);
// Estudiante= require('./../models/estudiante');

//Para encriptar contraseña
//const bcrypt = require('bcrypt');
//const saltRounds = 10;


const dirViews = path.join(__dirname, '../../templates/views')
const dirPartials = path.join(__dirname, '../../templates/partials')
//var salt = bcrypt.genSaltSync(saltRounds);

require('./../helpers/helpers');


hbs.registerPartials(dirPartials)
app.set('views', dirViews)
app.set('view engine', 'hbs');


//------------Inicio
app.get('/',(req,res)=>{
	res.render('index',{
		titulo:'Inicio'
	});
});

app.get('/verusuarios', (req,res)=>{
	Usuario.find({}).exec((err,respuesta)=>{
		if(err){
			return console.log(err)
		}
		res.render('verusuarios',{
			listado:respuesta
		})
	})
})

app.post('/eliminarEstudiante', (req, res)=>{
	let identificacion=req.body.identificacion;
	let estudiante=req.body.nombre;
	let email=req.body.email;
	let telefono=req.body.tel;
	let curso=req.body.curso;
	let est={estudiante:estudiante, identificacion:identificacion.toString(), email:email, telefono:telefono, curso:curso};
	let exito=funciones.eliminarEstudiante(est);
	if(exito){
		res.render('listadoInscritos',{
		titulo:'Se ha eliminado el estudiante con Exito'
	});
	}else{
		res.render('errorCurso',{
		titulo:'Error'
	});
	}
	
})

app.get('/crearCursos', (req, res)=>{
	res.render('crearCursos', {
		titulo:'Cree un nuevo curso de Educacíon Continua '
		})
})

app.post('/ingresar', (req,res)=>{
	Usuario.findOne({nombre:req.body.user}, (err,result)=>{
		if(err){
			return console.log("no se pudo ingrresar a la BD "+ err)
		}
		if(!result){
			return res.render('ingresar',{
			mensaje:"Contraseña o usuario invalidos"
		})
		}
		if(!bcrypt.compareSync(req.body.password, result.password)){
			return res.render('ingresar',{
			mensaje:"Contraseña o usuario invalidos"
		})
		}
		//Se configura las variables de sesion y para identificarla se usa el _id del usuario de la BD
		req.session.usuario=result._id
		req.session.nombre=result.nombre
		req.session.tipo=result.tipo

		//Session, se crea el token (para trabajar con jwt)
		//let token=jwt.sign({
		//	  data: result
		//	}, 'tdea-nfbb', { expiresIn: '1h' });
		//
		//localStorage.setItem('token', token);

		res.render('ingresar',{
			mensaje:"Ingreso correcto. Bienvenido "+ result.nombre,
			session:true,
			nombre:result.nombre
		})
	})
})

app.post('/crearCurso', (req, res)=>{
	let asignatura = new Asignatura({
		nombre:req.body.nombre,
		identificador:parseInt(req.body.identificador),
		descripcion:req.body.descripcion,
		valor:parseInt(req.body.valor),
		modalidad:req.body.modalidad,
		intensidad:req.body.intensidad,
		estado:'abierto'
	})
	
	asignatura.save((err,result)=>{
		if(err){
			console.log('Error al comunicarse con la BD' + err)
			return res.render('error',{
			titulo:'Error BD',
			mensaje:'Error al comunicarse con la BD' + err
			});
		}
		res.render('exitosa', {
			titulo:'Exito!',
			mensaje:'Registro exitoso del curso '+ result.nombre
		});
	});
})

app.get('/actualizarCurso', (req,res)=>{
		res.render('actualizarCurso')
})

app.post('/actualizarCurso', (req,res)=>{
	Asignatura.findOneAndUpdate({nombre:req.body.nombre},req.body,{new:true, runValidators: true, context: 'query'}, (err,result)=>{
		if(err){
			return res.render('error',{
			mensaje:"Error, " + err.message,
			titulo:"Error"
			})
		}
		if(!result){
			return res.render('actualizarCurso',{
			nombre:"No se ha encontrado ningun estudiante con ese nombre " + err
		})
		}
		res.render('actualizarCurso',{
			nombre:result.nombre,
			identificador:result.identificador,
			descripcion:result.descripcion,
			valor:result.valor,
			modalidad:result.modalidad,
			intensidad:result.intensidad,
			estado:result.estado
		})
	})
})

app.get('/inscripcion', (req, res)=>{
	res.render('inscripcion', {
		titulo:'Inacribase a un curso de Educación Continua '
		})
})

app.post('/inscribir', (req, res)=>{
	let usuario= new Usuario({
		nombre: req.body.nombre,
		password:bcrypt.hashSync(req.body.password, salt),
		identificacion:req.body.identificacion,
		correo:req.body.email,
		telefono:req.body.telefono,
		tipo:'aspirante'
	})

	usuario.save((err,result)=>{
		if(err){
			console.log('Error al comunicarse con la BD' + err)
			return res.render('error',{
			titulo:'Error BD',
			mensaje:'Error al comunicarse con la BD' + err
			});
		}
		res.render('exitosa', {
		titulo:'Exito!',
		mensaje:'Registro exitoso de '+ result.nombre
		});
	});
});

app.get('/actualizarUsuario', (req,res)=>{
	Usuario.findById(req.session.usuario,(err,user)=>{
		if(err){
			console.log("no se pudo conectar con la BD: "+ err)
			return res.render('error',{
			nombre:"Error, " + err.message,
			titulo:"Error"
			})
		}
		res.render('actualizarUsuario',{
			nombre: user.nombre,
			identificacion:user.identificacion,
			correo:user.correo,
			telefono:user.telefono
		})
	})
})

app.post('/actualizarUsuario', (req,res)=>{
	Usuario.findOneAndUpdate({nombre:req.body.nombre},req.body,{new:true, runValidators: true, context: 'query'}, (err,result)=>{
		if(err){
			return res.render('error',{
			nombre:"Error, " + err.message,
			titulo:"Error"
			})
		}
		if(!result){
			return res.render('actualizarUsuario',{
			nombre:"No se ha encontrado ningun estudiante con ese nombre " + err
		})
		}
		res.render('actualizarUsuario',{
			nombre: result.nombre,
			identificacion:result.identificacion,
			correo:result.email,
			telefono:result.telefono
		})
	})
})

app.post('/eliminarUsuario', (req,res)=>{
	Usuario.findOneAndDelete({nombre:req.body.nombre},req.body, (err,result)=>{
		if(err){
			return console.log(err)
		}
		if(!result){
			return res.render('actualizar',{
			nombre:"No se ha encontrado ningun estudiante con ese nombre"
		})
		}
		res.render('eliminar',{
			nombre:result.nombre
		})
	})
})

app.post('/cambioEstado', (req, res)=>{
	idCurso=req.body.cursoSelect;
	let creacionExitosa=funciones.cambiarCurso(idCurso)
	if (creacionExitosa){
		res.render('listar_cursos',{
		titulo:'Listado de Cursos'
	});
	}else{
  		res.render('errorCurso',{
		titulo:'Error'
	});
	}
	
})

app.get('/verInscriptos', (req,res)=>{
	res.render('listadoInscritos',{
		titulo:'Listado de los Cursos'
	})
})


app.get('/listar_cursos', (req,res)=>{
	Asignatura.find({}).exec((err,respuesta)=>{
		if(err){
			return console.log('Error con la BD: '+ err)
		}
		res.render('listar_cursos',{
		titulo:'Listado de Cursos',
		listado:respuesta
		})
	})
	
})

app.get('/salir',(req,res)=>{
	//-------Cerrar la sesion con variables de session
	req.session.destroy((err)=>{
		if(err) console.log("Error al salir de la sesion "+ err)
	})

	//Cierre session con jwt
	//localStorage.setItem('token','');
	res.redirect('/')
})

app.get('*', (req,res)=>{
	res.render('error',{
		titulo:'Error'
	})
})



module.exports=app;