import React, { useState } from "react";
import "./ContactUs.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      errs.email = "Invalid email";
    }
    if (!formData.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const valErrors = validate();
    setErrors(valErrors);
    if (Object.keys(valErrors).length === 0) {
      setSubmitted(true);
      console.log("Message Sent:", formData);
      setFormData({ name: "", email: "", message: "" });
    } else {
      setSubmitted(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-left">
        <img
          src="https://cdn.pixabay.com/photo/2015/01/08/18/29/office-593360_960_720.jpg"
          alt="Contact illustration"
        />
      </div>
      <div className="contact-right">
        <h2>Contact Us</h2>
        {submitted && <p className="success-msg">Thanks for contacting us!</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "error" : ""}
          />
          {errors.name && <p className="error-msg">{errors.name}</p>}

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
          />
          {errors.email && <p className="error-msg">{errors.email}</p>}

          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            className={errors.message ? "error" : ""}
          ></textarea>
          {errors.message && <p className="error-msg">{errors.message}</p>}

          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
