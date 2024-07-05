// The Order model represents an order in the database.
// It has a relationship with the Product model (1-N) and the User model (1-1).

import { Schema, model, Document } from 'mongoose';
import { Types } from 'mongoose';
import mail from "@/utils/mail";
import UsersModel from './users.model';
import {COMPANY_NAME, CONTACT_EMAIL} from "@/utils/env";

/**
 * Interface representing an order item.
 */
interface OrderItem {
  name: string; // The name of the product.
  productId: Types.ObjectId; // The ID of the product.
  price: number; // The price of the product.
  quantity: number; // The quantity of the product ordered.
}

/**
 * Interface representing an order.
 */
interface Order extends Document {
  grandTotal: number; // The grand total of the order.
  orderItems: OrderItem[]; // The items in the order.
  createdBy: Types.ObjectId; // The ID of the user who created the order.
  status: "pending" | "completed" | "cancelled"; // The status of the order.
}

// Create the schema for the Order model.
const OrdersSchema = new Schema<Order>({
  grandTotal: {
    type: Number,
    required: true,
  }, // The grand total of the order.
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      }, // The name of the product.
      productId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product', // The reference to the Product model.
      }, // The ID of the product.
      price: {
        type: Number,
        required: true,
      }, // The price of the product.
      quantity: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      }, // The quantity of the product ordered.
    },
  ], // The items in the order.
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User', // The reference to the User model.
  }, // The ID of the user who created the order.
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  }, // The status of the order.
},
{
  timestamps: true,
});

// Make validation before save.
OrdersSchema.pre('save', function (next) {
  const order = this as Order;
  order.orderItems.forEach((item) => {
    if (item.quantity < 1 || item.quantity > 5) {
      return next(new Error('Quantity must be between 1 and 5'));
    }
  });
  next();
});

OrdersSchema.post("save", async function(doc, next) {
    const order = doc;
    const user = await UsersModel.findById(order.createdBy);
    if (user) {
        const content = await mail.render('invoice.ejs', {
            orderItems: order.orderItems,
            customerName: user.fullName,
            grandTotal: order.grandTotal,
            contactEmail: CONTACT_EMAIL,
            companyName: COMPANY_NAME,
            year: new Date().getFullYear()
        });
    
        await mail.send(user.email, 'Invoice', content);
    } else {
        console.error('User not found');
    }
    next();
});

// Create the model for the Order using the schema.
export default model<Order>('Order', OrdersSchema);

