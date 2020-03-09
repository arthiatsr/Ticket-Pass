module.exports = function(sequelize, DataTypes) {

    const FaceValue = sequelize.define("FaceValue", {
      
        section_number: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        row_number: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: false
        }

    }, {
        // don't add s to table name
        freezeTableName: true,
        // don't add updatedAt and createdAt columns
        timestamps: false
    });
    return FaceValue;
  };
  