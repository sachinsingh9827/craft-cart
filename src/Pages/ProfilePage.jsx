import React, { useEffect, useState } from "react";
import axios from "axios"; // Import Axios

export default function ProfilePage() {
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

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      setError("User  not logged in");
      setLoading(false);
      return;
    }

    fetchUserDetails(userData);
  }, []);
  const handleDeleteAddress = async (addressId) => {
    const userData = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await axios.delete(
        `https://craft-cart-backend.vercel.app/api/user/auth/address/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess("Address deleted successfully!");
        fetchUserDetails(); // Refresh user data to update UI
      } else {
        setError(response.data.message || "Failed to delete address");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Server error");
    }
  };

  const fetchUserDetails = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://craft-cart-backend.vercel.app/api/user/auth/${userData._id}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (response.data.success) {
        setUser(response.data.data);
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
        setNewAddress({
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        });
        setShowAddressForm(false);
        fetchUserDetails(userData); // Refresh user data
      } else {
        setError(response.data.message || "Failed to add address");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold">Loading user details...</p>
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

  return (
    <div className="relative min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-8xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-[#004080]">
          User Profile
        </h1>

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
              <p className="text-sm text-gray-600">
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
                      onClick={() => handleDeleteAddress(addr._id)}
                      className="mt-2 text-red-500 hover:underline"
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
          className="mt-6 w-full bg-[#004080] text-yellow-400 font-semibold py-2 rounded-lg hover:bg-yellow-400 hover:text-[#004080] transition duration-300"
        >
          Add New Address
        </button>
      </div>

      {/* Overlay and Sidebar Drawer */}
      {showAddressForm && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
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
    </div>
  );
}
