const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('horasextras', {
    id_hora_extra: {
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
    horas: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false
    },
    motivo: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    aprobado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'horasextras',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_hora_extra" },
        ]
      },
      {
        name: "id_empleado",
        using: "BTREE",
        fields: [
          { name: "id_empleado" },
        ]
      },
    ]
  });
};
