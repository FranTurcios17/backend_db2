const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('empleados', {
    id_empleado: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    DNI: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    sexo: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "email"
    },
    telefono: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    telefono_emergencia: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    fecha_contratacion: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    salario: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1
    },
    id_horario: {
      type: DataTypes.INTEGER,
      allowNull: false, 
      references: {
        model: 'horarios',
        key: 'id_horario'
      }
    }
  }, {
    sequelize,
    tableName: 'empleados',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_empleado" },
        ]
      },
      {
        name: "email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
    ]
  });
};
