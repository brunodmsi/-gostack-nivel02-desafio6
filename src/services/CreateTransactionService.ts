import { getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';

import TransactionRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';

import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionRepository);

    const actualBalance = await transactionsRepository.getBalance();

    if (type === 'outcome' && actualBalance.total - value < 0) {
      throw new AppError('Balance total cannot be under 0.');
    }

    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const transactionCategory = await categoriesRepository.findOrCreate(
      category,
    );

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id: transactionCategory.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
