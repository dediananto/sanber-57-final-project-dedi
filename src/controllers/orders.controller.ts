// create code to create order and get order by user

import { Request, Response } from "express";
import OrdersModel from "@/models/orders.model";
import ProductsModel from "@/models/products.model";
import * as Yup from "yup";
import { IReqUser } from "@/utils/interfaces";

// make yup validation for request like this in create function
const createValidationSchema = Yup.object().shape({
    grandTotal: Yup.number().required(),
    createdBy: Yup.string().required(),
    status: Yup.string().oneOf(["pending", "completed", "cancelled"]).required(),
    orderItems: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required(),
            productId: Yup.string().required(),
            price: Yup.number().required(),
            quantity: Yup.number().required().min(1).max(5),
        })
    )
});

interface IPaginationQuery {
    page: number;
    limit: number;
    search?: string;
}
export default {
    async create(req: Request, res: Response) {
        try {
            console.log('request', req.body)
            await createValidationSchema.validate(req.body);
            const { orderItems, createdBy } = req.body;
            const promises = orderItems.map(async (item: { productId: any; quantity: number; }) => {
                const product = await ProductsModel.findById(item.productId);
                if (!product || product.qty < item.quantity) {
                    throw new Error("Product quantity is not enough");
                }
                return item;
            });
            const result = await Promise.all(promises);
            const grandTotal = result.reduce((total, item) => total + item.price * item.quantity, 0);
            const order = await OrdersModel.create({
                orderItems: result,
                grandTotal,
                createdBy,
            });
            res.status(201).json({
                data: order,
                message: "Success create order",
            });
        } catch (error) {
            const err = error as Error;
            res.status(500).json({
                data: err.message,
                message: "Failed create order",
            });
        }
    },
    async findAll(req: Request, res: Response) {
        try {
            const {
              limit = 10,
              page = 1,
              search = "",
            } = req.query as unknown as IPaginationQuery;

            const query: any = {};

            if (search) {
                const searchParams = search.split(",").map((param) => {
                    const [field, value] = param.split(":");
                    if (field === "status") {
                        return { [field]: { $regex: value, $options: "i" } };
                    }
                    if (field === "grandTotal") {
                        const num = parseFloat(value);
                        if (isNaN(num)) {
                            return null;
                        }
                        return { [field]: { $gte: num, $lte: num + 1 } };
                    }
                    return null;
                });

                query.$or = searchParams.filter(Boolean);
            }

            const createdBy = (req as IReqUser).user.id;
            const skip = (page - 1) * limit;
            const orders = await OrdersModel.find({ createdBy, ...query })
                .limit(limit)
                .skip(skip)
                .sort({ createdAt: -1 })
                .populate("category");
                
            const total = await OrdersModel.countDocuments({ createdBy, ...query });

            res.status(200).json({
                data: orders,
                message: "Success get all products",
                page: +page,
                limit: +limit,
                total,
                totalPages: Math.ceil(total / limit)
            });
        } catch (error) {
            const err = error as Error;
            res.status(500).json({
              data: err.message,
              message: "Failed get user orders",
            });
        }
    }
}

