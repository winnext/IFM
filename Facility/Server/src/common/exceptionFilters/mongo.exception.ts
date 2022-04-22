import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { I18nService } from 'nestjs-i18n';
import { ExceptionType } from '../const/exception.type';
import { I18NEnums } from '../const/i18n.enum';
import { FacilityTopics } from '../const/kafta.topic.enum';
import { KafkaService } from '../queueService/kafkaService';
import { PostKafka } from '../queueService/post-kafka';

/**
 * Catch MongoException and send this exception to messagebroker  to save the database
 */
@Catch()
export class MongoExceptionFilter implements ExceptionFilter {
  /**
   * create variable for postKafka Service
   */
  postKafka: PostKafka;
  /**
   * inject i18nService
   */
  constructor(private readonly i18n: I18nService) {
    this.postKafka = new PostKafka(new KafkaService());
  }
  /**
   * Log from Logger
   */
  private logger = new Logger('HTTP');

  /**
   * Catch Method For Mongo Error
   */
  async catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    console.log('--------This error from MONGO EXCEPTİON FİLTER-----------');
    const exceptionMessage = exception.errmsg;
    const errorProperties = exceptionMessage.match(/\{.*\}/)[0];

    const errorType = ExceptionType.MONGO_EXCEPTİON;
    const requestInformation = {
      timestamp: new Date(),
      user: request.user || {},
      path: request.url,
      method: request.method,
      body: request.body,
    };

    const errorResponseLog = {
      timestamp: new Date().toLocaleDateString(),
      path: request.url,
      method: request.method,
      message: exception.message,
    };
    const reqResObject = { requestInformation, errorResponseLog, errorType };
    console.log(exceptionMessage);
    //give response due to mongo exception code
    switch (exception.code) {
      case 112: // write conflict (when a transaction is failed)
        response.status(409).json({ code: 409, message: 'conflict' });
        break;
      case 211: // MONGO CONNECTİON LOST exception
        response.status(500).json({ code: 500, message: 'Server down' });
        break;
      case 11000: // duplicate exceptio
        const message = await getI18nMongoErrorMessage(this.i18n, request, I18NEnums.DUBLICATE_ERROR, errorProperties);
        const clientResponse = { code: 400, message, errorProperties: errorProperties };
        const finalExcep = {
          reqResObject,
          clientResponse,
        };
        try {
          await this.postKafka.producerSendMessage(FacilityTopics.FACILITY_EXCEPTIONS, JSON.stringify(finalExcep));
          this.logger.warn(`${JSON.stringify(finalExcep)}   `);

          response.status(400).json(clientResponse);
          break;
        } catch (error) {
          console.log(error);
        }
      case 11600: // MONGO CONNECTİON LOST exception
        response.status(500).json({ code: 500, message: exceptionMessage });
        break;
      default:
        response.status(500).json({ code: 500, message: exceptionMessage });
        break;
    }
  }
}
/**
 * Get Mongo Error with i18N Message
 */
async function getI18nMongoErrorMessage(i18n: I18nService, request, i18NEnum: I18NEnums, errorProperties) {
  return await i18n.translate(i18NEnum, {
    lang: request.i18nLang,
    args: { errorProperties },
  });
}
