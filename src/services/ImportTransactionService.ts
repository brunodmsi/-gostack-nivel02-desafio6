/* eslint-disable no-restricted-syntax */
import fs from 'fs';
import path from 'path';
import csv from 'csvtojson';

import Transaction from '../models/Transaction';

import CreateTransactionService from './CreateTransactionService';

import uploadConfig from '../config/upload';

interface TransactionRequest {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionService {
  public async execute(csvFilename: string): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService();

    const filePath = path.join(uploadConfig.directory, csvFilename);

    const csvJson = await csv().fromFile(filePath);

    await fs.promises.unlink(filePath);

    const transactions: Transaction[] = [];

    async function createTransactions(
      transactionsArray: TransactionRequest[],
    ): Promise<void> {
      for (const transaction of transactionsArray) {
        const { title, type, value, category } = transaction;

        // eslint-disable-next-line no-await-in-loop
        const response = await createTransaction.execute({
          title,
          type,
          category,
          value,
        });

        transactions.push(response);
      }
    }

    await createTransactions(csvJson);

    return transactions;
  }
}

export default ImportTransactionService;
