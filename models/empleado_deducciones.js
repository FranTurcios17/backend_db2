module.exports = function(sequelize, DataTypes) {
  return sequelize.define('empleado_deducciones', {
    id_empleado_deduccion: {
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
    id_deduccion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'deducciones',
        key: 'id_deduccion'
      }
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'empleado_deducciones',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "id_empleado_deduccion" }]
      },
      {
        name: "id_empleado",
        using: "BTREE",
        fields: [{ name: "id_empleado" }]
      },
      {
        name: "id_deduccion",
        using: "BTREE",
        fields: [{ name: "id_deduccion" }]
      }
    ]
  });
};