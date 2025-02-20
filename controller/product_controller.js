const Product = require("../models/product_model");
const { uploadTocloudinary } = require("../utils/imagesUploder");
const Subcategory = require("../models/productSubCategory");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const upload = require("../utils/imagesUploder");

exports.createProduct = async (req, resp) => {
  try {
    // console.log('Headers:', req.headers);
    // console.log('Request body:', req.body);
    // console.log('File:', req.file);

    if (!req.file) {
      return resp.status(400).json({ error: "No file uploaded" });
    }

    const { name, title, price, disprice, perceprice, ratings, color, size, size1, offer } = req.body;

    const image = req.file.path;

    const productItem = new Product({
      name,
      title,
      price,
      disprice,
      perceprice,
      ratings,
      color,
      size,
      // size1,
      offer,
      image,
      // Simages
    });
    await productItem.save();
    // console.log(productItem)
    // resp.status(201).json(newItem);

    // const thumbnail = req.files.thumbnail;

    // const userId = req.user.id;

    // if ( !name || !title || !price || !ratings || !color || !size ||!offer || !thumbnail || !SubcategoryId) {
    //   return resp.status(403).json({
    //     success: false,
    //     messages: "all feild is required",
    //   });
    // }

    //   see the category is valid or not

    // const SubCategoryDetails = await Product.findOne({
    //   _id: SubcategoryId,
    // });

    // if (!SubCategoryDetails) {
    //   return resp.status(404).json({
    //     success: false,
    //     messages: "sub category details are not found",
    //   });
    // }

    // upload to cloudinary

    // const images = await uploadTocloudinary(
    //   thumbnail,
    //   process.env.CLOUDINARY_URL,
    //   1000,
    //   1000
    // );

    // const productItem = await Product({
    //   name,
    //   title,
    //   price,
    //   ratings,
    //   color,
    //   size,
    //   offer,
    //   images,
    //   // thumbnail: images.secure_url,
    //   // postedBy: userId,
    //   // subcategory: SubCategoryDetails._id,
    // });

    // add course entry in Category => because us Category ke inside sare course aa jaye

    // await Subcategory.findByIdAndUpdate(
    //   { _id: SubCategoryDetails._id },
    //   {
    //     $push: {
    //       products: product._id,
    //     },
    //   },
    //   { new: true }
    // );
    // await productItem.save();

    // console.log(productItem);
    return resp.status(200).json({
      success: true,
      messages: "successfully created the product",
      productItem,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      success: false,
      message: "internal server error in creating product",
    });
  }
};

exports.getproduct = async (req, resp) => {
  try {
    const allproduct = await Product.find();
    return resp.status(200).json({
      success: true,
      allproduct,
    });
  } catch (error) {
    // console.log(error)
    resp.status(500).json({
      success: false,
      messages: "Internal server error",
    });
  }
};

exports.getProductbyId = async (req, resp) => {
  try {
    const { productId } = req.params;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return resp.status(403).json({
        success: false,
        message: "Please send the product Id",
      });
    }

    const productdetails = await Product.findById({ _id: productId });

    if (!productdetails) {
      return resp.status(404).json({
        success: false,
        message: "unable to find product details this Id",
      });
    }

    return resp.status(200).json({
      success: true,
      message: "Successfully fetch the product Details",
      data: productdetails,
    });
  } catch (error) {
    console.error("Error fetching product details:", error); // Log the error
    resp.status(500).json({
      success: false,
      messages: "Internal server error",
    });
  }
};

exports.updateProduct = async (req, resp) => {
  try {
    const { name, title, price, ratings, color, size, size1, offer } = req.body;

    const image = req.file ? req.file.path : undefined; // Use undefined if no file is uploaded
    
    console.log("before Received data:", { name, title, price, ratings, color, size, size1, offer, image });

    const { productId } = req.params;

    console.log(productId)

    if (!productId) {
      return resp.status(403).json({
        success: false,
        message: "please enter the product Id",
      });
    }
    // check the product id is exits or not

    const productdetails = await Product.findById({ _id: productId });

    if (!productdetails) {
      return resp.status(404).json({
        success: false,
        message: "Unable to find product details with this Id",
      });
    }

    // Logging received data for debugging
    console.log("Received data:", { name, title, price, ratings, color, size, size1, offer, image });

    // if product Id is valid

    if (name) {
      productdetails.name = name;
    }

    if (title) {
      productdetails.title = title;
    }

    if (price) {
      productdetails.price = price;
    }
    if (ratings) {
      productdetails.ratings = ratings;
    }
    if (size) {
      productdetails.size = size;
    }
    if (size1) { 
      productdetails.size1 = size1;
    }
    if (color) {
      productdetails.color = color;
    }
    if (offer) {
      productdetails.offer = offer;
    }
    if (image) {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(image);

      console.log("Cloudinary upload result:", result);

      // Update productdetails with new image URL
      productdetails.image = result.secure_url;
      // productdetails.image = image;
    }

    await productdetails.save();

    console.log("Updated product details:", productdetails);

    return resp.status(200).json({
      success: true,
      message: "successfully update the product",
      productdetails: productdetails, // Include the updated product details in the response
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

exports.deleteProduct = async (req, resp) => {
  try {
    const {productId} = req.params;

    if (!productId) {
      return resp.status(403).json({
        success:false,
        message:"Please the enter the product Id"
      })
    }

    // delete the product 
    const productdetails = await Product.findById({_id:productId})

   await Product.findByIdAndDelete({_id: productId})

   return resp.status(200).json({
    success:true,
    message:"product deleted successfully",
    productdetails
   })

  } catch (error) {
    console.log(error);
    resp.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};