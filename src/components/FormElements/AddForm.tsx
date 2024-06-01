"use client";
import { useEffect, useState } from "react";
import { fetchProduct } from "@/utils/fetchProduct";
import axios from "axios";
import { Produk } from "@/types/produk";

const AddForm = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    products: [{ productName: "", quantity: "", price: "", total: "" }],
    totalOrderPrice: "",
  });
  const [productOptions, setProductOptions] = useState<Produk[]>([]);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchProduct();
        setProductOptions(data.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    getOrders();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number,
  ) => {
    const { name, value } = e.target;

    if (index !== undefined) {
      const updatedProducts = [...formData.products];
      updatedProducts[index] = { ...updatedProducts[index], [name]: value };

      if (name === "productName") {
        const selectedProduct = productOptions.find(
          (product) => product.name === value,
        );
        if (selectedProduct) {
          updatedProducts[index].price = selectedProduct.price.toString();
        }
      }

      const totalPrice =
        parseFloat(updatedProducts[index].quantity) *
        parseFloat(updatedProducts[index].price);
      updatedProducts[index].total = totalPrice.toFixed(2);

      setFormData({ ...formData, products: updatedProducts });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    const totalOrderPrice = formData.products.reduce((total, product) => {
      return total + parseFloat(product.total);
    }, 0);
    setFormData((prevState) => ({
      ...prevState,
      totalOrderPrice: totalOrderPrice.toFixed(2),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const orderData = {
      customer_name: formData.customerName,
      products: formData.products,
      //   totalOrderPrice: formData.totalOrderPrice,
    };

    try {
      const response = await axios.post(
        "https://mock.apidog.com/m1/523540-483895-default/api/order",
        orderData,
      );
      console.log("cek hasil", response);

      if (response.status === 200) {
        console.log("Order created successfully:", response.data);
      } else {
        console.error("Error creating order:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const addMoreProduct = () => {
    setFormData({
      ...formData,
      products: [
        ...formData.products,
        { productName: "", quantity: "", price: "", total: "" },
      ],
    });
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="mx-auto w-full max-w-screen-lg rounded-md bg-white p-8 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold">Add Order</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="customerName"
              className="text-gray-700 block text-sm font-medium"
            >
              Customer Name
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="border-gray-300 mt-1 w-full rounded-md border p-2"
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-700 mb-1 block text-sm font-medium">
              Product Details
            </label>
            {formData.products.map((product, index) => (
              <div className="mb-2 grid grid-cols-4 gap-4" key={index}>
                <select
                  name="productName"
                  value={product.productName}
                  onChange={(e) => handleChange(e, index)}
                  className="border-gray-300 w-full rounded-md border p-2"
                >
                  <option value="">Select Product</option>
                  {productOptions.map((option, optionIndex) => (
                    <option key={optionIndex} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  value={product.quantity}
                  onChange={(e) => handleChange(e, index)}
                  className="border-gray-300 w-full rounded-md border p-2"
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={product.price}
                  onChange={(e) => handleChange(e, index)}
                  className="border-gray-300 w-full rounded-md border p-2"
                  disabled // Disable user input for price
                />
                <input
                  type="text"
                  name="total"
                  placeholder="Total Product Price"
                  value={product.total}
                  onChange={(e) => handleChange(e, index)}
                  className="border-gray-300 w-full rounded-md border p-2"
                  disabled // Disable user input for total product price
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addMoreProduct}
              className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              Add More Product
            </button>
          </div>
          <div className="mb-4">
            <label
              htmlFor="totalOrderPrice"
              className="text-gray-700 block text-sm font-medium"
            >
              Total Order Price
            </label>
            <input
              type="text"
              id="totalOrderPrice"
              name="totalOrderPrice"
              value={formData.totalOrderPrice}
              onChange={handleChange}
              className="border-gray-300 mt-1 w-full rounded-md border p-2"
              disabled // Disable user input for total order price
            />
          </div>
          <div>
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Add Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddForm;
