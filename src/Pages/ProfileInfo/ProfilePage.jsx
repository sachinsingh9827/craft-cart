import React, { useState } from "react";
import Orders from "../Orders/Orders";
import Wishlist from "../Wishlist/Wishlist";
import EditProfile from "./EditProfile";
import ProfileInfo from "../ProfileInfo/ProfileInfo"; // Import ProfileInfo component
import { ToastContainer } from "react-toastify";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");

  // If ProfileInfo needs a user prop, you can pass it from parent or mock here.
  // For now, let's assume ProfileInfo can render without props or you will update it later.

  return (
    <div className="min-h-screen p-1 bg-gray-100 text-sm sm:text-base font-montserrat">
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
        {activeTab === "profile" && <ProfileInfo />}
        {activeTab === "orders" && <Orders />}
        {activeTab === "wishlist" && <Wishlist />}
        {activeTab === "edit" && <EditProfile />}
      </div>
      <ToastContainer position="buttom-right" autoClose={3000} />
    </div>
  );
}
