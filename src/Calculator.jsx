import React, { useEffect, useState } from "react";
import { MdCurrencyRupee } from "react-icons/md";
const Calculator = () => {
  const [incometype, setIncomeType] = useState("");
  const [currency, setCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [Transaction, setTransaction] = useState([]);
  const [Filter, setFilter] = useState("all");
  const [Rate, setRate] = useState(0);

  useEffect(() => {
    RateConversion();
  }, []);
  async function RateConversion() {
    const response = await fetch("https://open.er-api.com/v6/latest/USD");
    const result = await response.json();
    setRate(result.rates.INR);
  }
  function AddIncome() {
    let numericAmount = Number(amount);
    let convertedAmount = numericAmount;

    if (currency === "USD") {
      convertedAmount = numericAmount * Rate;
    }
    const obj = {
      id: Date.now(),
      Title: description,
      currencyType: currency,
      type: incometype,
      TransactionAmount: convertedAmount,
    };
    console.log(obj);

    setTransaction([...Transaction, obj]);
    setIncomeType("");
    setAmount("");
    setCurrency("");
    setDescription("");
  }
  const totalIncome = Transaction.reduce((acc, obj) => {
    if (obj.type === "income") {
      return acc + obj.TransactionAmount;
    }
    return acc;
  }, 0);

  const totalExpense = Transaction.reduce((acc, obj) => {
    if (obj.type === "expense") {
      return acc + obj.TransactionAmount;
    }
    return acc;
  }, 0);

  const totalBalance = totalIncome - totalExpense;

  const FilteredTransactions =
    Filter === "all"
      ? Transaction
      : Transaction.filter((obj) => obj.currencyType === Filter);

  return (
    <div className="Container">
      <h1>BUDGET TRACKER</h1>
      <p>Keep Track your income and expenses in multiple currencies</p>
      <div className="Header">
        <h2>Balance overview (ALL amounts in INR)</h2>
        <p>
          1 USD = <MdCurrencyRupee />
          {Rate.toFixed(2)} INR
        </p>
        <h2 className="Total_balance">
          Total Balance:
          <p>
            <MdCurrencyRupee />
            {totalBalance.toFixed(2)}
          </p>
        </h2>
        <h3 className="Total_income">
          Total Income:
          <p>
            <MdCurrencyRupee />
            {totalIncome.toFixed(2)}
          </p>
        </h3>
        <h4 className="Total_expense">
          Total Expenses:
          <p>
            <MdCurrencyRupee />
            {totalExpense.toFixed(2)}
          </p>
        </h4>
      </div>
      <div className="Transaction_box">
        <div className="Add_transaction">
          <h1>Add Transaction</h1>
          <label htmlFor="">Type:</label>
          <select
            className="transaction_type"
            name=""
            id=""
            onChange={(e) => setIncomeType(e.target.value)}
            value={incometype}
          >
            <option value="">Select Income Type</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <label htmlFor="">Currency:</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="">Select Currency</option>

            <option value="INR">
              <MdCurrencyRupee />
              INR- Indian Rupee
            </option>
            <option value="USD">$USD- US Dollar</option>
          </select>
          <label htmlFor="">
            Amount(
            <MdCurrencyRupee />
            ):
          </label>
          <input
            type="number"
            placeholder="0.00"
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
          />
          <label htmlFor="">Description</label>
          <input
            type="text"
            placeholder="Enter Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          <button className="AddExpense" onClick={() => AddIncome()}>
            Add Expense(INR)
          </button>
        </div>
        <div className="Transaction_history">
          <h1>Transaction History</h1>
          <div className="Buttons">
            <button onClick={() => setFilter("all")}>All</button>
            <button onClick={() => setFilter("USD")}>$USD</button>
            <button onClick={() => setFilter("INR")}>
              <MdCurrencyRupee />
              INR
            </button>
          </div>
          {FilteredTransactions.map((obj) => {
            return (
              <div key={obj.id} className="transactionRow">
                <div className="leftPart">
                  <span className="title">{obj.Title}</span>
                  <span className="currencyTag">{obj.currencyType}</span>
                </div>
                <span
                  className={
                    obj.type === "income" ? "amountGreen" : "amountRed"
                  }
                >
                  {obj.type === "income" ? "+" : "-"}
                  <MdCurrencyRupee />
                  {obj.TransactionAmount.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
