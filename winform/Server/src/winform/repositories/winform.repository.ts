import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Winform } from '../entities/winform.entity';
import { CreateWinformDto } from '../dtos/create.winform.dto';

// import { checkObjectIddİsValid } from 'src/common/func/objectId.check';
import { BaseInterfaceRepository } from 'ifmcommon';
// import { FacilityNotFountException } from '../../common/notFoundExceptions/not.found.exception';

@Injectable()
export class WinformRepository implements BaseInterfaceRepository<Winform> {
  constructor(@InjectModel(Winform.name) private readonly winformModel: Model<Winform>) {}

  findWithRelations(relations: any): Promise<Winform[]> {
    throw new Error(relations);
  }
  async findOneById(id: string): Promise<Winform> {
    const winform = await this.winformModel.findById({ _id: id }).exec();
    // if (!winform) {
    //   throw new winformNotFountException(id);
    // }

    return winform;
  }
  async findAll() {
    const result = await this.winformModel.find().exec();

    const winform = [];
    winform.push(result);

    return winform;
  }

  async create(createWinformDto: CreateWinformDto) {
    //checkObjectIddİsValid(classifications.classificationId);

    const winform = new this.winformModel(createWinformDto);

    return await winform.save();
  }
  async update(_id: string, updateWinformDto: any) {
    //checkObjectIddİsValid(classifications.classificationId);

    const updatedWinform = await this.winformModel
      .findOneAndUpdate({ _id }, { $set: updateWinformDto }, { new: true })
      .exec();

    return updatedWinform;
  }
  async delete(_id: string) {
    const winform = await this.findOneById(_id);
    return this.winformModel.remove(winform);
  }
}
