"use client";  // Add this directive to mark the file as a client component

import CreatePassword from "@/app/componenets/createPassword";
import PasswordList from "@/app/componenets/PasswordList";
import { SecurityFeatures } from "@/utils/api-methods";
import React, { useState } from "react";

const PasswordManager = () => {
  const [activeScreen, setActiveScreen] = useState("list");
  const [passwords, setPasswords] = useState([]);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  const handleAddPassword = (newPassword) => {
    setPasswords([...passwords, newPassword]);
    setActiveScreen("list");
  };

  return (
    <>
      {activeScreen === "list" && (
        <PasswordList
          passwords={passwords}
          onCreateNew={() => setActiveScreen("create")}
        />
      )}
      {activeScreen === "create" && (
        <CreatePassword
          onSavePassword={handleAddPassword}
          result={result}
        />
      )}
    </>
  );
};

export default PasswordManager;
