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

// Activity dropdown options
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

// Form object
const Form = () => {

  // init fields
  const [formData, setFormData] = useState<Omit<FormData, "id">>({
    activity: "",
    price: 0,
    activityType: "education",
    bookingReq: false,
    accessibility: 0.5
  });

  // Array of tasks added
  const [tasks, setTasks] = useState<FormData[]>([]);
  
  // Object containing form input errors
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Load tasks on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, [])

  // Update tasks display when tasks array updated
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks])

  // Form input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" || type === "range" ? Number(value) :
              type === "checkbox" ? checked : value,
    }));
  };

  // Validate form inputs and update error object
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

  // Form submission handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // If no errors
    if (validateForm()) {
      const newTask: FormData = {
        id: Date.now(),
        ...formData,
      };
      
      // Add new tasks to array of tasks
      setTasks([...tasks, newTask]);

      // Reset form fields
      setFormData({
        activity: "",
        price: 0,
        activityType: "education",
        bookingReq: false,
        accessibility: 0.5
      });

    }
  };

  // Remove task button handler
  const handleDelete = (id: number) => {
    // Filter out deleted task from task array
    const updatedTasks = tasks.filter((task) => task.id !== id);

    // Update task array with removed task filtered out
    setTasks(updatedTasks);
  }

  return (
    <div>
      {/**Form to add task */}
      <form onSubmit={handleSubmit} className="form-container py-16">
        <h2 className="text-center">Activity Form</h2>
        
        {/**Activity name field */}
        <div className="form-group">
          <label>Activity</label>
          <input type="text" name="activity" value={formData.activity} onChange={handleChange} className="form-input" />
          {errors.activity && <p className="form-error">{errors.activity}</p>}
        </div>

        {/**Activity type dropdown */}
        <div className="form-group">
          <label>Activity Type</label>
          <select name="activityType" value={formData.activityType} onChange={handleChange} className="form-input">
            {activityTypes.map((type) => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
          {errors.activityType && <p className="form-error">{errors.activityType}</p>}
        </div>

        {/**Activity price field */}
        <div className="form-group">
          <label>Price</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" min="0" className="form-input" />
          {errors.price && <p className="form-error">{errors.price}</p>}
        </div>

        {/**Acessibility range slider */}
        <div className="form-group">
          <label>Accessibility (0.0 - 1.0)</label>
          <input type="range" name="accessibility" min="0" max="1" step="0.1" value={formData.accessibility} onChange={handleChange} className="form-range" />
          <p className="text-white">Selected: {formData.accessibility.toFixed(1)}</p>
          {errors.accessibility && <p className="form-error">{errors.accessibility}</p>}
        </div>

        {/**Booking required checkbox */}
        <div className="form-group flex items-center">
          <input type="checkbox" name="bookingReq" checked={formData.bookingReq} onChange={handleChange} className="form-checkbox" />
          <label className="ml-2">Booking Required</label>
        </div>

        {/**Form submit button */}
        <button type="submit" className="form-button">Submit</button>
      </form>

      {/**Tasks display */}
      <div className="mt-8">
          <h2 className="text-center">Saved Tasks</h2>
          <h3 className="text-center">Task count: {tasks.length}</h3>
          {/**List of task entries with associated delete button */}
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
