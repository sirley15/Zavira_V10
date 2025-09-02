import Router from '@adonisjs/core/services/router'
import RegistroController from '../../app/controller/registroController.js'
import EstudiantesController from '../../app/controller/estudiantesController.js'
import InstitucionController from '../../app/controller/institucionController.js'
import Authjwt from '../../app/middleware/authjwt.js'
import KolbController from '../../app/controller/kolbController.js'

// Crear instancias de controladores y middleware
const registro = new RegistroController()
const intitucion = new InstitucionController()
const estudiante = new EstudiantesController()
const authjwt = new Authjwt()
const kolb = new KolbController()


// RUTAS PARA INSTITUCIONES


Router.post('/registrarInstitucion', registro.registrarInstitucion.bind(registro)) 
Router.post('/loginInstitucion', registro.loginInstitucion.bind(registro))         
Router.post('/cambiarContraseñaI', registro.cambiarPasswordInstitucion.bind(registro)) 

Router.get('/perfilInstitucion', registro.perfilInstitucion.bind(registro))
  .use(authjwt.handle.bind(authjwt)) 

Router.get('/listaInstituciones', intitucion.listarInstituciones.bind(registro))


// RUTAS PARA ESTUDIANTES


Router.post('/registrarEstudiante', registro.registrarEstudiante.bind(registro))    
Router.post('/loginEstudiante', registro.loginEstudiante.bind(registro))             
Router.post('/cambiarContraseñaE', registro.cambiarPassword.bind(registro))  

Router.get('/perfilEstudiante', registro.perfilEstudiante.bind(registro))
  .use(authjwt.handle.bind(authjwt)) 

Router.get('/estudiantes/:id_institucion', estudiante.filtrarEstudiantes.bind(registro))

Router.post('/estudianteCSV', estudiante.subirCSV.bind(estudiante))                    
Router.get('/listarPorInstituciones/:id', estudiante.listarPorInstitucion.bind(registro))


// RUTAS DE KOLB (test estilo de aprendizaje)


Router.get('/kolb/preguntas', kolb.listarPreguntas.bind(kolb))

Router.post('/kolb/guardarRespuestas', kolb.guardarRespuestas.bind(kolb))

Router.get('/kolb/obtenerResultado', kolb.obtenerResultado.bind(kolb)).use(authjwt.handle.bind(authjwt))
