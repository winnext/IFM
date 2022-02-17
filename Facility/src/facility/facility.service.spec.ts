
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { FacilityNotFountException } from './commonExceptions/facility.not.found.exception';
import { CreateFacilityDto } from './dtos/create.facility.dto';
import { Facility, FaciliySchema } from './entities/facility.entity';
import { FacilityService } from './facility.service';
import { FacilityRepository } from './repositories/facility.repository';

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
  _id: '6209eacf2869d8a9a86c2aab',
  address: 'ifm adress',
  country: 'Turkey',
  label: ['test'],
  classification_of_facility: 'omniclass 11',
  type_of_facility: 'campus',
  brand_name: 'test2',
  facility_name: 'test2',
  uuid: 'b9a7ec17-c8f3-48f5-a444-d9c310322dce',
  __v: 0,
};

const output2 = [
  {
    _id: '6209eacf2869d8a9a86c2aab',
    address: 'ifm adress',
    country: 'Turkey',
    label: ['test'],
    classification_of_facility: 'omniclass 11',
    type_of_facility: 'campus',
    brand_name: 'test2',
    facility_name: 'test2',
    uuid: 'b9a7ec17-c8f3-48f5-a444-d9c310322dce',
    __v: 0,
  },
  {
    _id: '620c92afc6a0e62a94c10399',
    address: 'string',
    country: 'string',
    label: ['string'],
    classification_of_facility: 'string',
    type_of_facility: 'string',
    brand_name: 'string',
    facility_name: 'string',
    uuid: '47a3f5cd-7e31-4845-93e0-7fa3bc5648f9',
    __v: 0,
  },
];

describe('FacilityService', () => {
  let service: FacilityService;
  let repo: FacilityRepository;

  //this method calles before each test
  beforeEach(async () => {
    //to test service create a kind of mock module
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/facility'),
        MongooseModule.forFeature([
          {
            name: Facility.name,
            schema: FaciliySchema,
          },
        ]),
      ],
      providers: [FacilityService, {
        provide:'FacilityRepositoryInterface',
        useClass:FacilityRepository
      }],
    }).compile();

    //this is for service which wil  test
    service = testModule.get(FacilityService);
    repo: testModule.get('FacilityRepositoryInterface');
  });

  //individual test
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('should  find all facilities', async () => {
  //   const test = await service.findAll();

  //   const check = test[0].uuid == 'b9a7ec17-c8f3-48f5-a444-d9c310322dce';
  //   expect(check).toBe(true);
  // });

  it('should  find specific facility', async () => {
    const facilityId = '6209eacf2869d8a9a86c2aab';
    const test = await service.findOne(facilityId);
    const getSameId = test._id.toString() === output._id;

    expect(getSameId).toBe(true);
  });

  describe('otherwise', () => {
    it('should throw the "NotFoundException"', async () => {
      const facilityId = '6209eacf2869d8a9a86c2aac';

      try {
        await service.findOne(facilityId);
      } catch (err) {
        expect(err).toBeInstanceOf(FacilityNotFountException);
        expect(err.message).toEqual(`Facility with #${facilityId} Not Found `);
      }
    });
  });

  // it('should  create a facility', async () => {
  //   const test = await service.create(input);

  //   console.log(test);

  //   //  expect(test).toEqual(output);
  // });
});
