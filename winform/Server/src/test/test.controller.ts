import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateTestDto } from './dto/create.test.dto';
import { UpdateTestDto } from './dto/update.test.dto';
import { Test } from './entities/test.entity';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get()
  async getAllTests(): Promise<Test[]> {
    return this.testService.findAll();
  }

  @Get('/:_id')
  getTestById(@Param('_id') id: string): Promise<Test> {
    return this.testService.findOne(id);
  }

  @Post('')
  createTest(@Body() createTestDto: CreateTestDto): Promise<Test> {
    return this.testService.create(createTestDto);
  }

  @Delete('/:_id')
  deleteTest(@Param('_id') id: string): Promise<Test> {
    return this.testService.remove(id);
  }

  @Patch('/:_id')
  updateTest(@Param('_id') id: string, @Body() updateTestDto: UpdateTestDto): Promise<Test> {
    return this.testService.update(id, updateTestDto);
  }
}
