module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define("User", {
    username: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false }
  });

  User.associate = function(models) {
    User.hasOne(models.Customer, { onDelete: "CASCADE" });
    User.hasOne(models.HandyMan, { onDelete: "CASCADE" });
  };

  return User;
};
