import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

import multer from "multer";
const upload = multer({ dest: "uploads/" });

// Cloudnary Configuration
cloudinary.config({
  cloud_name: "dfm5drdiq",
  api_key: "561865982876746",
  api_secret: "zSNBt0-br5BbsABpIAZWTzCC-D0",
});

// app Configuration
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// DB connection
try {
  mongoose.connect(
    "mongodb+srv://Officialashishrijal:yTc7iuvaytrLHbFB@cluster0.x086gn3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
  console.log("✅MongoDB connected successfully");
} catch (error) {
  console.log("❌MongoDB connection error:", error);
}

app.get("/", (req, res) => {
  res.send("Hello from jewelty backend");
});

// category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
});

// Banner Schema
const bannerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
});

// Banner Table
const BannerTable = mongoose.model("BannerTable", bannerSchema);

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  previousPrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  rating: { type: Number, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CategoryTable",
    required: true,
  },

  imageUrl: { type: String, required: true },
});

// product Table
const ProductTable = mongoose.model("ProductTable", productSchema);

// Category Table
const CategoryTable = mongoose.model("CategoryTable", categorySchema);

// category Routes
// create
app.post("/api/category", upload.single("imageUrl"), async (req, res) => {
  try {
    const categoryAlreadyExist = await CategoryTable.findOne({
      name: req.body.name,
    });
    if (categoryAlreadyExist) {
      return res.status(409).json({
        success: false,
        data: null,
        msg: "Name Already exist",
      });
    }
    console.log(req.file);

    // Image Upload Functionality
    const uploadResult = await cloudinary.uploader
      .upload(req.file.path)

      .catch((error) => {
        return res.status(500).json({
          success: false,
          data: null,
          msg: "Image Upload failed",
          error: error,
        });
      });

    console.log(uploadResult.secure_url);

    const newlyCreatedCategory = await CategoryTable.create({
      ...req.body,
      imageUrl: uploadResult.secure_url,
    });
    return res.status(201).json({
      success: true,
      data: newlyCreatedCategory,
      msg: "Category created succesfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "something went wrong",
      data: null,
      error: error,
    });
  }
});

// get all
app.get("/api/category", async (req, res) => {
  try {
    const allCategories = await CategoryTable.find();
    return res.status(200).json({
      success: true,
      data: allCategories,
      mas: "Get All Categories Success",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "something went wrong",
      data: null,
      error: error,
    });
  }
});

// get single
app.get("/api/category/:id", async (req, res) => {
  try {
    const singleCategory = await CategoryTable.findById(req.params.id);
    return res.status(200).json({
      success: true,
      data: singleCategory,
      msg: "Get single category success",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "something went wrong",
      data: null,
      error: error,
    });
  }
});

// Update
app.patch("/api/category/:id", upload.single("imageUrl"), async (req, res) => {
  try {
    if (req.file) {
      // Image Upload Functionality
      const uploadResult = await cloudinary.uploader
        .upload(req.file.path)

        .catch((error) => {
          return res.status(500).json({
            success: false,
            data: null,
            msg: "Image Upload failed",
            error: error,
          });
        });

      const uddateCategory = await CategoryTable.findByIdAndUpdate(
        req.params.id,
        { ...req.body, imageUrl: uploadResult.secure_url },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        data: uddateCategory,
        msg: "Category updated successfully",
      });
    }

    const uddateCategory = await CategoryTable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(200).json({
      success: true,
      data: uddateCategory,
      msg: "Category updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "something went wrong",
      data: null,
      error: error,
    });
  }
});

// Delete
app.delete("/api/category/:id", async (req, res) => {
  try {
    const deleteCategory = await CategoryTable.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      data: deleteCategory,
      msg: "Category Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "something went wrong",
      data: null,
      error: error,
    });
  }
});

// Banner Route

