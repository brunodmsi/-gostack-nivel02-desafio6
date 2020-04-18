import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async findOrCreate(title: string): Promise<Category> {
    const category = await this.findOne({
      where: { title },
    });

    if (category) {
      return category;
    }

    const createdCategory = this.create({
      title,
    });

    await this.save(createdCategory);

    return createdCategory;
  }
}

export default CategoriesRepository;
