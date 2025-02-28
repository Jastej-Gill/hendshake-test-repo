"use client";

import { useEffect, useState } from "react";

interface FormData {
  id: number;
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
  const [formData, setFormData] = useState<Omit<FormData, "id">>({
    activity: "",
    price: 0,
    activityType: "education",
    bookingReq: false,
    accessibility: 0.5
  });

  const [tasks, setTasks] = useState<FormData[]>([]);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks])

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
      const newTask: FormData = {
        id: Date.now(),
        ...formData,
      };

      setTasks([...tasks, newTask]);

      setFormData({
        activity: "",
        price: 0,
        activityType: "education",
        bookingReq: false,
        accessibility: 0.5
      });


      alert("Form submitted successfully");
    }
  };

  const handleDelete = (id: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  }

  return (
    <div>
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
          <label>Price</label>
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
      <div className="mt-8">
          <h2 className="text-center">Saved Tasks</h2>
          <ul>
            {
              tasks.map((task) => (
                <li key={(task.id)} style={{ display: "flex", justifyContent: "space-between", padding: "10px", borderBottom: "1px solid black" }}>
                  <div style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "flex-start", 
                    gap: "5px", 
                    padding: "10px", 
                    borderBottom: "1px solid black",
                    width: "100%" 
                }}>
                  <p><strong>Activity:</strong> {task.activity}</p>
                  <p><strong>Type:</strong> {task.activityType}</p>
                  <p><strong>Price:</strong> ${task.price.toFixed(2)}</p>
                  <p><strong>Booking Required:</strong> {task.bookingReq ? "Yes" : "No"}</p>
                  <p><strong>Accessibility:</strong> {task.accessibility.toFixed(1)}</p>

                  <button 
                    onClick={() => handleDelete(task.id)} 
                    style={{
                      background: "red",
                      color: "white",
                      border: "none",
                      padding: "8px",
                      marginTop: "10px",
                      width: "100%",
                      cursor: "pointer",
                      textAlign: "center"
                    }}
                  >
                    Remove
                  </button>
                </div>
                </li>
              ))
            }
          </ul>
      </div>
    </div>
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
