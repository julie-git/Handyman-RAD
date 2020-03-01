module.exports = function(sequelize, DataTypes) {
  const ServiceMenu = sequelize.define("ServiceMenu", {
    title: DataTypes.STRING,
    manHour: DataTypes.INTEGER,
    numberOfHandyman: { type: DataTypes.INTEGER, defaultValue: 1 }
  });

  ServiceMenu.associate = function(models) {
    ServiceMenu.hasMany(models.ServiceRequest, { onDelete: "CASCADE" });
  };

  return ServiceMenu;
};
