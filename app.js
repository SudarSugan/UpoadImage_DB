import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from 'path';
import { fileURLToPath } from 'url';

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

// MongoDB schema for storing image data
const productSchema = new mongoose.Schema({
  image: {
    type: Buffer, // Stores binary data for the image
    required: true,
  },
  contentType: {
    type: String, // Store the image type, e.g., 'image/png'
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

// Multer configuration to store images in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to handle image upload and store it in MongoDB
app.post("/api/posts", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image file is required." });
  }

  const newPost = new Product({
    image: req.file.buffer, // Store the image as a Buffer
    contentType: req.file.mimetype || 'application/octet-stream', // Default to 'application/octet-stream' if mimetype is not available
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: "Error creating post", error });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
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




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});








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