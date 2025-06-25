import AuthContext from "@/components/AuthContext";
import React, { useContext, useState } from "react";
// import { format } from 'date-fns';
// import styles from "@/styles/Dashboard.module.css";
import { DataTable } from "../table/data-table";
import { transactionsColumns } from "../table/columns";

const Transactions = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <p className="mt-3">Recent Transactions</p>
      <DataTable
        columns={transactionsColumns}
        data={user?.trans || []}
        isLoading={false}
        empty="No recent transaction available"
        pageSize={5}
      />
    </>
  );
};

export default Transactions;
