"use client";

import React, { useEffect } from "react";
import "../CSS/Header.css";
import Link from "next/link";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = () => {
  const headingArray = [
    { heading: "Dashboard", link: "/dashboard" },
    {
      heading: "Exams",
      link: "/exams",
      // subHeading: [
      //   { text: "Create a Exam", link: "/createExam" },
      //   { text: "Add Exam Result", link: "/examResult" },
      // ],
    },
    { heading: "Enquiry", link: "/enquiry" },
    { heading: "Batches", link: "/batches" },
    { heading: "Students", link: "/students" },
    {
      heading: "Lectures",
      subHeading: [
        { text: "Add Lectures", link: "/addLectures" },
        { text: "View Lectures", link: "/viewLectures" },
      ],
    },
    { heading: "Courses", link: "/courses" },
  ];

  const settingArray = [
    {
      text: "Logout",
      link: "/logout",
    },
  ];

  const expandHandler = () => {
    const menuItems: HTMLElement | null = document.getElementById("menuItems");
    const navbar: HTMLElement | null = document.getElementById("navbar");

    const isMenuHidden = menuItems?.classList.contains("menuHidden");
    if (isMenuHidden) {
      menuItems?.classList.remove("menuHidden");
      menuItems?.classList.add("menuShow");
      navbar?.classList.remove("navOriginalHeight");
      navbar?.classList.add("navExpandedHeight");
    } else {
      menuItems?.classList.add("menuHidden");
      menuItems?.classList.remove("menuShow");
      navbar?.classList.add("navOriginalHeight");
      navbar?.classList.remove("navExpandedHeight");
    }
  };

  useEffect(() => {
    const menuButton = document.getElementById("menuButton");
    menuButton?.addEventListener("click", expandHandler);
    return () => {
      menuButton?.removeEventListener("click", expandHandler);
    };
  }, []);

  return (
    <div className="w-full bg-gray-800 navOriginalHeight" id="navbar">
      <div className="md:hidden h-full block">
        <button id="menuButton" className="h-12 text-center ml-4">
          <img src="/menu.png" alt="menu" className="h-6 w-6" />
        </button>

        <div id="menuItems" className="menuHidden h-fit flex-col pb-4">
          {[
            ...headingArray,
            { heading: "Account", subHeading: settingArray },
          ].map((heading, index) => {
            return (
              <div key={index}>
                <button
                  className="pl-4 py-2 flex items-center dropdown-subHeading"
                  onClick={() => {
                    heading.subHeading !== undefined &&
                      document
                        .getElementById(heading.heading)
                        ?.classList.toggle("subHeadingHidden");
                  }}
                >
                  <Link
                    href={heading.link !== undefined ? heading.link : ""}
                    className="text-white"
                  >
                    {heading.heading}
                  </Link>
                  {heading.subHeading !== undefined && (
                    <img src="/triangleDown.png" className="w-2 h-2 ml-2" />
                  )}
                </button>
                {heading.subHeading !== undefined && (
                  <ul className="pl-8 subHeadingHidden" id={heading.heading}>
                    {heading.subHeading.map((subHeading, index) => (
                      <li className="py-2" key={index}>
                        <Link className="text-white " href={subHeading.link}>
                          {subHeading.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className=" h-12 hidden md:flex">
        <div className="grow flex">
          {headingArray.map((heading, index) => (
            <div
              key={index}
              className="relative h-full flex items-center headingContainer mx-4 bg-gray-800"
            >
              <Link
                href={heading.link !== undefined ? heading.link : ""}
                className="text-gray-400 font-medium"
              >
                {heading.heading}
              </Link>
              {heading.subHeading !== undefined && (
                <div className="triangle"></div>
              )}
              {heading.subHeading && (
                <ul
                  className="absolute top-12 left-4 z-10 bg-white w-52 border rounded hidden my-auto"
                  id={heading.heading}
                >
                  {heading.subHeading.map((subHeading, index) => (
                    <li className="p-2 hover:bg-gray-200" key={index}>
                      <Link href={subHeading.link}>{subHeading.text}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="relative px-4 flex items-center settingContainer">
          <FontAwesomeIcon
            icon={faGear}
            className="hover:text-white text-gray-400 settingIcon"
          />
          <div className="triangle"></div>
          <ul className="absolute top-12 right-0 z-10 bg-white w-52 border rounded hidden my-auto setting">
            {settingArray.map(({ text, link }, index) => (
              <li className="p-2 hover:bg-gray-200" key={index}>
                <Link href={link}>{text}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
