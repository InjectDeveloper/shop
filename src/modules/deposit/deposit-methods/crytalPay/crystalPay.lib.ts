import { HttpException, Logger } from "@nestjs/common";
const request = require('request')

export class CrystalPayLib {
  private readonly apiKey
  private readonly apiHost
  private readonly apiConst

  constructor() {
    this.apiKey = process.env.CRYSTALPAY_API_KEY
    this.apiHost = process.env.CRYSTALLPAY_API_URL
    this.apiConst = `?s=${this.apiKey}&n=${process.env.CRYSTALPAY_CASHBOX_NAME}`
  }

  async getDepositLink(sum) {
    const data = await this.doRequest(`&o=invoice-create&amount=${sum}&lifetime=1440`).catch(e => {
      throw new HttpException(e, 500)
    })
    return data
  }

  async getDepositById(id) {
    const data = await this.doRequest(`&o=invoice-check&i=${id}`).catch(e => {
      throw new HttpException(e, 500)
    })
    return data
  }

  private doRequest(url, resBody?): Array<any> | any {
    return new Promise((resolve, reject) => {
      const options = {
        'method': "GET",
        'url': `${this.apiHost}${this.apiConst}${url}`,
        'headers': {
          'Content-Type': 'application/json',
        }
      }
      request(options,
        (err, response, body) => {
          if (err || response.statusCode == 401) reject("Ошибка с серверами CrystalPay")
          else {
            resolve(JSON.parse(body))
          }
        }
      )
    })
  }
}