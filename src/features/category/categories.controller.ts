import { categoryModel } from "./categories.model";

export const getcategory = async (req, res) => {
  try {
    const category = await categoryModel
      .findOne({ slug: req.params.slug })
      .select({ _id: false, __v: false })
      .lean();
    res.status(200).send({
      msz: "category found successfully",
      category,
    });
    if (!category) {
      res.status(404).send({ msz: "category not found" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({
      msz: "Interval server error",
    });
  }
};

export const getAllcategory = async (req, res) => {
  try {
    const category = await categoryModel
      .find({})
      .select({ _id: false, __v: false })
      .lean();
    res.send({
      msz: "All category found successfully",
      category,
    });
    if (!category) {
      res.status(404).send({ msz: "category not found" });
    }
    console.log(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({
      msz: "Interval server error",
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;
    const category = await categoryModel.create({ name, slug });
    res.send({ category });
  } catch (error) {
    console.error(error.message);
    if ((error.code = "11000")) {
      res.send({
        msz: "Duplicate key error",
      });
      return;
    }
    res.status(500).send({
      msz: "Interval server error",
    });
  }
};

export const renameCategory = async (req, res) => {
  try {
    const category = await categoryModel
      .findOneAndUpdate(
        { slug: req.params.slug },
        { $set: req.body },
        { new: true }
      )
      .select({ _id: false, __v: false })
      .lean();
    if (!category) {
      res.status(404).send({ msz: "category not found" });
    }
    res.status(200).send({
      msz: "All category found successfully",
      category,
    });

    console.log(category);
  } catch (error) {
    console.error(error.message);
    if ((error.code = "11000")) {
      res.send({
        msz: "Duplicate key error",
      });
      return;
    }
    res.status(500).send({
      msz: "Interval server error",
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const deleteCategory = await categoryModel.findOneAndDelete({
      slug: req.params.slug,
    });
    if (!deleteCategory) {
      return res.status(404).send({ msz: "category not found" });
    }
    res.status(200).send({
      msz: "Category deleted  successfully",
      deleteCategory,
    });
 
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      msz: "Interval server error",
    });
  }
};
