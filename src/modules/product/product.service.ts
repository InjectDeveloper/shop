import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductEntity } from "./entities/product.entity";
import { ItemService } from "../item/item.service";
import { UserAvatarsArray } from "../user/constants/user.avatars.array";
import { OrderEntity } from "../order/entities/order.entity";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
    private readonly itemService: ItemService
  ) {}

  async add(itemId, data) {
    const item = await this.itemService.getItemById(itemId)
    const products = data.split(";")

    if(!item) {
      throw new HttpException("Товара не существует", HttpStatus.BAD_REQUEST)
    }

    for (let i = 0; i < products.length; i++) {
      let newProduct = await this.productRepository.create({
        item: item,
        data: products[i]
      })
      await this.productRepository.save(newProduct)
      await this.itemService.addToLeft(itemId, 1)
    }

    return await this.itemService.getItemByIdWithProducts(itemId)
  }

  async getForSale(itemId, amount) {
    const item = await this.itemService.getItemByIdWithProducts(itemId)

    if(!item) {
      throw new HttpException("Товара не существует", HttpStatus.BAD_REQUEST)
    }

    Logger.log(item.products.find((elem) => {
      if (elem.isSale == false) {
        return elem
      }
    }))

    const productsAmount = item.products.find((elem) => {
      if (elem.isSale == false) {
        return elem
      }
    })

    if(productsAmount < amount + 1 || productsAmount == undefined) {
      throw new HttpException("Нету столько товара", HttpStatus.BAD_REQUEST)
    }

    let products = []
    for(let i = 0; i < amount; i++) {

      const findedProduct = await this.productRepository.findOne({
        where: {
          isSale: false
        }
      })
      findedProduct.isSale = true
      await this.productRepository.save(findedProduct)

      products.push(findedProduct)

      await this.itemService.minToLeft(itemId, 1)
    }

    return products[0]
  }

  async addInOrder(order: OrderEntity, productId) {
    let product = await this.productRepository.findOne({
      where: {
        id: productId
      }
    })
    product.inOrder = order
    await this.productRepository.save(product)
  }

  async getLeft(productId){
    return await this.productRepository.find({
      where: {
        isSale: false
      }
    })
  }

  async deleteRelations(order:OrderEntity) {
    let products = await this.productRepository.find({
      where: {
        inOrder: order
      }
    })

    for (let i = 0; i < products.length; i++) {
      let pr = await this.productRepository.findOne({
        where: {
          id: products[i].id
        }
      })
      pr.inOrder = null
      await this.productRepository.save(pr)
    }
  }
}
