import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../components/Reusable/Button";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    contact: "",
  });
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `https://craft-cart-backend.vercel.app/api/user/auth/${userData._id}`,
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );

      if (res.data.success) {
        setUser(res.data.data.user);
      } else {
        setError(res.data.message || "Failed to fetch user data.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleAddOrUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const endpoint = editingAddressId
        ? `https://craft-cart-backend.vercel.app/api/user/auth/address/${userData._id}/${editingAddressId}`
        : `https://craft-cart-backend.vercel.app/api/user/auth/address`;

      const method = editingAddressId ? "put" : "post";

      const res = await axios[method](endpoint, newAddress, {
        headers: { Authorization: `Bearer ${userData.token}` },
      });

      if (res.data.success) {
        toast.success(editingAddressId ? "Address updated!" : "Address added!");
        setNewAddress({
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
          contact: "",
        });
        setEditingAddressId(null);
        setShowAddressForm(false);
        fetchUserDetails();
      } else {
        toast.error(res.data.message || "Failed to submit address");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteAddress = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));

      const res = await axios.delete(
        `https://craft-cart-backend.vercel.app/api/user/auth/address`,
        {
          headers: { Authorization: `Bearer ${userData.token}` },
          data: {
            userId: userData._id,
            addressId: addressToDelete,
          },
        }
      );

      if (res.data.success) {
        toast.success("Address deleted!");
        fetchUserDetails();
      } else {
        toast.error(res.data.message || "Failed to delete address");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setShowConfirmDelete(false);
      setAddressToDelete(null);
    }
  };

  const openEditForm = (address) => {
    setNewAddress(address);
    setEditingAddressId(address._id);
    setShowAddressForm(true);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen p-2 font-montserrat">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="max-w-full mx-auto p-1">
        <h1 className="text-sm uppercase text-[#004080] font-bold mb-6">
          User Profile
        </h1>

        <div className="mb-6">
          <p>
            <strong className="text-[#004080]">Name:</strong>{" "}
            {user?.name || user?.username}
          </p>
          <p>
            <strong className="text-[#004080]">Email:</strong> {user?.email}
          </p>
        </div>

        <h2 className="text-sm uppercase text-[#004080] font-bold mb-2">
          Addresses ({user?.addresses?.length || 0})
        </h2>
        <div className="space-y-4">
          {user?.addresses?.map((addr) => (
            <div
              key={addr._id}
              className="border border-gray-300 rounded p-2 flex justify-between items-start"
            >
              <div>
                <p>
                  <strong>Street:</strong> {addr.street}
                </p>
                <p>
                  <strong>City:</strong> {addr.city}
                </p>
                <p>
                  <strong>State:</strong> {addr.state}
                </p>
                <p>
                  <strong>Postal Code:</strong> {addr.postalCode}
                </p>
                <p>
                  <strong>Country:</strong> {addr.country}
                </p>
                <p>
                  <strong>Contact:</strong> {addr.contact}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => openEditForm(addr)}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setAddressToDelete(addr._id);
                    setShowConfirmDelete(true);
                  }}
                  className="text-red-600 font-semibold hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={() => setShowAddressForm(true)} className="mt-4">
          Add New Address
        </Button>
      </div>

      {/* Address Form Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm uppercase font-semibold text-[#004080]">
                {editingAddressId ? "Edit Address" : "Add New Address"}
              </h2>
              <button
                onClick={() => {
                  setShowAddressForm(false);
                  setEditingAddressId(null);
                  setNewAddress({
                    street: "",
                    city: "",
                    state: "",
                    postalCode: "",
                    country: "",
                    contact: "",
                  });
                }}
                className="text-[#004080] text-lg"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddOrUpdateAddress} className="space-y-4">
              {[
                "street",
                "city",
                "state",
                "postalCode",
                "country",
                "contact",
              ].map((field) => (
                <input
                  key={field}
                  type="text"
                  required
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={newAddress[field]}
                  onChange={(e) =>
                    setNewAddress((prev) => ({
                      ...prev,
                      [field]: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded text-sm"
                />
              ))}
              <Button type="submit">
                {editingAddressId ? "Update Address" : "Add Address"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md max-w-xs w-full text-center">
            <p className="text-blue-900 font-semibold mb-4">
              Are you sure you want to delete this address?
            </p>
            <div className="flex justify-around mt-4">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAddress}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
