module.exports = function(sequelize, DataTypes) {
  const ServiceRequest = sequelize.define("ServiceRequest", {
    status: DataTypes.STRING,
    streetAddress: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zipCode: DataTypes.STRING,
    startTime: DataTypes.DATE,
    endTime: DataTypes.DATE
  });

  ServiceRequest.associate = function(models) {
    ServiceRequest.belongsTo(models.Customer, { foreignKey: { allowNull: false } });
    ServiceRequest.belongsTo(models.ServiceMenu, { allowNull: false });
    ServiceRequest.hasMany(models.Assignment, { onDelete: "CASCADE" });
    ServiceRequest.belongsToMany(models.HandyMan, { through: models.Assignment });
  };

  return ServiceRequest;
};
