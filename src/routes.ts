import express from "express";

import uploadMiddleware from "./middlewares/upload.middleware";
import uploadController from "./controllers/upload.controller";
import productsController from "./controllers/products.controller";
import categoriesController from "./controllers/categories.controller";
import ordersController from "./controllers/orders.controller";
import authController from "./controllers/auth.controller";
import authMiddleware from "./middlewares/auth.middleware";
import aclMiddlware from "./middlewares/acl.middleware";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "server is running...",
    data: "ok"
  });
});

router.get("/products", productsController.findAll);
router.post("/products", productsController.create);
router.get("/products/:id", productsController.findOne);
router.put("/products/:id", productsController.update);
router.delete("/products/:id", productsController.delete);

router.get("/categories", categoriesController.findAll);
router.post("/categories", categoriesController.create);
router.get("/categories/:id", categoriesController.findOne);
router.put("/categories/:id", categoriesController.update);
router.delete("/categories/:id", categoriesController.delete);

router.post("/upload", uploadMiddleware.single, uploadController.single);
router.post("/uploads", uploadMiddleware.multiple, uploadController.multiple);

router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.get(
    "/auth/me",
    [authMiddleware, aclMiddlware(["admin"])],
    authController.me
  );
router.put("/auth/profile", authMiddleware, authController.profile);

router.get("/orders", ordersController.findAll);
router.post("/orders", authMiddleware, ordersController.create);

export default router;
