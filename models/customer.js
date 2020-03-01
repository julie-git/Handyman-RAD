module.exports = function(sequelize, DataTypes) {
  const Customer = sequelize.define("Customer", {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    streetAddress: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zipCode: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING
  });

  Customer.associate = function(models) {
    Customer.belongsTo(models.User, { foreignKey: { allowNull: false } });
    Customer.hasMany(models.ServiceRequest, { onDelete: "CASCADE" });
  };

  return Customer;
};
