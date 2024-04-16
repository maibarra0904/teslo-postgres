import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/entities';
import { ProductsModule } from 'src/products/products.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService],
  imports: [
    TypeOrmModule.forFeature([Product]),
    ProductsModule,
    ConfigModule,
  ],
  
})
export class ImagesModule {}
