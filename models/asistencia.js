const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('asistencia', {
    id_asistencia: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'empleados',
        key: 'id_empleado'
      }
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    hora_entrada: {
      type: DataTypes.TIME,
      allowNull: true
    },
    hora_salida: {
      type: DataTypes.TIME,
      allowNull: true
    }
    /*,
    id_horario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'horarios',
        key: 'id_horario'
      }
    }*/
  }, {
    sequelize,
    tableName: 'asistencia',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_asistencia" },
        ]
      },
      {
        name: "id_empleado",
        using: "BTREE",
        fields: [
          { name: "id_empleado" },
        ]
      },/*
      {
        name: "id_horario",
        using: "BTREE",
        fields: [
          { name: "id_horario" },
        ]
      },*/
    ]
  });
};
