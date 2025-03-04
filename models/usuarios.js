const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usuarios', {
    id_usuario: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "id_empleado"
    },
    nombre_usuario: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "nombre_usuario"
    },
    'contraseña_hash': {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    rol: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'usuarios',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_usuario" },
        ]
      },
      {
        name: "id_empleado",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_empleado" },
        ]
      },
      {
        name: "nombre_usuario",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "nombre_usuario" },
        ]
      },
    ]
  });
};
