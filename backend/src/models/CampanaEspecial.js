'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CampanaEspecial extends Model {
    static associate(models) {
      // Relaciones futuras si se necesitan
    }
  }
  CampanaEspecial.init({
    fecha: {
      type: DataTypes.STRING,
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    icono: DataTypes.STRING,
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Próximamente'
    }
  }, {
    sequelize,
    modelName: 'CampanaEspecial',
    tableName: 'campanas_especiales',
    timestamps: true
  });
  return CampanaEspecial;
};