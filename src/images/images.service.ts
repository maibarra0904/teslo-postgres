import { BadRequestException, Injectable } from '@nestjs/common';
import { Product } from 'src/products/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { ProductsService } from './../products/products.service';
import { ConfigService } from '@nestjs/config';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ImagesService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository:Repository<Product>,

    private readonly productsService: ProductsService,

    private readonly configService: ConfigService,
  ) {}

  async uploadFile(id: string, file: Express.Multer.File, user: User): Promise<Product> {
    // Verificar el fichero de imagen subido
    console.log(id)
    if (!file) {
      throw new BadRequestException('No se ha subido la imagen');
    }
    let producto: Product;
    const url: string = this.configService.get('HTTP_API')+'/images/'+file.filename
    try {
      if (isUUID(id)) {
        producto = await this.productRepository.findOneBy({id: id});
        const imagenes = producto.images.map(image => image.url)
        imagenes.push(url)
        const imagenesObject = {images: imagenes}
        console.log({images: imagenes});
        await this.productsService.update(id, imagenesObject, user)
      }
      return this.productsService.findOne(id)  
    } catch (error) {
      
      throw new ExceptionsHandler(error.message);
    }
    
  }
}
