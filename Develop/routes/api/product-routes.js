const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

router.get('/', (req, res) => {
   try {
     const products = await Product.findAll({
       include: [{model: Category}, {model: Tag}],
     });

     res.status(200).json(products);
   } catch (err) {
     res.status(500).json(err)
   }
});

// get one product
router.get('/:id', (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{model: Category}, {model: Tag}],
    });
    if (!product) {
      res.status(404).json({message: 'No such product.'})
      return;
    } res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', (req, res) => {
  Product.create(
    {
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
      tagIds: req.body.tag_id
    })
    .then((product) => {
      // pairings
      if (req.body.tagIds.length) {
        const productTagId = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagId);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagId) => res.status(200).json(productTagId))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', async (req, res) => {
  // update product data
  await Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagId = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newTags = req.body.tagIds
        .filter((tag_id) => !productTagId.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const removeTags = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: removeTags } }),
        ProductTag.bulkCreate(newTags),
      ]);
    })
    .then((updatedTags) => res.json(updatedTags))
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete product by id
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!productData) {
      res.status(404).json({ message: 'No such product.' });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }

});
module.exports = router;
