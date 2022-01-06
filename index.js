const {
  Pool
} = require('pg');

const {
  Client
} = require('pg');

const config = {
  user: "postgres",
  host: "localhost",
  password: "qwer1234",
  database: "estudiantes",
  port: "5432",
  max: 20,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 2000
}

const argumentos = process.argv.slice(2)
const metodo = argumentos[0]

const pool = new Pool(config)


const generarQuery = (name, text, values) => {
  return {
    rowMode: 'array',
    name,
    text,
    values
  }
}

const ingresar = async () => {

  pool.connect(async (error_conexion, client, realese) => {
    if (error_conexion) {
      return console.log("Error de conexión: ", error_conexion.code)
    }

    const nombre = argumentos[1]
    const rut = argumentos[2]
    const curso = argumentos[3]
    const nivel = parseInt(argumentos[4])

    const sqlQuery = "insert into estudiantes (nombre, rut, curso, nivel) values ($1, $2, $3, $4) RETURNING *;"
    const values = [nombre, rut, curso, nivel]

    try {
      const res = await client.query(generarQuery('ingresar', sqlQuery, values))
      console.log(`Estudiante ${nombre} agregado con éxito`)
    } catch (error_consulta) {
      console.log("Error en la consulta: ", error_consulta.code);
    }

    realese()

    pool.end()


  })

}

const consultaRut = async () => {

  pool.connect(async (error_conexion, client, realese) => {
    if (error_conexion) {
      return console.log("Error de conexión: ", error_conexion.code)
    }

    const rut = argumentos[1]
    const sqlQuery = 'select * from estudiantes where rut=$1'
    const values = [rut]

    try {
      const res = await client.query(generarQuery('consultaRut', sqlQuery, values))
      console.log(res.rows)
    } catch (error_consulta) {
      console.log("Error en la consulta: ", error_consulta.code);
    }

    realese()

    pool.end()

  })
}

const consulta = async () => {
  pool.connect(async (error_conexion, client, realese) => {
    if (error_conexion) {
      return console.log("Error de conexión: ", error_conexion.code)
    }

    const sqlQuery = 'select * from estudiantes'

    const queryConsulta = {
      name: "consulta",
      text: "select * from estudiantes"
    }

    try {
      const res = await client.query(queryConsulta)
      console.log(res.rows)
    } catch (error_consulta) {
      console.log("Error en la consulta: ", error_consulta.code);
    }

    realese()

    pool.end()

  })
}

const editar = async () => {
  pool.connect(async (error_conexion, client, realese) => {
    if (error_conexion) {
      return console.log("Error de conexión: ", error_conexion.code)
    }

    const nombre = argumentos[1]
    const rut = argumentos[2]
    const curso = argumentos[3]
    const nivel = parseInt(argumentos[4])

    const sqlQuery = "update estudiantes set nombre=$1, rut=$2, curso=$3, nivel=$4 where rut=$2 RETURNING *;"
    const values = [nombre, rut, curso, nivel]

    try {
      const res = await client.query(generarQuery('editar', sqlQuery, values))
      console.log('Estudiante editado con éxito.')
    } catch (error_consulta) {
      console.log("Error en la consulta: ", error_consulta.code);
    }

    realese()

    pool.end()

  })
}

const eliminar = async () => {
  pool.connect(async (error_conexion, client, realese) => {
    if (error_conexion) {
      return console.log("Error de conexión: ", error_conexion.code)
    }

    const rut = argumentos[1]

    const sqlQuery = "delete from estudiantes where rut=$1"
    const values = [rut]

    try {
      const res = await client.query(generarQuery('eliminar', sqlQuery, values))
      console.log(`Regstro de estudiante con rut ${rut} eliminado.`)
    } catch (error_consulta) {
      console.log("Error en la consulta: ", error_consulta.code);
    }

    realese()

    pool.end()
  })
}

if (metodo === 'nuevo') {
  ingresar()
} else if (metodo === 'rut') {
  consultaRut()
} else if (metodo === 'consulta') {
  consulta()
} else if (metodo === 'editar') {
  editar()
} else if (metodo === 'eliminar') {
  eliminar()
}