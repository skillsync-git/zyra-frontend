"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  HouseDoorFill,
  CartCheckFill,
  Grid3x3GapFill,
  BoxSeam,
  FolderFill,
  GiftFill,
  TagsFill,
  ClockHistory,
  EnvelopeFill,
  TicketPerforatedFill
} from "react-bootstrap-icons";

const AdminSidebar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const [categoryOpen, setCategoryOpen] = useState(false);

  // Auto-expand dropdown if a category is selected
  useEffect(() => {
    if (currentCategory) {
      setCategoryOpen(true);
    }
  }, [currentCategory]);

  const navItems = [
    { href: "/admin", label: "Home", icon: <HouseDoorFill className="me-2" /> },
    // { href: "/adminusers", label: "Customers", icon: <People className="me-2" /> },
    { href: "/adminorders", label: "Orders", icon: <CartCheckFill className="me-2" /> },
    { href: "/admincategories", label: "Saree Categories", icon: <Grid3x3GapFill className="me-2" /> },
    { href: "/adminproducts", label: "Saree Products", icon: <BoxSeam className="me-2" /> },
    { href: "/admingiftcategory", label: "Gift Categories", icon: <FolderFill className="me-2" /> },
    { href: "/admingift", label: "Gift Products", icon: <GiftFill className="me-2" /> },
    { href: "/adminoffers", label: "Offers", icon: <TagsFill className="me-2" /> },
    { href: "/adminlimitedsales", label: "Limited Sale", icon: <ClockHistory className="me-2" /> },
    { href: "/adminmessages", label: "Messages", icon: <EnvelopeFill className="me-2" /> },
    // { href: "/adminco", label: "Coupon", icon: <TicketPerforatedFill className="me-2" /> },
  ];

  // const categories = [
  //   { name: "Kanjivaram", icon: <Tag className="me-2" /> },
  //   { name: "Banarasi", icon: <Tag className="me-2" /> },
  //   { name: "Tussar", icon: <Tag className="me-2" /> },
  //   { name: "Patola", icon: <Tag className="me-2" /> },
  // ];

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark"
      style={{ width: "280px", minHeight: "100vh", position:"fixed" }}
    >
      <Link
        href="/"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
      >
        <span className="fs-4">Admin Panel</span>
      </Link>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        {/* Main menu items */}
        {navItems.map(({ href, label, icon }) => {
          const isActive =
            href === "/adminproducts"
              ? pathname === "/adminproducts" && !currentCategory
              : pathname === href;

          return (
            <li key={label} className="nav-item">
              <Link
                href={href}
                className={`nav-link text-white d-flex align-items-center ${
                  isActive ? "active" : ""
                }`}
              >
                {icon}
                <span>{label}</span>
              </Link>
            </li>
          );
        })}

        {/* Categories Dropdown */}
        {/* <li className="nav-item mt-2">
          <button
            onClick={() => setCategoryOpen(!categoryOpen)}
            className={`nav-link text-white d-flex justify-content-between align-items-center w-100 btn btn-dark ${
              currentCategory ? "active" : ""
            }`}
          >
            <div className="d-flex align-items-center">
              <People className="me-2" />
              <span>Categories</span>
            </div>
            {categoryOpen ? <ChevronUp /> : <ChevronDown />}
          </button>
          {categoryOpen && (
            <ul className="nav flex-column ms-3 mt-1">
              {categories.map(({ name, icon }) => (
                <li key={name} className="nav-item">
                  <Link
                    href={`/adminproducts?category=${name.toLowerCase()}`}
                    className={`nav-link text-white d-flex align-items-center ${
                      currentCategory === name.toLowerCase() ? "active" : ""
                    }`}
                  >
                    {icon}
                    <span>{name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li> */}
      </ul>
      <hr />
    </div>
  );
};

export default AdminSidebar;