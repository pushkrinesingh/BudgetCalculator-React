import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import Header from "../Components/Header";
import AddTransaction from "../Components/AddTransaction";
import TransactionList from "../Components/TransactionList";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";

const Calculator = ({ transactions, setTransactions, user, setUser }) => {
  const [incometype, setIncomeType] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [UsdRate, setUsdRate] = useState(0);
  const [Filter, setFilter] = useState("All");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CurrConversion();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const q = query(collection(db, "transactions"), where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTransactions(data);
    };
    fetchData();
  }, [user]);

  if (loading) return <h2>Loading...</h2>;

  async function CurrConversion() {
    try {
      const response = await fetch("https://open.er-api.com/v6/latest/USD");
      const result = await response.json();
      setUsdRate(result.rates.INR);
    } catch (err) {
      console.error("Failed to fetch USD rate:", err);
    }
  }

  async function AddIncome() {
    if (!user) { alert("Please login first 🔐"); return; }
    if (!incometype) { alert("Please select a transaction type"); return; }
    if (!currency) { alert("Please select a currency"); return; }
    if (!amount || Number(amount) <= 0) { alert("Please enter a valid amount"); return; }
    if (!description.trim()) { alert("Please enter a description"); return; }

    let convertedAmount = Number(amount);
    if (currency === "USD") {
      if (!UsdRate) { alert("USD rate unavailable. Please refresh and try again."); return; }
      convertedAmount = Number(amount) * UsdRate;
    }
    convertedAmount = Math.round(convertedAmount * 100) / 100;

    const obj = {
      Title: description.trim(),
      currencyType: currency,
      type: incometype,
      TransactionAmount: convertedAmount,
      category: category || "Other",
      userId: user.uid,
    };

    const docRef = await addDoc(collection(db, "transactions"), obj);
    setTransactions((prev) => [...prev, { ...obj, id: docRef.id }]);

    setIncomeType("");
    setCurrency("INR");
    setAmount("");
    setDescription("");
    setCategory("");
  }

  const totalIncome = transactions.reduce(
    (acc, obj) => (obj.type === "income" ? acc + obj.TransactionAmount : acc), 0
  );
  const totalExpense = transactions.reduce(
    (acc, obj) => (obj.type === "expense" ? acc + obj.TransactionAmount : acc), 0
  );
  const totalBalance = totalIncome - totalExpense;

  const filterTransaction =
    Filter === "All"
      ? transactions
      : transactions.filter((obj) => obj.currencyType === Filter);

  async function DeleteTrans(id) {
    try {
      await deleteDoc(doc(db, "transactions", id));
      setTransactions((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete transaction");
    }
  }

  return (
    <div className="Container">
      <h1>Budget Tracker</h1>
      <p>Track your income and expenses in multiple currencies</p>

      <Header
        totalBalance={totalBalance}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        UsdRate={UsdRate}
        onRefreshRate={CurrConversion}
      />

      <div className="Transaction_box">
        <AddTransaction
          incometype={incometype}
          setIncomeType={setIncomeType}
          currency={currency}
          setCurrency={setCurrency}
          amount={amount}
          setAmount={setAmount}
          description={description}
          setDescription={setDescription}
          category={category}
          setCategory={setCategory}
          AddIncome={AddIncome}
          user={user}
        />
        <TransactionList
          filterTransaction={filterTransaction}
          setFilter={setFilter}
          DeleteTrans={DeleteTrans}
          activeFilter={Filter}
        />
      </div>
    </div>
  );
};

export default Calculator;