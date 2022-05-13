import { Neo4jService } from 'nest-neo4j/dist';
import { BaseGraphDatabaseInterfaceRepository } from 'ifmcommon';
import { Type } from '../entities/type.entity';
import { TypeNotFountException } from 'src/common/notFoundExceptions/not.found.Exceptions';
import { Injectable } from '@nestjs/common';
import { CreateTypeDto } from '../dtos/create.type.dto';


@Injectable()
export class TypeRepository {
  constructor(
    private readonly neo4jService: Neo4jService,

  ) { }

  async findOneById(id: string) {
    const idNum = parseInt(id);
    let result = await this.neo4jService.read(
      'MATCH p=(n)-[:CHILDREN*]->(m) \
      WHERE  id(n)=$idNum and  m:ChildNode  and NOT m:Type and NOT m:TypeProperty  and n.isDeleted=false and m.isActive=true \
      WITH COLLECT(p) AS ps \
      CALL apoc.convert.toTree(ps) yield value \
      RETURN value',
      { idNum }
    );

    var resultRow = result['records'][0]['_fields'][0];
    if (!result) {
      throw new TypeNotFountException("Type");
    } else {
      const o = { root: result['records'][0]['_fields'] };
      return o;
    }
  }
}