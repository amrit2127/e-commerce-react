import ProductModel from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
   

    let images = req?.files?.map((item) => {
      return item.filename;
    });
    const productData = await ProductModel.create({
      name: req.body.name,
      description: req.body.description,
      quantity: req.body.quantity,
      price: req.body.price,
      active: req.body.active,
      images: images,
      department: req.body.departmentId,
    });
    if (productData) res.status(201).send({ message: "Product Created" });
    else res.status(404).send({ message: "Unable to delete department" });
  } catch (e) {
    res.status(404).send({ error: e?.message });
  }
};

export const UpdateProduct = async (req, res) => {
  try {
    let images = req?.files?.map((item) => {
      return item.filename;
    });
    const productData = await ProductModel.findByIdAndUpdate(
      {
        _id: req.body._id,
      },
      {
        name: req.body.name,
        description: req.body.description,
        quantity: req.body.quantity,
        price: req.body.price,
        active: req.body.active,
        images: images,
        department: req.body.departmentId,
      }
    );
    if (productData) res.status(201).send({ message: "Product Updated" });
    else res.status(404).send({ message: "Unable to update Product" });
  } catch (e) {
    res.status(404).send({ error: e?.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productData = await ProductModel.deleteOne({
      _id: req.body._id,
    });
    if (productData.deletedCount == 1)
      res.status(201).send({ message: "Product deleted" });
    else res.status(404).send({ message: "Unable to delete product" });
  } catch (e) {
    res.status(404).send({ error: e?.message });
  }
};

export const ProductDetails = async (req, res) => {
  try {
    const productData = await ProductModel.findOne({
      _id: req.query.id,
    }).populate({
      path: "department",
      populate: [{ path: "university" }],
    });
    res.status(200).send({ productData });
  } catch (e) {
    res.status(404).send({ error: e?.message });
  }
};

export const GetProductsByDepartmentId = async (req, res) => {
  try {
    const productData = await ProductModel.find({
      department: req.query.departmentId,
    }).populate({ path: "department", populate: [{ path: "university" }] });
    res.status(200).send({ productData });
  } catch (e) {
    res.status(404).send({ error: e?.message });
  }
};

export const UpdateProductQty = async (req, res) => {
  try {
    let product = await ProductModel.findOne({ _id: req.body._id });
    let active = true;

    if (product.quantity - req?.body?.quantity <= 0) {
      active = false;
    }

    let productData = await ProductModel.findByIdAndUpdate(
      {
        _id: req.body._id,
      },
      {
        quantity: product?.quantity - req.body.quantity,
        active: active,
      }
    );
    if (productData) res.status(200).send({ message: "product updated" });
    else res.status(400).send({ message: "unable to update product" });
  } catch (e) {
    res.status(404).send({ error: e?.message });
  }
};
