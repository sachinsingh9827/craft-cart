import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import Orders from "../Orders/Orders";
import Wishlist from "../Wishlist/Wishlist";
import EditProfile from "./EditProfile";
import ProfileInfo from "../ProfileInfo/ProfileInfo";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  const fetchUserDetails = async (userData) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://craft-cart-backend.vercel.app/api/user/auth/${userData._id}`,
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );
      if (res.data.success) {
        setUser(res.data.data);
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
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      setError("User not logged in");
      setLoading(false);
      return;
    }
    fetchUserDetails(userData);
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem("user"));
    try {
      const res = await axios.post(
        `https://craft-cart-backend.vercel.app/api/user/auth/address`,
        newAddress,
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );
      if (res.data.success) {
        toast.success("Address added!");
        setNewAddress({
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        });
        setShowAddressForm(false);
        fetchUserDetails(userData);
      } else {
        toast.error(res.data.message || "Failed to add address");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteAddress = async () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    try {
      const res = await axios.delete(
        `https://craft-cart-backend.vercel.app/api/user/auth/address/${addressToDelete}`,
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );
      if (res.data.success) {
        toast.success("Address deleted!");
        fetchUserDetails(userData);
      } else {
        toast.error(res.data.message || "Failed to delete address");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setShowConfirmDelete(false);
      setAddressToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-1 bg-gray-100 text-sm sm:text-base font-montserrat">
      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="max-w-full mx-auto bg-white rounded shadow-lg p-2">
        {/* Tabs */}
        <div className="flex flex-wrap justify-around border-b pb-2 mb-4 text-blue-900 font-semibold">
          {["profile", "orders", "wishlist", "edit"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 ${
                activeTab === tab
                  ? "border-b-2 border-blue-900 text-blue-900"
                  : "text-gray-500"
              }`}
            >
              {tab === "profile"
                ? "Profile"
                : tab === "orders"
                ? "Orders"
                : tab === "wishlist"
                ? "Wishlist"
                : "Edit Profile"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <ProfileInfo
            user={user}
            setShowAddressForm={setShowAddressForm}
            setAddressToDelete={setAddressToDelete}
            setShowConfirmDelete={setShowConfirmDelete}
          />
        )}

        {activeTab === "orders" && <Orders />}

        {activeTab === "wishlist" && <Wishlist />}

        {activeTab === "edit" && <EditProfile />}
      </div>

      {/* Address Form Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 w-full max-w-sm rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-blue-900">
                New Address
              </h2>
              <button
                onClick={() => setShowAddressForm(false)}
                className="text-gray-500 text-lg"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddAddress} className="space-y-2">
              {["street", "city", "state", "postalCode", "country"].map(
                (field) => (
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
                )
              )}
              <button
                type="submit"
                className="w-full bg-blue-900 text-yellow-300 py-2 rounded"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-md max-w-xs w-full text-center">
            <p className="text-blue-900 font-semibold mb-4">
              Confirm deletion of this address?
            </p>
            <div className="flex justify-around mt-2">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAddress}
                className="text-red-600 font-bold"
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
