module.exports = function(sequelize, DataTypes) {
  const HandyMan = sequelize.define("HandyMan", {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    streetAddress: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zipCode: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING
  });

  HandyMan.associate = function(models) {
    HandyMan.belongsTo(models.User, { foreignKey: { allowNull: false } });
    HandyMan.hasMany(models.Assignment, { onDelete: "CASCADE" });
    HandyMan.belongsToMany(models.ServiceRequest, { through: models.Assignment });
  };

  return HandyMan;
};
