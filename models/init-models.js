var DataTypes = require("sequelize").DataTypes;
var _asistencia = require("./asistencia");
var _empleados = require("./empleados");
var _horarios = require("./horarios");
var _horasextras = require("./horasextras");
var _incapacidades = require("./incapacidades");
var _permisos = require("./permisos");
var _usuarios = require("./usuarios");

function initModels(sequelize) {
  var asistencia = _asistencia(sequelize, DataTypes);
  var empleados = _empleados(sequelize, DataTypes);
  var horarios = _horarios(sequelize, DataTypes);
  var horasextras = _horasextras(sequelize, DataTypes);
  var incapacidades = _incapacidades(sequelize, DataTypes);
  var permisos = _permisos(sequelize, DataTypes);
  var usuarios = _usuarios(sequelize, DataTypes);

  asistencia.belongsTo(empleados, { as: "id_empleado_empleado", foreignKey: "id_empleado"});
  empleados.hasMany(asistencia, { as: "asistencia", foreignKey: "id_empleado"});
  horasextras.belongsTo(empleados, { as: "id_empleado_empleado", foreignKey: "id_empleado"});
  empleados.hasMany(horasextras, { as: "horasextras", foreignKey: "id_empleado"});
  incapacidades.belongsTo(empleados, { as: "id_empleado_empleado", foreignKey: "id_empleado"});
  empleados.hasMany(incapacidades, { as: "incapacidades", foreignKey: "id_empleado"});
  permisos.belongsTo(empleados, { as: "id_empleado_empleado", foreignKey: "id_empleado"});
  empleados.hasMany(permisos, { as: "permisos", foreignKey: "id_empleado"});
  asistencia.belongsTo(horarios, { as: "id_horario_horario", foreignKey: "id_horario"});
  horarios.hasMany(asistencia, { as: "asistencia", foreignKey: "id_horario"});

  return {
    asistencia,
    empleados,
    horarios,
    horasextras,
    incapacidades,
    permisos,
    usuarios,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
