<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://kamilmysliwiec.com/public/nest-logo.png#1" alt="Nest Logo" />   </a>
  <a href="https://neo4j.com" target="_blank"><img src="https://dist.neo4j.com/wp-content/uploads/20140926224303/neo4j_logo-facebook.png" width="380"></a>
</p>

# Nest Neo4j

> Neo4j integration for Nest

## Description

This repository provides [Neo4j](https://www.neo4j.com) integration for [Nest](http://nestjs.com/).

## Description of Library
(as default u can use `read()` and `write()` method for  your own cyper query)
This package convenient for tree structure .
for tree structure as default package creates Parent Relation with `[:CHILD_OF]`  and for CHİLD relation with `[:CHİLDREN]` 

## Installation

```
$ npm i sgnm-neo4j
```

## Quick Start

Register the Neo4j Module in your application using the `forRoot` method or `forRootAsync`, passing the neo4j connection information as an object:

```ts
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { Neo4jModule } from "sgnm-neo4j";

@Module({
  imports: [
    Neo4jModule.forRoot({
      scheme: "neo4j",
      host: "localhost",
      port: 7687,
      username: "neo4j",
      password: "neo",
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

```ts
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { Neo4jModule } from "sgnm-neo4j";

@Module({
  imports: [
    Neo4jModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host: configService.get("NEO4J_HOST"),
        password: configService.get("NEO4J_PASSWORD"),
        port: configService.get("NEO4J_PORT"),
        scheme: configService.get("NEO4J_SCHEME"),
        username: configService.get("NEO4J_USERNAME"),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## Querying Neo4j

The `Neo4jService` is `@Injectable`, so can be passed into any constructor:

```ts
import { Neo4jService } from "sgnm-neo4j";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly neo4jService: Neo4jService
  ) {}

  @Get()
  async getHello(): Promise<any> {
    const res = await this.neo4jService.read(
      `MATCH (n) RETURN count(n) AS count`
    );

    return `There are ${res.records[0].get("count")} nodes in the database`;
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateDto: UpdateDto) {
    return await this.neo4jService.updateById(id, updateDto);
  }
}
```
## sample node


```ts
{
"code": "uniq-id",
"labelclass": "node", //sample match(n:node label)
"selectable": false, //fot tree stcructure 
"self_id": 0,//id of node
"label": " custom name", 
"isActive": true,//node is active
"createdAt": "2022-04-11T00:00:00", //create time
"isDeleted": false,//node is deleted
"name": "Test Node", //node name
"tag": [
          "test Tag",
          "Person"
        ],//if u tag node 
"class_name": "TestClass", //node from class that u create
"key": "11-00-00-00&0", //uniqe key
"updatedAt": "2022-04-11T00:00:00", //update time
"hasParent": false //node has parent for tree structure
}
```

## Methods

some method like `delete(id)` used other method like `updateIsDeleted(true)` check github for more details source code in `src/neo4j.service.ts`


```ts
getConfig(): Neo4jConfig;
getReadSession(database?: string): Session;
getWriteSession(database?: string): Session;
read(query: string, params?: object, database?: string): Result;
write(query: string, params?: object, database?: string): Result;
findByIdWithTreeStructure(id: string);
getChildrenCount(id: string);
getParentById(id: string);
create(entity:object);
findAllByClassName(data: PaginationNeo4jParamsWithClassName);
delete(id: string);
deleteParentRelation(id: string);
deleteChildrenRelation(id: string);
createChildrenByLabelClass(entity: object);
updateIsSelectableProp(id: string, selectable: boolean); 
updateIsDeletedProp(id: string, isDeleted: boolean);
updateHasParentProp(id: string, hasParent: boolean);
findOneNodeByKey(key: string);
addRelations(_id: string, _target_parent_id: string);
updateById(id: string, params: object);
createNode(params: object);
findRootNodeByClassName(params: findNodeCountByClassNameDto);
findNodeCountByClassName(class_name: string);
findById(id: string);
```
