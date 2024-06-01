import axios from "axios";
import { Produk } from "@/types/produk";

export const fetchProduct = async (): Promise<Produk[]> => {
  try {
    const response = await axios.get(
      "https://mock.apidog.com/m1/523540-483895-default/api/products",
    );
    console.log("Cek response produk", response.data);

    // Assuming response.data is an array of orders
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error; // Rethrow the error to be caught by the component
  }
};
