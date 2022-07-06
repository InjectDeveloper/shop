import { Injectable } from "@nestjs/common";
import { UserEntity } from "../user/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReviewEntity } from "./entities/review.entity";

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity) private readonly reviewsRepository: Repository<ReviewEntity>,
  ) {
  }
  async create(user: UserEntity, text: string) {
    const comment = await this.reviewsRepository.create({
      user: user,
      text: text
    })

    await this.reviewsRepository.save(comment)
    return await this.reviewsRepository.findOne({
      where: {
        id: comment.id
      }
    })
  }

  async getAll() {
    return await this.reviewsRepository.find({
      relations: {
        user: true
      }
    })
  }

  async delete(commentId) {
    await this.reviewsRepository.delete(commentId)
  }
}
