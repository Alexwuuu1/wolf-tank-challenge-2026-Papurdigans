'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CampanaEspecial extends Model {
    static associate(models) {
      // Si en el futuro necesitas relacionar esta tabla con otra, se pone aquí
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
    icono: {
      type: DataTypes.STRING,
      allowNull: true
    },
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