"use client";
import { useEffect, useState } from "react";
import { fetchOrders, deleteOrder } from "@/utils/fetchOrders";
import { Order } from "@/types/order";
import moment from "moment";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TableThree = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [customerNameFilter, setCustomerNameFilter] = useState("");
  const [createdDateFilter, setCreatedDateFilter] = useState("");

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data.list);
      } catch (error) {
        console.error("Error fetching orders:", error);
        // Handle error, setOrders([]) or show an error message to the user
      }
    };

    getOrders();
  }, []);

  // Logic to calculate the orders to be displayed on the current page
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const filteredOrders = orders.filter((order) => {
    const customerNameMatch = order.customer_name
      .toLowerCase()
      .includes(customerNameFilter.toLowerCase());
    const createdDateMatch = moment(order.created_at)
      .format("YYYY-MM-DD")
      .includes(createdDateFilter);
    return customerNameMatch && createdDateMatch;
  });
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder,
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Function to format price to Indonesian Rupiah currency format
  const formatPriceToIDR = (price: string | number | bigint) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const handleDelete = async (orderId: string | number) => {
    console.log("Checking success", orderId);

    try {
      await deleteOrder(orderId);

      toast.success("Order deleted successfully!");

      // Assuming fetchOrders retrieves the updated list of orders
      const data = await fetchOrders();
      setOrders(data.list);
    } catch (error) {
      console.error("Error deleting order:", error);
      // Handle error, show an error message to the user, etc.
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      {/* Filter section */}
      <div className="mb-4 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search by Customer Name"
          value={customerNameFilter}
          onChange={(e) => setCustomerNameFilter(e.target.value)}
          className="border-gray-300 rounded-md border px-3 py-2 focus:border-blue-300 focus:outline-none focus:ring"
        />
        <input
          type="date"
          placeholder="Search by Created Date"
          value={createdDateFilter}
          onChange={(e) => setCreatedDateFilter(e.target.value)}
          className="border-gray-300 rounded-md border px-3 py-2 focus:border-blue-300 focus:outline-none focus:ring"
        />
        <Link href="/orderManagement/add-order" passHref>
          <div className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
            Add New Order
          </div>
        </Link>
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Order ID
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Customer
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Total Products
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Total Price
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Order Date
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {currentOrders.map((order, index) => (
              <tr key={index}>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <p className="text-sm">{order.id}</p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {order.customer_name}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {order.total_products}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {formatPriceToIDR(order.total_price)}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {moment(order.created_at).format("D/mm/yyyy hh:mm")}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  {/* Actions buttons */}
                  <div className="flex items-center space-x-2">
                    <button
                      className="text-blue-500 hover:text-blue-700 focus:outline-none"
                      onClick={() => handleView(item.id)}
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M12 7.5C14.4853 7.5 16.5 9.51472 16.5 12C16.5 14.4853 14.4853 16.5 12 16.5C9.51472 16.5 7.5 14.4853 7.5 12C7.5 9.51472 9.51472 7.5 12 7.5ZM3 12C3 6.486 7.486 2 13 2C18.514 2 23 6.486 23 12C23 17.514 18.514 22 13 22C7.486 22 3 17.514 3 12ZM11 12C11 13.657 9.657 15 8 15C6.343 15 5 13.657 5 12C5 10.343 6.343 9 8 9C9.657 9 11 10.343 11 12Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>

                    <button
                      className="text-blue-500 hover:text-blue-700 focus:outline-none"
                      onClick={() => handleEdit(item.id)}
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M14.932 3.932l1.136 1.136L5.71 16.375l-2.879.72.72-2.88L14.932 3.932zM16 3c.184 0 .361.037.525.108.278.116.475.343.603.595.128.253.191.54.19.845 0 .305-.063.592-.19.844-.128.252-.325.479-.603.595a1.667 1.667 0 0 1-.844.19c-.305 0-.592-.063-.845-.19a1.667 1.667 0 0 1-.595-.595A1.658 1.658 0 0 1 14 5a1.658 1.658 0 0 1-.525-.108l-9.396-4.698A1.658 1.658 0 0 1 3 0c-.415 0-.786.149-1.105.448C1.149.786 1 1.057 1 1.473s.149.787.448 1.106l4.698 9.396C6.167 12.914 6 13.428 6 14c0 1.104.896 2 2 2 .571 0 1.086-.167 1.545-.5L17.582 7.455c.299-.299.448-.67.448-1.105 0-.414-.149-.785-.448-1.104C17.785 3.149 17.414 3 17 3z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>

                    <button
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                      onClick={() => handleDelete(order.id)}
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M3.707 3.293a1 1 0 011.414 0L10 8.586l5.293-5.293a1 1 0 111.414 1.414L11.414 10l5.293 5.293a1 1 0 01-1.414 1.414L10 11.414l-5.293 5.293a1 1 0 01-1.414-1.414L8.586 10 3.293 4.707a1 1 0 010-1.414z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div>
        {/* Your table component goes here */}
        <div className="border-gray-200 flex items-center justify-between border-t bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 relative inline-flex items-center rounded-md border bg-white px-4 py-2 text-sm font-medium"
            >
              Previous
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastOrder >= orders.length}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 relative ml-3 inline-flex items-center rounded-md border bg-white px-4 py-2 text-sm font-medium"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-gray-700 text-sm">
                Showing
                <span className="font-medium">{indexOfFirstOrder + 1}</span>
                to
                <span className="font-medium">
                  {Math.min(indexOfLastOrder, orders.length)}
                </span>
                of
                <span className="font-medium">{orders.length}</span>
                results
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="text-gray-400 ring-gray-300 hover:bg-gray-50 relative inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-inset focus:outline-offset-0"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {Array.from(
                  { length: Math.ceil(orders.length / ordersPerPage) },
                  (_, i) => (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === i + 1 ? "bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" : "text-gray-900 ring-gray-300 hover:bg-gray-50 ring-1 ring-inset focus:z-20 focus:outline-offset-0"}`}
                    >
                      {i + 1}
                    </button>
                  ),
                )}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={indexOfLastOrder >= orders.length}
                  className="text-gray-400 ring-gray-300 hover:bg-gray-50 relative inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset focus:outline-offset-0"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableThree;
