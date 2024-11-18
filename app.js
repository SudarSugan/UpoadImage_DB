import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB connection
const uri = process.env.MONGODB_URI;
mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// MongoDB schema for storing image data as BLOB
const productSchema = new mongoose.Schema({
  prd_name: { type: String, required: true },
  prd_price: { type: Number, required: true },
  prd_desc: { type: String, required: true },
  image: {
    type: Buffer, // Store the image as a binary BLOB (Buffer)
    required: true,
  },
  contentType: {
    type: String, // Store the image MIME type, e.g., 'image/png'
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

// Multer configuration to store images in memory (as Buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to handle image upload and store it in MongoDB
app.post("/api/product", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image file is required." });
  }

  const { prd_name, prd_price, prd_desc } = req.body;

  if (!prd_name || !prd_price || !prd_desc) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const parsedPrice = parseFloat(prd_price); // Convert prd_price to a number
  if (isNaN(parsedPrice)) {
    return res.status(400).json({ message: "prd_price must be a valid number." });
  }

  // Create a new product with image data stored as Buffer (BLOB)
  const newProduct = new Product({
    prd_name,
    prd_price: parsedPrice,
    prd_desc,
    image: req.file.buffer, // Store the image as a Buffer (BLOB)
    contentType: req.file.mimetype || "application/octet-stream", // Default MIME type
  });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: "Error creating product", error });
  }
});

// Route to get all products with image data
app.get("/api/product", async (req, res) => {
  try {
    const limit = Number(req.query.limit);
    const products = limit ? await Product.find().limit(limit) : await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", err });
  }
});

