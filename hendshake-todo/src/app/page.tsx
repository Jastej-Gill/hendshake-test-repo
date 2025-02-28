"use client";

import { useState } from "react";

interface FormData {
  activity: string;
  price: number;
  activityType: string;
  bookingReq: boolean;
  accessibility: number;
}

const activityTypes = [
  "education",
  "recreational",
  "social",
  "diy",
  "charity",
  "cooking",
  "relaxation",
  "music",
  "busywork"
];

const Form = () => {
  const [formData, setFormData] = useState<FormData>({
    activity: "",
    price: 0,
    activityType: "education",
    bookingReq: false,
    accessibility: 0.5
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" || type === "range" ? Number(value) :
              type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = (): boolean => {
    let newErrors: Partial<FormData> = {};

    if (!formData.activity) newErrors.activity = "Activity is required";
    if (!formData.activityType) newErrors.activityType = "Activity type is required";
    if (formData.price <= 0) newErrors.price = "Enter a valid price greater than 0";
    if (formData.accessibility < 0 || formData.accessibility > 1) {
      newErrors.accessibility = "Accessibility must be between 0.0 and 1.0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      alert("Form submitted successfully");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container py-16">
      <h2 className="text-center">Activity Form</h2>

      <div className="form-group">
        <label>Activity</label>
        <input type="text" name="activity" value={formData.activity} onChange={handleChange} className="form-input" />
        {errors.activity && <p className="form-error">{errors.activity}</p>}
      </div>

      <div className="form-group">
        <label>Activity Type</label>
        <select name="activityType" value={formData.activityType} onChange={handleChange} className="form-input">
          {activityTypes.map((type) => (
            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
          ))}
        </select>
        {errors.activityType && <p className="form-error">{errors.activityType}</p>}
      </div>

      <div className="form-group">
        <label>Price (USD)</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" min="0" className="form-input" />
        {errors.price && <p className="form-error">{errors.price}</p>}
      </div>

      <div className="form-group">
        <label>Accessibility (0.0 - 1.0)</label>
        <input type="range" name="accessibility" min="0" max="1" step="0.1" value={formData.accessibility} onChange={handleChange} className="form-range" />
        <p className="text-white">Selected: {formData.accessibility.toFixed(1)}</p>
        {errors.accessibility && <p className="form-error">{errors.accessibility}</p>}
      </div>

      <div className="form-group flex items-center">
        <input type="checkbox" name="bookingReq" checked={formData.bookingReq} onChange={handleChange} className="form-checkbox" />
        <label className="ml-2">Booking Required</label>
      </div>

      <button type="submit" className="form-button">Submit</button>
    </form>
  );
};

export default function Home() {
  return (
    <div className="container">
      <h1>To Do List</h1>
      <Form />
    </div>
  );
}
