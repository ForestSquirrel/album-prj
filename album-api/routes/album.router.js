const express = require('express');
const albumRouter = express.Router();
const { Sequelize } = require('sequelize');

const { AlbumPhotos, Photos, Albums } = require('../db-middleware/db_models')
const Op = require('sequelize').Op;
//post no need to include photos here 
albumRouter.post('/', async (req, res) => {
    try {
        console.log(req.body);
        const { title, hashtags } = req.body;
        const newAlbum = await Albums.create({
            title,
            hashtags
        });
        res.status(201).send({
            message: 'Album Created!',
            data: newAlbum
        });
    } catch (error) {
        res.status(500).send({ message: 'Database error', error });
    }
});

//get all &/or by hastag or title
albumRouter.get('/', async (req, res) => {
    try {
        const condition = {};
        let isFilterApplied = false;
        if (req.query.hashtag) {
            const hashtags = req.query.hashtag.split(';');
            const hashtagConditions = hashtags.map(tag => ({
                hashtags: { [Op.like]: `%${tag.trim()}%` }
            }));

            if (hashtagConditions.length) {
                condition[Op.and] = hashtagConditions;
                isFilterApplied = true;
            }
        }
        if (req.query.title) {
            condition.title = { [Sequelize.Op.like]: `%${req.query.title}%` };
            console.log("Condition = ", condition.title);
            isFilterApplied = true;
        }
        let albums;
        if (isFilterApplied) {
            albums = await Albums.findAll({ where: condition });
        } else {
            albums = await Albums.findAll();
        }
        res.json(albums);
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving albums', error: error });
    }
});

albumRouter.get('/:id', async (req, res) => {
    try {
        const album = await Albums.findByPk(req.params.id, {
            include: [{
                model: Photos,
                through: {
                    attributes: ['sortOrder'], // Include the order
                    order: [['sortOrder', 'ASC']] // Order by the sortOrder
                }
            }]
        });
        if (album) {
            res.json(album);
        } else {
            res.status(404).send('Album not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving the album');
    }
});

albumRouter.delete('/:id', async (req, res) => {
    try {
        const album = await Albums.findByPk(req.params.id);
        if (album) {
            await album.destroy();
            res.send({ message: 'Album deleted successfully' });
        } else {
            res.status(404).send('Album not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting the album');
    }
});

albumRouter.patch('/:id', async (req, res) => {
    const { title, hashtags, thumbPath, photoIds } = req.body;
    try {
      const album = await Albums.findByPk(req.params.id);
      if (!album) {
        return res.status(404).send('Album not found');
      }
  
      // Update album fields if they are provided
      if (title !== undefined) album.title = title;
      if (hashtags !== undefined) album.hashtags = hashtags;
      if (thumbPath !== undefined) album.thumbPath = thumbPath;
  
      await album.save();
  
      // Update photo associations if photoIds are provided
      if (Array.isArray(photoIds)) {
        // First clear the current associations to avoid conflicts
        await AlbumPhotos.destroy({ where: { albumId: album.id } });
  
        // Associate the new set of photos with the specified order
        const orderedPhotosData = photoIds.map((photoId, index) => {
          return {
            photoId: photoId,
            albumId: album.id,
            sortOrder: index // The index will serve as the order
          };
        });
  
        // Use bulkCreate with updateOnDuplicate to handle ordering
        await AlbumPhotos.bulkCreate(orderedPhotosData, {
          updateOnDuplicate: ['photoId', 'albumId', 'sortOrder']
        });
      }
  
      res.send({ message: 'Album updated successfully' });
    } catch (error) {
      console.error('Error updating album:', error);
      res.status(500).send('Error updating the album');
    }
  });
  

module.exports = albumRouter;
