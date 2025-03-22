const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "incapacidades",
    {
      id_incapacidad: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      id_empleado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "empleados",
          key: "id_empleado",
        },
      },
      fecha_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      fecha_fin: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      motivo: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      archivo_adjunto: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      estado: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "incapacidades",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id_incapacidad" }],
        },
        {
          name: "id_empleado",
          using: "BTREE",
          fields: [{ name: "id_empleado" }],
        },
      ],
    }
  );
};
