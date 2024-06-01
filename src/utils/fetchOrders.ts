import axios from "axios";
import { Order } from "@/types/order";

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await axios.get(
      "https://mock.apidog.com/m1/523540-483895-default/api/orders",
    );
    console.log("Cek response", response.data);

    // Assuming response.data is an array of orders
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error; // Rethrow the error to be caught by the component
  }
};

export const deleteOrder = async (orderId: number): Promise<void> => {
  try {
    const response = await axios.delete(
      `https://mock.apidog.com/m1/523540-483895-default/api/order/${orderId}`,
    );
    console.log("cek response delete", response);

    console.log("Order deleted successfully");
    return response;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error; // Rethrow the error to be caught by the component
  }
};
