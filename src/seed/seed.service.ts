import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async executeSeed() {

    await this.deleteTables();

    const adminUser = await this.insertUsers();

    await this.insertNewProducts(adminUser)
    return `This action returns all seed`;
  }

  private async deleteTables() {

    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();

    await queryBuilder
                    .delete()
                    .where({})
                    .execute();


  }

  private async insertUsers() {

    const seerUsers = initialData.users;

    const users: User[] = [];

    seerUsers.forEach(
      user => users.push( this.userRepository.create(user))
    )

    const dbUsers = await this.userRepository.save(seerUsers);

    return dbUsers[0]
  }

  private async insertNewProducts( user: User) {
    await this.productsService.deleteAllProducts()

    const products = initialData.products;

    // // Una forma de hacer la insercion masiva
    for (let i = 0; i < products.length; i++) {
      await this.productsService.create(products[i], user)
    }

    //Otra forma mas eficiente de hacer la insercion masiva
    const productsPromises = [];

    // products.forEach(product => {
    //   productsPromises.push(this.productsService.create(product))
    // });

    await Promise.all(productsPromises);
      

    return true;
  }

}
