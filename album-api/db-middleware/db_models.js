const { Sequelize, DataTypes } = require('sequelize');
const { sequelize, initDatabase } = require('./db_instance');

const Photos = sequelize.define('Photos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    uploadDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    hashtags: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fileName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    filePath: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true
});

const Albums = sequelize.define('Albums', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hashtags: {
        type: DataTypes.STRING,
        allowNull: true
    },
    thumbPath: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    freezeTableName: true
});

const AlbumPhotos = sequelize.define('AlbumPhotos', {
    albumId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Albums',
        key: 'id',
      },
      onDelete: 'CASCADE'
    },
    photoId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Photos',
        key: 'id',
      },
      onDelete: 'CASCADE'
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    freezeTableName: true
  });

Albums.belongsToMany(Photos, {
    through: AlbumPhotos,
    foreignKey: 'albumId',
    otherKey: 'photoId',
    onDelete: 'CASCADE' // This is not necessary if you set onDelete: 'CASCADE' in AlbumPhotos model directly
  });
  
  Photos.belongsToMany(Albums, {
    through: AlbumPhotos,
    foreignKey: 'photoId',
    otherKey: 'albumId',
    onDelete: 'CASCADE' // This is not necessary if you set onDelete: 'CASCADE' in AlbumPhotos model directly
  });

module.exports = {
    AlbumPhotos,
    Photos,
    Albums
};