// Route to get a product by ID with image data
app.get("/api/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Convert image buffer to base64 string for easy client-side rendering
    const base64Image = product.image.toString("base64");

    res.json({
      ...product.toObject(),
      image: `data:${product.contentType};base64,${base64Image}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
});

// Route to update a product by ID (with image update support)
app.put("/api/product/:id", upload.single("image"), async (req, res) => {
  try {
    const updates = req.body;
    if (req.file) {
      updates.image = req.file.buffer; // Update the image as Buffer (BLOB)
      updates.contentType = req.file.mimetype;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: `Product with ID ${req.params.id} not found` });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
});

// Route to delete a product by ID
app.delete("/api/product/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: `Product with ID ${req.params.id} not found` });
    }

    res.status(200).json({ message: `Product with ID ${req.params.id} deleted` });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});





// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import multer from "multer";
// import path from 'path';
// import { fileURLToPath } from 'url';
// dotenv.config();


// const app = express();
// app.use(express.json());
// app.use(cors()); // Enable CORS for all routes
// app.use(express.urlencoded({ extended: true }));

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// // MongoDB connection
// // const uri = process.env.MONGODB_URI;
// // const uri = 'mongodb://localhost:27017';

// const uri = process.env.MONGODB_URI;
// mongoose
//   .connect(uri)
//   .then(() => {
//     console.log("MongoDB connected");
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err);
//   });
//   const productSchema = new mongoose.Schema({
//     image: {
//       type: Buffer, // Stores binary data for the image
//       required: true,
//     },
//     contentType: {
//       type: String, // Store the image type, e.g., 'image/png'
//       required: true,
//     },
//     uploadedAt: {
//       type: Date,
//       default: Date.now,
//     },
//   });
//   const Product = mongoose.model("Product", productSchema);

// const storage = multer.memoryStorage();
// const upload = multer({ storage });


// // Route to handle image upload
// app.post("/api/posts", upload.single("image"), async (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ message: "Image file is required." });
//     }
//     const newPost = new Product({
//         image: req.file.buffer, // Store the image as a Buffer
//         contentType: req.file.mimetype || req.file.multipart/form-data, // e.g., 'image/png'
//     });
//     try {
//         const savedPost = await newPost.save();
//         res.status(201).json(savedPost);
//     } catch (error) {        
//         res.status(400).json({ message: "Error creating post", error });
//     }
// });


// const singleStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, '/public/uploads')); // Correct upload folder
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now().toString() + path.extname(file.originalname); // Ensure filename is a string
//         console.log(uniqueSuffix);
//         cb(null, uniqueSuffix);
//     },
// });

// const singleUpload = multer({ storage: singleStorage });


// // File upload route
// app.post('/upload', singleUpload.single('file'), async (req, res) => {
// if (req.file) {
//   try {
//     // Create a new file document in MongoDB
//     const file = new File({
//       filename: req.file.filename,
//       path: req.file.path
//     });

//     // Save to MongoDB
//     await file.save();

//     res.json({
//       message: 'File uploaded successfully',
//       filename: req.file.filename,
//       path: req.file.path
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error saving file to database', error });
//   }
// } else {
//   res.status(400).json({ message: 'No file uploaded' });
// }
// });

// app.post("/upload", singleUpload.single("image"), 
// (req, res) => {
//   console.log("Request body:", req.body);
//   console.log("Request file:", req.file);
  
//   console.log("File received by multer:", req.file);
//     if (req.file) {
//         res.status(200).json({
//             message: "File uploaded successfully",
//             filename: req.file.filename,
//             path: path.join(__dirname, 'public', req.file.filename)
//         });
//     } else {
//         res.status(400).json({
//             message: "File upload failed",
//         });
//     }
// });




// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });








// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import multer from "multer";
// import path from "path";
// import fs from "fs";

// dotenv.config();

// const app = express();
// app.use(express.json());
// app.use(cors());
// app.use(express.urlencoded({ extended: true }));

// // MongoDB connection
// const uri = process.env.MONGODB_URI;
// mongoose
//   .connect(uri)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Mongoose schema for storing image data
// const productSchema = new mongoose.Schema({
//   image: {
//     type: Buffer, // Stores binary data for the image
//     required: true,
//   },
//   contentType: {
//     type: String, // Store the image type, e.g., 'image/png'
//     required: true,
//   },
//   uploadedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });
// const Product = mongoose.model("Product", productSchema);

// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Specify the upload folder
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Rename file to avoid conflicts
//   },
// });

// const imageupload = multer({ storage });

// // Route to upload file and save it to MongoDB
// app.post("/uploads", imageupload.single("image"), (req, res) => {
//   console.log("File received by multer:", req.file);
//   if (!req.file) {
//     return res.status(400).json({ message: "File upload failed" });
//   }

//   const { path: filePath, mimetype } = req.file;

//   // Read the file and store it in MongoDB
//   fs.readFile(filePath, async (err, data) => {
//     if (err) {
//       return res.status(500).json({ message: "Error reading file" });
//     }

//     const newProduct = new Product({
//       image: data,
//       contentType: mimetype,
//     });

//     try {
//       await newProduct.save();
//       // Remove the file from server after saving to DB
//       fs.unlinkSync(filePath);
//       res.status(201).json({ message: "File uploaded and saved to database" });
//     } catch (error) {
//       res.status(500).json({ message: "Error saving to database", error });
//     }
//   });
// });

// // Set up server to listen on specified port
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });














// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import multer from "multer";

// dotenv.config();

// const app=express();
// app.use(express.json());
// app.use(cors()); // Enable CORS for all routes

// app.use(express.urlencoded({ extended: true }));

// // MongoDB connection
// const uri = process.env.MONGODB_URI;

// mongoose
//   .connect(uri)
//   .then(() => {
//     console.log("MongoDB connected");
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err);
//   });

//   const productSchema = new mongoose.Schema({
//     image: {
//       type: Buffer, // Stores binary data for the image
//       required: true,
//     },
//     contentType: {
//       type: String, // Store the image type, e.g., 'image/png'
//       required: true,
//     },
//     uploadedAt: {
//       type: Date,
//       default: Date.now,
//     },
//   });
//   const Product = mongoose.model("Product", productSchema);

//   // Create a new post
// app.post("/api/posts", async (req, res) => {
//   const newPost = new Post({
//     image: req.body.image,
    
//   });

//   try {
//     const savedPost = await newPost.save();
//     res.status(201).json(savedPost);
//   } catch (error) {
//     res.status(400).json({ message: "Error creating post", error });
//   }
// });

// const storage = multer.diskStorage({
//     destionation: (req, file, cb) =>{
//       cb (null,"uploads/"); // SPecify upload folder
//     },
//     filename: (req, file, cb)=>{
//       cb(null, Date.now())+ Path.extname(file.originalname); // Rename file to avoid conflicts
//     },
// });
 
// const upload = multer({storage});

// app.post("/upload", upload.single("image"), (req, res)=>{
//   if (req.file){
//     res.status(200).json({
//       message: "File uploaded successfully",
//       filename: req.file.filename,
//     });
//   } else{
// res.status(400).json({
//   message: "File upload failed",
// });
//   }
  
// })

//   const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });