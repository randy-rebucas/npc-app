"use server";

import { handleAsync } from '@/lib/errorHandler';
import Transaction, { ITransaction } from "../models/Transaction";
import connect from "@/lib/db";
import { IUser } from "../models/User";
import { ValidationError, DatabaseError, NotFoundError } from "@/lib/errors";

interface GetTransactionsParams {
  page: number;
  search?: string;
  limit?: number;
  status?: string;
}

interface TransactionQuery {
  $or?: {
    stripeTransactionId?: { $regex: string; $options: string } | string;
  }[];
  status?: string;
}

interface GetTransactionsResponse {
  transactions: {
    _id: string;
    user: string;
    amount: number;
    currency: string;
    status: string;
    stripeTransactionId: string;
    createdAt: Date;
  }[];
  total: number;
}

export async function getTransactions({
  page = 1,
  search = "",
  status = "all",
  limit = 10,
}: GetTransactionsParams): Promise<GetTransactionsResponse> {
  if (page < 1 || limit < 1) {
    throw new ValidationError('Invalid pagination parameters');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      
      // Build query conditions
      const query: TransactionQuery = {};

      if (search) {
        query.$or = [
          { stripeTransactionId: { $regex: search, $options: "i" } },
        ];
      }

      if (status !== "all") {
        query.status = status;
      }

      // Execute query with pagination
      const skip = (page - 1) * limit;

      const [transactions, total] = await Promise.all([
        Transaction.find(query)
          .populate("user")
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean(),
        Transaction.countDocuments(query),
      ]);

      return {
        transactions: (transactions as unknown as ITransaction[]).map((transaction) => ({
          _id: transaction._id.toString(),
          user: (transaction.user as IUser).email,
          amount: transaction.amount,
          currency: transaction.currency,
          status: transaction.status,
          stripeTransactionId: transaction.stripeTransactionId,
          createdAt: transaction.createdAt,
        })),
        total,
      };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to fetch transactions: ${error.message}`);
  }

  if (!result) {
    throw new NotFoundError('No transactions found');
  }

  return result;
}
