import { Module } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { TreeController } from './tree.controller';
import { TreeService } from './tree.service';
import { TreeRepository } from './repositories/tree.repository';

@Module({
  controllers: [TreeController],
  providers: [
    TreeService,
    {
      provide: RepositoryEnums.ASSET_TREE,
      useClass: TreeRepository,
    },
  ],
})
export class TreeModule {}
