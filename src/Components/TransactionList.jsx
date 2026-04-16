import React from "react";
import { MdCurrencyRupee } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import "./TransactionList.css"
const TransactionList = ({
  filterTransaction,
  setFilter,
  DeleteTrans,
  activeFilter,
}) => {
  return (
    <div className="Transaction_history">
      <h1>Transaction History</h1>
      <div className="Buttons">
        <button
          className={activeFilter === "All" ? "filter-active" : ""}
          onClick={() => setFilter("All")}
        >
          All
        </button>
        <button
          className={activeFilter === "USD" ? "filter-active" : ""}
          onClick={() => setFilter("USD")}
        >
          $USD
        </button>
        <button
          className={activeFilter === "INR" ? "filter-active" : ""}
          onClick={() => setFilter("INR")}
        >
          <MdCurrencyRupee />
          INR
        </button>
      </div>

      <div className="transaction-scroll">
        {filterTransaction.length === 0 && (
          <p
            style={{
              color: "var(--text-muted)",
              textAlign: "center",
              marginTop: "20px",
              fontSize: "0.875rem",
            }}
          >
            No transactions found.
          </p>
        )}
        {filterTransaction.map((obj) => (
          <div key={obj.id} className="transaction-item">
            <div className="top_row">
              <span className="transaction-title">{obj.Title}</span>

              <span className="tag category">{obj.category}</span>

              <div className="right_section">
                <span
                  className={`amount ${obj.type === "income" ? "green" : "red"}`}
                >
                  {obj.type === "income" ? "+" : "-"}
                  <MdCurrencyRupee />
                  {obj.TransactionAmount.toFixed(2)}
                </span>

                <ImCancelCircle
                  onClick={() => DeleteTrans(obj.id)}
                  className="Deletebtn"
                />
              </div>
            </div>

            <div className="bottom_row">
              <span className="tag currency">{obj.currencyType}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
