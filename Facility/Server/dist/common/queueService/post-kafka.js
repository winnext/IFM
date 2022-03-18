"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostKafka = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
let PostKafka = class PostKafka {
    constructor(service) {
        this.service = service;
        this.producer = this.service.producer();
    }
    async producerSendMessage(topicName, message, key) {
        await this.producer.connect();
        await this.producer.send({
            topic: topicName,
            messages: [
                {
                    key: key || (0, uuid_1.v4)(),
                    value: message,
                },
            ],
        });
        await this.producer.disconnect();
    }
};
PostKafka = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], PostKafka);
exports.PostKafka = PostKafka;
//# sourceMappingURL=post-kafka.js.map