"use client";

import React, { useState } from "react";
import { X, MapPin, Phone } from "lucide-react";

// Import the Create Service Page component
import CreateServicePage from "./create-service/page";

interface Service {
  id: string;
  category: string;
  title: string;
  description: string;
  price: string;
  location: string;
  contact: string;
  postedDate: string;
  image?: string;
}

const categoryColors: Record<string, string> = {
  Tutor: "bg-blue-100 text-blue-700",
  Tailor: "bg-orange-100 text-orange-700",
  "Car washing": "bg-purple-100 text-purple-700",
  Cooking: "bg-orange-100 text-orange-700",
  Cleaning: "bg-green-100 text-green-700",
  Others: "bg-gray-100 text-gray-700",
};

const mockServices: Service[] = [
  {
    id: "1",
    category: "Tutor",
    title: "Maths Tuition (Class 8-10)",
    description:
      "2 hours daily personalized sessions focused on competitive base and board exams with weekly assessments.",
    price: "₹ 1500/month",
    location: "Andheri East",
    contact: "+91 98765 43210",
    postedDate: "Posted 2 days",
    image: "/api/placeholder/200/150",
  },
  {
    id: "2",
    category: "Cooking",
    title: "Daily Home Tiffin",
    description:
      "Fresh lunch and dinner service Mon-Fri. Healthy, home-cooked food delivered to your office or home.",
    price: "₹ 2500/month",
    location: "Vile Parle West",
    contact: "+91 99887 66554",
    postedDate: "Posted 1 week",
    image: "/api/placeholder/200/150",
  },
  {
    id: "3",
    category: "Tailor",
    title: "Blouse & Dress Stitching",
    description:
      "Expert tailoring for ethnic wear. Custom fitting and design available. Doorstep pickup and delivery.",
    price: "Negotiable",
    location: "Bandra West",
    contact: "+91 87654 32109",
    postedDate: "Posted 3 days",
    image: "/api/placeholder/200/150",
  },
];

export default function DashboardPage() {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [formData, setFormData] = useState({
    category: "",
    customCategory: "",
    title: "",
    description: "",
    price: "",
    location: "",
    contact: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.category ||
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.location ||
      !formData.contact
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (formData.category === "Others" && !formData.customCategory) {
      alert("Please enter a custom category");
      return;
    }

    // Create new service
    const newService: Service = {
      id: Date.now().toString(),
      category:
        formData.category === "Others"
          ? formData.customCategory
          : formData.category,
      title: formData.title,
      description: formData.description,
      price: formData.price,
      location: formData.location,
      contact: formData.contact,
      postedDate: "Posted just now",
      image: "/api/placeholder/200/150",
    };

    // Add to top of list
    setServices((prev) => [newService, ...prev]);

    // Reset form
    setFormData({
      category: "",
      customCategory: "",
      title: "",
      description: "",
      price: "",
      location: "",
      contact: "",
    });
  };

  const handleDelete = (id: string) => {
    setServices((prev) => prev.filter((service) => service.id !== id));
  };

  const getCategoryColor = (category: string): string => {
    return categoryColors[category] || "bg-gray-100 text-gray-700";
  };

  return <CreateServicePage />;
}
