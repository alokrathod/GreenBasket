import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

// @desc    Place a new order (COD)
// @route   POST /api/order/cod
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user;
    const { items, address } = req.body;

    if (!address || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid order details", success: false });
    }

    // Calculate amount using items
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(400)
          .json({ message: "Product not found", success: false });
      }
      amount += product.offerPrice * item.quantity;
    }

    // Add tax charge 2%
    amount += Math.floor((amount * 2) / 100);

    const order = new Order({
      user: userId,
      items,
      address,
      amount,
      paymentType: "COD",
      isPaid: false,
      status: "Pending",
    });

    await order.save();

    return res
      .status(201)
      .json({ message: "Order placed successfully", success: true, order });
  } catch (error) {
    console.error("Error placing order:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// @desc    Get all orders for a user
// @route   GET /api/order/:userId
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log("Error in getUserOrders controller", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// @desc    Get all orders (admin/seller)
// @route   GET /api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log("Error in getAllOrders controller", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// @desc    Update order status (admin/seller)
// @route   PATCH /api/order/:orderId
// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;

//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res
//         .status(404)
//         .json({ message: "Order not found", success: false });
//     }

//     order.status = status;
//     await order.save();

//     return res
//       .status(200)
//       .json({ message: "Order status updated", success: true, order });
//   } catch (error) {
//     console.error("Error updating order status:", error);
//     return res
//       .status(500)
//       .json({ message: "Internal server error", success: false });
//   }
// };
