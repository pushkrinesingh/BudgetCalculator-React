import React from "react";
import { MdCurrencyRupee } from "react-icons/md";
import CategorySelector from "./CategorySelector";
import "./AddTransaction.css"
const AddTransaction = ({
  incometype,
  setIncomeType,
  currency,
  setCurrency,
  amount,
  setAmount,
  description,
  setDescription,
  category,
  setCategory,
  AddIncome,
  user,
}) => {
  return (
    <div className="Add_transaction">
      <h1>Add Transaction</h1>

      <label>Type</label>
      <div className="transaction_toggle">
        <button
          type="button"
          className={`toggle_btn ${incometype === "income" ? "active" : ""}`}
          onClick={() => setIncomeType("income")}
        >
          Income
        </button>

        <button
          type="button"
          className={`toggle_btn ${incometype === "expense" ? "active" : ""}`}
          onClick={() => setIncomeType("expense")}
        >
          Expense
        </button>
      </div>
      <label>Currency</label>
      <div className="currency_toggle">
        <button
          type="button"
          className={`toggle_btn ${currency === "INR" ? "active" : ""}`}
          onClick={() => setCurrency("INR")}
        >
          ₹ INR
        </button>

        <button
          type="button"
          className={`toggle_btn ${currency === "USD" ? "active" : ""}`}
          onClick={() => setCurrency("USD")}
        >
          $ USD
        </button>
      </div>

      <label>Amount {currency === "USD" ? "($)" : "(₹)"}</label>
      <input
        type="number"
        placeholder="0.00"
        onChange={(e) => setAmount(e.target.value)}
        value={amount}
        min="0"
        step="0.01"
      />

      <label>Description</label>
      <input
        type="text"
        placeholder="e.g. Groceries, Salary…"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
      />

      {incometype && amount && (
        <CategorySelector category={category} setCategory={setCategory} />
      )}

      <button
        className="AddExpense"
        onClick={AddIncome}
        disabled={!user || !incometype || !currency || !amount || !description}
      >
        {incometype === "income"
          ? `Add Income (${currency || "—"})`
          : incometype === "expense"
            ? `Add Expense (${currency || "—"})`
            : "Add Transaction"}
      </button>
    </div>
  );
};

export default AddTransaction;
