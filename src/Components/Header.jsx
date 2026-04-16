import React, { useState, useEffect, useRef } from "react";
import { MdCurrencyRupee, MdRefresh } from "react-icons/md";
import "./Header.css"
const Header = ({
  totalBalance,
  totalIncome,
  totalExpense,
  UsdRate,
  onRefreshRate,
}) => {
  const [lastUpdated, setLastUpdated] = useState(null);
  const [cooldown, setCooldown] = useState(false);
  const [secondsAgo, setSecondsAgo] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const cooldownTimer = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastUpdated) {
        const diff = Math.floor((Date.now() - lastUpdated) / 1000);
        setSecondsAgo(diff);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  // BUG FIX: cooldown was never cleared — now resets after 60s
  const handleRefresh = async () => {
    if (cooldown) return;
    setSpinning(true);
    setCooldown(true);
    await onRefreshRate();
    setLastUpdated(Date.now());
    setSecondsAgo(0);
    setSpinning(false);

    cooldownTimer.current = setTimeout(() => setCooldown(false), 60000);
  };

  useEffect(() => {
    return () => {
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    };
  }, []);

  const formatAgo = (secs) => {
    if (secs === null) return null;
    if (secs < 60) return `Updated ${secs}s ago`;
    return `Updated ${Math.floor(secs / 60)}m ago`;
  };

  return (
    <div className="Header">
      <h2>Balance Overview — All amounts in INR</h2>
      <div className="usd-rate-row">
        <span className="usd-rate-text">
          1 USD = ₹{UsdRate ? UsdRate.toFixed(2) : "—"}
        </span>
        <button
          className={`refresh-btn ${cooldown ? "refresh-disabled" : ""}`}
          onClick={handleRefresh}
          title={
            cooldown ? "Wait 60s before refreshing again" : "Refresh USD rate"
          }
        >
          <MdRefresh className={spinning ? "spin" : ""} size={18} />
        </button>
        {secondsAgo !== null && (
          <span className="last-updated">{formatAgo(secondsAgo)}</span>
        )}
      </div>
      <div className="balance_grid">
        <div className="balance_card balance_card_blue">
          <h4>Total Balance</h4>
          <p className="balance">
            <MdCurrencyRupee />
            {totalBalance.toFixed(2)}
          </p>
        </div>

        <div className="balance_card balance_card_green">
          <h4>Total Income</h4>
          <p className="income">
            <MdCurrencyRupee />
            {totalIncome.toFixed(2)}
          </p>
        </div>

        <div className="balance_card balance_card_red">
          <h4>Total Expenses</h4>
          <p className="expense">
            <MdCurrencyRupee />
            {totalExpense.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
