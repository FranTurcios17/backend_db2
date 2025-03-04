const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('horarios', {
    id_horario: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    hora_entrada: {
      type: DataTypes.TIME,
      allowNull: false
    },
    hora_salida: {
      type: DataTypes.TIME,
      allowNull: false
    },
    dias_semana: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'horarios',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_horario" },
        ]
      },
    ]
  });
};
