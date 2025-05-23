import React, { useEffect, useState } from "react";
import axios from "axios"; // Import Axios
import { toast, ToastContainer } from "react-toastify";
import { decrypt } from "../utils/cryptoHelper";
import { useParams } from "react-router-dom";

export default function ProfilePage() {
  const encodeId = (id) => btoa(id);
  const decodeId = (encoded) => atob(encoded);

  // Recursively decrypt _id fields for debugging or usage
  function decryptFieldsInObject(obj) {
    if (Array.isArray(obj)) {
      return obj.map(decryptFieldsInObject);
    } else if (obj && typeof obj === "object") {
      const newObj = {};
      for (const key in obj) {
        const val = obj[key];
        if (typeof val === "string") {
          try {
            newObj[key] = decodeId(val);
          } catch {
            newObj[key] = val; // if decoding fails, keep original
          }
        } else if (typeof val === "object") {
          newObj[key] = decryptFieldsInObject(val);
        } else {
          newObj[key] = val;
        }
      }
      return newObj;
    }
    return obj;
  }

  const { extra } = useParams();
  let decrypted;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      setError("User  not logged in");
      setLoading(false);
      return;
    }

    fetchUserDetails(userData);
  }, []);

  const fetchUserDetails = async (userData) => {
    try {
      setLoading(true);

      // Encode ID before request
      const encryptedId = encodeId(userData._id);

      const response = await axios.get(
        `https://craft-cart-backend.vercel.app/api/user/auth/${encryptedId}`,
        { headers: { Authorization: `Bearer ${userData.token}` } }
      );

      if (response.data.success) {
        // Decrypt to get original data for UI
        const originalData = decryptFieldsInObject(response.data.data);
        console.log("Original decrypted data:", originalData);

        // Save decrypted data in state (so UI works with real values)
        setUser(originalData);
      } else {
        setError(response.data.message || "Failed to get user data");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await axios.post(
        `https://craft-cart-backend.vercel.app/api/user/auth/address`,
        newAddress,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess("Address added successfully!");
        setTimeout(() => {
          setSuccess("");
        }, 2000);

        setNewAddress({
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        });
        toast.success(response.data.success);
        setShowAddressForm(false);
        fetchUserDetails(userData); // Refresh user data
      } else {
        setError(response.data.message || "Failed to add address");
        setTimeout(() => {
          setError("");
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  const handleDeleteAddress = async () => {
    const userData = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await axios.delete(
        `https://craft-cart-backend.vercel.app/api/user/auth/address/${addressToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess("Address deleted successfully!");
        fetchUserDetails(userData); // Refresh user data
      } else {
        setError(response.data.message || "Failed to delete address");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setShowConfirmDelete(false); // Close confirmation modal
      setAddressToDelete(null); // Reset address to delete
    }
  };

  const confirmDeleteAddress = (addressId) => {
    setAddressToDelete(addressId);
    setShowConfirmDelete(true);
  };

  const Loader = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
      <style>{`
        .loader {
          border-top-color: #004080;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-8xl mx-auto bg-white rounded-lg shadow-md p-6 animate-pulse">
        <h1 className="h-10 bg-gray-300 rounded w-48 mx-auto mb-6"></h1>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <div className="h-5 bg-gray-300 rounded w-24 mb-1"></div>
            <div className="h-6 bg-gray-200 rounded w-40"></div>
          </div>

          {/* Email */}
          <div>
            <div className="h-5 bg-gray-300 rounded w-24 mb-1"></div>
            <div className="h-6 bg-gray-200 rounded w-56"></div>
          </div>

          {/* Addresses Header */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="h-5 bg-gray-300 rounded w-32"></div>
              <div className="h-5 bg-gray-300 rounded w-12 font-bold"></div>
            </div>

            {/* Address list skeleton */}
            <ul className="space-y-3">
              {[1, 2].map((_, idx) => (
                <li
                  key={idx}
                  className="bg-gray-50 p-3 rounded shadow-sm border-l-4 border-gray-300"
                >
                  <div className="h-6 bg-gray-300 rounded w-24 mb-2"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-40"></div>
                    <div className="h-4 bg-gray-200 rounded w-36"></div>
                    <div className="h-4 bg-gray-200 rounded w-44"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                  </div>
                  <div className="mt-2 h-6 bg-gray-300 rounded w-24"></div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Add new address button skeleton */}
        <div className="mt-6 h-12 bg-gray-300 rounded w-40 mx-auto"></div>
      </div>
    );
  }

  if (error && !showAddressForm) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  try {
    decrypted = decrypt(extra);
  } catch (err) {
    console.error("Decryption failed:", err);
    return <div>Failed to decrypt URL parameter.</div>;
  }

  if (decrypted !== "profile") {
    return <div>Invalid Access: {decrypted}</div>;
  }
  return (
    <div className="relative min-h-screen bg-gray-100 p-4 sm:p-6 font-montserrat">
      <div className="max-w-8xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-[#004080] uppercase">
          User Profile
        </h1>
        <ToastContainer position="bottom-right" autoClose={3000} />
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold">Name:</label>
            <p className="text-gray-900">{user.name || user.username}</p>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Email:</label>
            <p className="text-gray-900">{user.email}</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-gray-700 font-semibold">
                Addresses:
              </label>
              <p className="text-sm text-gray-600 font-bold">
                Total: {user.addresses.length}
              </p>
            </div>

            {user.addresses && user.addresses.length > 0 ? (
              <ul className="space-y-3">
                {user.addresses.map((addr) => (
                  <li
                    key={addr._id}
                    className="bg-gray-50 p-3 rounded shadow-sm border-l-4 border-[#004080]"
                  >
                    <h3 className="text-[#004080] font-bold mb-2">Address</h3>
                    <p>
                      <span className="font-semibold">Street:</span>{" "}
                      {addr.street}
                    </p>
                    <p>
                      <span className="font-semibold">City:</span> {addr.city}
                    </p>
                    <p>
                      <span className="font-semibold">State:</span> {addr.state}
                    </p>
                    <p>
                      <span className="font-semibold">Zip:</span>{" "}
                      {addr.postalCode}
                    </p>
                    <p>
                      <span className="font-semibold">Country:</span>{" "}
                      {addr.country}
                    </p>
                    <button
                      onClick={() => confirmDeleteAddress(addr._id)}
                      className="mt-2 font-bold text-red-500 hover:text-red-700  transition-all duration-200"
                    >
                      Delete Address
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No addresses found.</p>
            )}
          </div>
        </div>

        <button
          onClick={() => setShowAddressForm(true)}
          className="mt-6 w-small p-3 bg-[#004080] text-yellow-400 font-semibold py-2 rounded-lg hover:bg-yellow-400 hover:text-[#004080] transition duration-300"
        >
          Add New Address
        </button>
      </div>

      {/* Overlay and Sidebar Drawer */}
      {showAddressForm && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 font-montserrat"
            onClick={() => setShowAddressForm(false)}
          ></div>
          <div className="fixed right-0 top-12 h-full w-full sm:w-96 bg-white p-6 z-50 shadow-lg overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#004080]">
                Add New Address
              </h2>
              <button
                onClick={() => setShowAddressForm(false)}
                className="text-gray-500 text-lg"
              >
                ✕
              </button>
            </div>

            {success && <p className="text-green-600 mb-2">{success}</p>}
            {error && <p className="text-red-600 mb-2">{error}</p>}

            <form onSubmit={handleAddAddress} className="space-y-4">
              {[
                { label: "Street", key: "street" },
                { label: "City", key: "city" },
                { label: "State", key: "state" },
                { label: "Postal Code", key: "postalCode" },
                { label: "Country", key: "country" },
              ].map(({ label, key }, i) => (
                <div key={i}>
                  <label className="block text-gray-700 font-semibold mb-1">
                    {label}:
                  </label>
                  <input
                    type="text"
                    value={newAddress[key]}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, [key]: e.target.value })
                    }
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              ))}

              <button
                type="submit"
                className="w-full bg-[#004080] text-yellow-400 font-semibold py-2 rounded-lg hover:bg-yellow-400 hover:text-[#004080] transition duration-300"
              >
                Add Address
              </button>
            </form>
          </div>
        </>
      )}

      {/* Confirmation Modal for Deleting Address */}
      {showConfirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold text-[#004080] mb-4">
              Confirm Deletion
            </h2>
            <p>Are you sure you want to delete this address?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="mr-2 text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAddress}
                className="bg-red-500 text-white py-2 px-4 rounded"
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
