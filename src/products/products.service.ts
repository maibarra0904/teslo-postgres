import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { isUUID } from 'class-validator';
import { ProductImage } from './entities';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource

  ) { }

  
  async create(createProductDto: CreateProductDto, user: User) {
    
    try {

      const {images = [], ...productDetails} = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        user,
        images: images.map(image => this.productImageRepository.create({url: image})),
      })

      await this.productRepository.save(product)

      return {...product, images}
      
    } catch (error) {
      this.handleDBExceptions(error)
    }

  }

  async findAll( paginationDto: PaginationDto ) {

    const { limit = undefined , offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      }
    })

    return products.map(({images, ...rest}) => ({
      ...rest,
      images: images.map(image => image.url)
    }))
  }

  async findOne(term: string) {
    let producto: Product;

    if (isUUID(term)) {
      producto = await this.productRepository.findOneBy({id: term});
    } else {
      //producto = await this.productRepository.findOneBy({slug: term});
      const queryBuilder = this.productRepository.createQueryBuilder('prod');

      producto = await queryBuilder.where('UPPER(title) =:title or slug = :slug', 
        { 
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        }
      ).leftJoinAndSelect('prod.images', 'prodImages').getOne();
    }
    
    if (!producto) throw new BadRequestException("No hay un producto con ese id o slug")

    return producto;
    
  }

  async findOnePlain (term: string) {
    const {images =[], ...rest} = await this.findOne(term)

    return {
      ...rest,
      images: images.map(image => image.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {

    const {images, ...toUpdate} = updateProductDto;
    console.log(updateProductDto)

    const product: Product = await this.productRepository.preload({
      id,
      ...toUpdate
    })

    if (!product) throw new NotFoundException(`Product with id ${id} not found`)

    //Create qury runner
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if(images) {
        await queryRunner.manager.delete(ProductImage, {product: {id}})
        
        product.images = images.map(image =>
            this.productImageRepository.create({url: image})
          )
      }

      product.user = user;

      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      //await this.productRepository.save(product)
      return this.findOnePlain(id);  

    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error)
    }
    
  
  }

  async remove(id: string) {

      try {
        //await this.productRepository.delete(id)
        const product = await this.findOne(id);
        console.log(product)
        await this.productRepository.remove(product)
        return {msg: "Deleted"}}
       catch (error) {
        throw new BadRequestException("Hubo un problema")
        
      }
  }

  private handleDBExceptions (error: any) {
    if( error.code === '23505') throw new BadRequestException(error.detail)

      this.logger.error(error.detail)
      throw new InternalServerErrorException('Hubo un error al crear un producto')
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product')

    try {
      return await query.delete()
                        .where({})
                        .execute();
      
    } catch (error) {
      this.handleDBExceptions(error);
    }

  }
}
