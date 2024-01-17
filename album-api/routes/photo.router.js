const express = require('express');
const photoRouter = express.Router();
const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

const upload = require('../file-middleware/multerConfig');
const { Photos } = require('../db-middleware/db_models')
const Op = require('sequelize').Op;
//post
photoRouter.post('/', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.status(500).send({ message: err });
    } else {
      if (req.file == undefined) {
        res.status(400).send({ message: 'No file selected!' });
      } else {
        console.log(req.body.title, req.body.hashtags, req.file.originalname);
        try {
          // Create a new photo record in the database
          const newPhoto = await Photos.create({
            title: req.body.title, // title from the request
            hashtags: req.body.hashtags, //  hashtags are provided in the request
            fileName: req.file.originalname,
            filePath: 'http://localhost:3001/static/' + req.file.filename
          });

          res.status(201).send({
            message: 'File Uploaded!',
            data: newPhoto
          });
        } catch (error) {
          // Handle database errors
          res.status(500).send({ message: 'Database error', error: error });
        }
      }
    }
  });
});

//get all &/or by hastag or title
photoRouter.get('/', async (req, res) => {
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
    let photos;
    if (isFilterApplied) {
      photos = await Photos.findAll({ where: condition });
    } else {
      photos = await Photos.findAll();
    }

    res.json(photos);
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving photos', error: error });
  }
});

//get by id -> image
photoRouter.get('/:id', async (req, res) => {
  try {
    const photo = await Photos.findByPk(req.params.id);
    if (photo) {
      res.json(photo);
    } else {
      res.status(404).send('Photo not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving the photo');
  }
});

photoRouter.delete('/:id', async (req, res) => {
  try {
    const photo = await Photos.findByPk(req.params.id);
    if (photo) {

      const parsedUrl = new URL(photo.filePath);
      const pathname = parsedUrl.pathname;
      const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
      const filePath = 'D:/2 курс/СВП/album-prj/public/uploads/' + filename;
      // Delete the file from the server's file system
      fs.unlink(filePath, async (err) => {
        if (err) {
          throw err;
        }
        // File deleted, now remove the record from the database
        await photo.destroy();
        res.send({ message: 'Photo deleted successfully' });
      });
    } else {
      res.status(404).send('Photo not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting the photo');
  }
});

photoRouter.patch('/:id', async (req, res) => {
  try {
    const { title, hashtags } = req.body;

    const photo = await Photos.findByPk(req.params.id);
    if (!photo) {
      return res.status(404).send('Photo not found');
    }

    // Update fields if they are provided
    if (title !== undefined) photo.title = title;
    if (hashtags !== undefined) photo.hashtags = hashtags;

    await photo.save();
    res.send({message: 'Photo updated successfully'});
  } catch (error) {
    console.error('Error updating photo:', error);
    res.status(500).send('Error updating the photo');
  }
});

module.exports = photoRouter;
