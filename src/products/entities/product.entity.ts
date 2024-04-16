//Un entitie es una clase que representa el objeto en la base de datos

import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name: 'products'})
export class Product {

    @ApiProperty({
        description: 'Id del producto',
        example: '1',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Título del producto',
        example: "Mario's Shirt",
        uniqueItems: true,
    })
    @Column('text', {
        unique:true,
    })
    title: string;

    @ApiProperty({
        description: 'Precio del producto',
        example: 0
    })
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty({
        description: 'Descripción del producto',
        example: 'Incididunt do aute reprehenderit velit elit ea ea.'
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        description: 'Slug del producto',
        example: 'marios_shirt',
        uniqueItems: true,
    })
    @Column('text', {
        unique: true,
    })
    slug: string;

    @ApiProperty({
        description: 'Inventario del producto',
        example: 0
    })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        description: 'Tallas disponibles',
        example: ["M", "XL"]
    })
    @Column('text', {
        array: true,
    })
    sizes: string[];

    @ApiProperty({
        description: 'Genero del producto',
        example: 'men'
    })
    @Column('text')
    gender: string;

    @ApiProperty({
        description: 'Etiquetas del producto',
        example: ['shirt']
    })
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];


    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        {cascade: true, eager: true},
    )
    images?:ProductImage[];

    @ManyToOne(
        () => User,
        user => user.product,
        {eager: true}
    )
    user: User


    @BeforeInsert()
    @BeforeUpdate()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title
                                      .toLowerCase()
                                      .replaceAll(' ','_')
                                      .replaceAll("'",'')
          } else {
            this.slug = this.slug
                                      .toLowerCase()
                                      .replaceAll(' ','_')
                                      .replaceAll("'",'')
          }
    }

    // @BeforeUpdate()
    // checkSlugUpdate() {
    //     this.slug = this.slug
    //                                   .toLowerCase()
    //                                   .replaceAll(' ','_')
    //                                   .replaceAll("'",'')
    // }


}
