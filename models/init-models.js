var DataTypes = require("sequelize").DataTypes;
var _asistencia = require("./asistencia");
var _empleados = require("./empleados");
var _horarios = require("./horarios");
var _horasextras = require("./horasextras");
var _incapacidades = require("./incapacidades");
var _permisos = require("./permisos");
var _usuarios = require("./usuarios");
var _nominas = require("./nominas");
var _deducciones = require("./deducciones");
var _empleado_deducciones = require("./empleado_deducciones");

function initModels(sequelize) {
  var asistencia = _asistencia(sequelize, DataTypes);
  var empleados = _empleados(sequelize, DataTypes);
  var horarios = _horarios(sequelize, DataTypes);
  var horasextras = _horasextras(sequelize, DataTypes);
  var incapacidades = _incapacidades(sequelize, DataTypes);
  var permisos = _permisos(sequelize, DataTypes);
  var usuarios = _usuarios(sequelize, DataTypes);
  var nominas = _nominas(sequelize, DataTypes);
  var deducciones = _deducciones(sequelize, DataTypes);
  var empleado_deducciones = _empleado_deducciones(sequelize, DataTypes);

  asistencia.belongsTo(empleados, { as: "empleado", foreignKey: "id_empleado"});
  empleados.hasMany(asistencia, { as: "asistencia", foreignKey: "id_empleado"});
  horasextras.belongsTo(empleados, { as: "empleado", foreignKey: "id_empleado"});
  empleados.hasMany(horasextras, { as: "horasextras", foreignKey: "id_empleado"});
  incapacidades.belongsTo(empleados, { as: "empleado", foreignKey: "id_empleado"});
  empleados.hasMany(incapacidades, { as: "incapacidades", foreignKey: "id_empleado"});
  permisos.belongsTo(empleados, { as: "empleado", foreignKey: "id_empleado"});
  empleados.hasMany(permisos, { as: "permisos", foreignKey: "id_empleado"});
  nominas.belongsTo(empleados, { as: "empleado", foreignKey: "id_empleado"});
  empleados.hasMany(nominas, { as: "nominas", foreignKey: "id_empleado"});
  empleados.belongsTo(horarios, {as: "horario", foreignKey: "id_horario"});
  horarios.hasMany(empleados, {as: "empleados", foreignKey: "id_horario"});
  empleados.hasOne(usuarios, { as: "usuario", foreignKey: "id_empleado"});
  usuarios.belongsTo(empleados, { as: "empleado", foreignKey: "id_empleado"});

  // Nuevas relaciones para deducciones
  empleado_deducciones.belongsTo(empleados, { as: "empleado", foreignKey: "id_empleado"});
  empleados.hasMany(empleado_deducciones, { as: "deducciones", foreignKey: "id_empleado"});
  
  empleado_deducciones.belongsTo(deducciones, { as: "deduccion", foreignKey: "id_deduccion"});
  deducciones.hasMany(empleado_deducciones, { as: "empleados", foreignKey: "id_deduccion"});

  return {
    asistencia,
    empleados,
    horarios,
    horasextras,
    incapacidades,
    permisos,
    usuarios,
    nominas,
    deducciones,
    empleado_deducciones
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
