module.exports = function(sequelize, DataTypes) {
  const Assignment = sequelize.define("Assignment", {});

  Assignment.associate = function(models) {
    Assignment.belongsTo(models.ServiceRequest, { foreignKey: { allowNull: false } });
    Assignment.belongsTo(models.HandyMan, { foreignKey: { allowNull: false } });
  };

  return Assignment;
};
