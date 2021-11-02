const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  try {
    const tagInfo = await Tag.findAll({
      include: [{model: Product}],
    });
    res.status(200).json(tagInfo);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', (req, res) => {
  try {
    const tagInfo = await Tag.findByPk({
      include: [{model: Product}],
    });
    if (!tagInfo){
      res.status(404).json({message: 'no such id'});
      return;
    }
    res.status(200).json(tagInfo);
  }catch (err) {
    res.status(500).json(err);
  }
});
// create a new tag
router.post('/', async (req, res) => {
  try {
    const tagInfo = await Tag.create(req.body);
    res.status(200).json(tagInfo);
  } catch (err) {
    res.status(400).json(err);
  }
});
// update tag by value
router.put('/:id', async (req, res) => {
  try {
    const tagInfo = await Tag.update(
      {
        tag_name: req.body.tag_name,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (!tagInfo) {
      res.status(404).json({ message: 'No Tag found with that id!' });
      return;
    }

    res.status(200).json(tagInfo);
  } catch (err) {
    res.status(500).json(err);
  }

});
// delete by tag id
router.delete('/:id', async (req, res) => {
  try {
    const tagInfo = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!tagInfo) {
      res.status(404).json({ message: 'No Tag found with that id!' });
      return;
    }

    res.status(200).json(tagInfo);
  } catch (err) {
    res.status(500).json(err);
  }

});
module.exports = router;
