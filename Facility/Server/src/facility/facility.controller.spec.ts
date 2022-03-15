/*
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { CreateFacilityDto } from './dtos/create.facility.dto';
import { Facility } from './entities/facility.entity';
import { FacilityController } from './facility.controller';
import { FacilityService } from './facility.service';
import { FacilityRepository } from './repositories/facility.repository.abstract';

//some information about what is testing what kind of test avaliable

//https://www.valentinog.com/blog/jest/

const input: CreateFacilityDto = {
  address: 'ifm adress',
  country: 'Turkey',
  label: ['test'],
  classification_of_facility: 'omniclass 11',
  type_of_facility: 'campus',
  brand_name: 'test',
  facility_name: 'test',
  city: 'istanbul',
};

//mock output for createFacility
const output = {
  id: expect.any(Number),
  address: 'ifm adress',
  country: 'Turkey',
  label: ['test'],
  classification_of_facility: 'omniclass 11',
  type_of_facility: 'campus',
  brand_name: 'test',
  facility_name: 'test',
  city: 'istanbul',
};

const output2 = [
  {
    id: expect.any(Number),
    address: 'ifm adress',
    country: 'Turkey',
    label: ['test'],
    classification_of_facility: 'omniclass 11',
    type_of_facility: 'campus',
    brand_name: 'test',
    facility_name: 'test',
    city: 'istanbul',
  },
];

describe('FacilityController', () => {
  let controller: FacilityController;
  let service: FacilityService;
  let model: Model<Facility>;
  //mock service for controller
  const mockFacilityService = {
    create: jest.fn((dto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),
    findAll: jest.fn(() => {
      return output2;
    }),
  };

  //this method calles before each test
  beforeEach(async () => {
    //to test controller create a kind of mock module
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacilityController],
      providers: [FacilityService, FacilityRepository],
    }).compile();

    //this is for controller which wil  test
    controller = module.get<FacilityController>(FacilityController);
    service = module.get<FacilityService>(FacilityService);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  // it('controller should contain getAllFacilities Function', () => {
  //   expect(typeof controller.getAllFacilities).toBe('function');
  // });

  // it('should get all facilities', () => {
  //   expect(controller.getAllFacilities()).toEqual(output2);
  // });

  // it('controller should contain createFacility Function', () => {
  //   expect(typeof controller.createFacility).toBe('function');
  // });

  // it('should create a facility', () => {
  //   expect(controller.createFacility(input)).toEqual(output);
  // });
});
*/
