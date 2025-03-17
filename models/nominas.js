const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('nominas', {
    id_nomina: {
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
    periodo: {
      type: DataTypes.STRING(7),
      allowNull: false
    },
    bonificaciones: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0.00
    },
    horas_extra: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0.00
    },
    salario_bruto: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    salario_neto: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    deduccion_rap: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0.00
    },
    deduccion_ihss: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0.00
    },
    fecha_generacion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_DATE')
    }
  }, {
    sequelize,
    tableName: 'nominas',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_nomina" },
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