// create
app.post("/api/banner", upload.single("imageUrl"), async (req, res) => {
  try {
    // Image Upload Functionality
    const uploadResult = await cloudinary.uploader
      .upload(req.file.path)

      .catch((error) => {
        return res.status(500).json({
          success: false,
          data: null,
          msg: "Image Upload failed",
          error: error,
        });
      });

    const newlyCreatedBanner = await BannerTable.create({
      name: "summer sale banner",
      imageUrl: uploadResult.secure_url,
    });
    return res.status(201).json({
      success: true,
      data: newlyCreatedBanner,
      msg: "Banner created succesfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "something went wrong",
      data: null,
      error: error,
    });
  }
});

// get all
app.get("/api/banner", async (req, res) => {
  try {
    const allBanner = await BannerTable.find();
    return res.status(200).json({
      success: true,
      data: allBanner,
      mas: "Get All banners Success",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "something went wrong",
      data: null,
      error: error,
    });
  }
});

// get single
app.get("/api/banner/:id", async (req, res) => {
  try {
    const singleBanner = await BannerTable.findById(req.params.id);
    return res.status(200).json({
      success: true,
      data: singleBanner,
      msg: "Get single banner success",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "something went wrong",
      data: null,
      error: error,
    });
  }
});

// Update
app.patch("/api/banner/:id", async (req, res) => {});

// Delete
app.delete("/api/banner/:id", async (req, res) => {
  try {
    const deleteBanner = await BannerTable.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      data: deleteBanner,
      msg: "banner Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "something went wrong",
      data: null,
      error: error,
    });
  }
});

// Product Routes

// create prosuct
app.post("/api/products", upload.single("imageUrl"), async (req, res) => {
  console.log(req.file);

  try {
    const productAlreadyExist = await ProductTable.findOne({
      name: req.body.name,
    });
    if (productAlreadyExist) {
      return res.status(409).json({
        success: false,
        msg: "Name already exist",
        data: null,
      });
    }

    const uploadResult = await cloudinary.uploader
      .upload(req.file.path)

      .catch((error) => {
        return res.status(500).json({
          success: false,
          data: null,
          msg: "Image Upload failed",
          error: error,
        });
      });

    const newlyCreatedProduct = await ProductTable.create({
      ...req.body,
      imageUrl: uploadResult.secure_url,
    });
    return res.status(201).json({
      success: true,
      msg: "Product created successfully",
      data: newlyCreatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
      data: null,
      error: error,
    });
  }
});

// Get All Products
app.get("/api/products", async (req, res) => {
  try {
    const allProducts = await ProductTable.find();
    return res.status(200).json({
      success: true,
      msg: "Fetch all products successfully",
      data: allProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
      data: null,
      error: error,
    });
  }
});

// Get Single Products
app.get("/api/products/:id", async (req, res) => {
  try {
    const singleProduct = await ProductTable.findById(req.params.id);
    if (!singleProduct) {
      return res.status(404).json({
        success: false,
        msg: "Not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Fetch single product successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
      data: null,
      error: error,
    });
  }
});

// Update Products
app.patch("/api/products/:id", upload.single("imageUrl"), async (req, res) => {
  try {
    // if user upload new Image
    if (req.file) {
      const uploadResult = await cloudinary.uploader
        .upload(req.file.path)
        .catch((error) => {
          return res.status(500).json({
            success: false,
            msg: "Image upload failed",
            data: null,
            error,
          });
        });
      const updatedProduct = await ProductTable.findByIdAndUpdate(
        req.params.id,
        { ...req.body, imageUrl: uploadResult.secure_url }
      );

      return res.status(200).json({
        success: true,
        msg: "Product updated successfully",
        data: updatedProduct,
      });
    }

    // if user not upload new image
    const updatedProduct = await ProductTable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(200).json({
      success: true,
      msg: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
      data: null,
      error: error,
    });
  }
});

// Delete Products
app.delete("/api/products/:id", async (req, res) => {
  try {
    const deleteProduct = await ProductTable.findByIdAndUpdate(req.params.id);

    if (!deleteProduct) {
      return res.status(404).json({
        success: false,
        msg: "Not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Delete product successfully",
      data: deleteProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
      data: null,
      error: error,
    });
  }
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
