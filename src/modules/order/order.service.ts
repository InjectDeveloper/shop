
import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { UserEntity } from "../user/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrderEntity } from "./entities/order.entity";
import { ProductService } from "../product/product.service";
import { ItemService } from "../item/item.service";
import { UserService } from "../user/user.service";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity) private readonly orderRepository: Repository<OrderEntity>,
    private readonly productService: ProductService,
    private readonly itemService: ItemService,
    private readonly userService: UserService
  ) {}

  async create(user: UserEntity, itemsId: Array<number>) {
    let newOrder = await this.orderRepository.create({
      user: user
    })
    await this.orderRepository.save(newOrder)

    let price = 0

    for(let i = 0; i < itemsId.length; i++) {
      const item = await this.itemService.getItemById(itemsId[i])
      if (!item) {
        throw new HttpException("Товара не существует", HttpStatus.BAD_REQUEST);
        await this.orderRepository.delete(newOrder)
      }

      price = price + item.price
    }

    if (price > user.balance) {
      throw new HttpException("Недостаточно баланса", HttpStatus.BAD_REQUEST)
      await this.orderRepository.delete(newOrder)
    }
    newOrder = await this.orderRepository.findOne({
      where: {
        id: newOrder.id
      }
    })
    newOrder.sum = price
    await this.orderRepository.save(newOrder)

    let products = []
    for(let i = 0; i < itemsId.length; i++) {
      const pr = await this.productService.getForSale(itemsId[i], 1)
      products.push(pr)
      await this.productService.addInOrder(newOrder, pr.id)
    }

    newOrder = await this.orderRepository.findOne({
      where: {
        id: newOrder.id
      }
    })
    newOrder.products = products
    await this.orderRepository.save(newOrder)

    await this.userService.updateBalance(user.id, -price)

    return newOrder
  }

}

