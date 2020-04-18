import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const outcome = transactions.reduce(
      (sum, transaction) =>
        transaction.type === 'outcome' ? sum + transaction.value : sum,
      0,
    );
    const income = transactions.reduce(
      (sum, transaction) =>
        transaction.type === 'income' ? sum + transaction.value : sum,
      0,
    );
    const totalBalance = income - outcome;

    return {
      income,
      outcome,
      total: totalBalance,
    };
  }
}

export default TransactionRepository;
