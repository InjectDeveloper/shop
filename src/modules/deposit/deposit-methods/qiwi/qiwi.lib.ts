import {HttpException, Logger} from "@nestjs/common";

const request = require('request')

export class QiwiLib {
  private readonly apiKey: string
  private readonly apiHost: string
  private readonly adminQiwi: string

  constructor() {
    this.apiKey = process.env.QIWI_API_KEY
    this.apiHost = process.env.QIWI_API_URL
    this.adminQiwi = process.env.QIWI_PHONE
  }

  async getRubBalance(): Promise<number> {
    let data = await this.doRequest(HttpMethodsEnum.GET,`/funding-sources/v2/persons/${this.adminQiwi}/accounts`).catch(e => {
      throw new HttpException(e, 500)
    })

    return parseInt(data.accounts.find((elem) => {return elem.alias = "qw_wallet_rub"}).balance.amount) | 0
  }

  async getDepositByCommentAndSum(comment, sum) {
    let payments = await this.doRequest(HttpMethodsEnum.GET, `/payment-history/v2/persons/${this.adminQiwi}/payments?operation=IN&sources=QW_RUB&rows=50`).catch(e => {
      throw new HttpException(e, 500)
    })
    return payments.data.find((elem) => {
      return elem.sum.amount == sum && elem.comment == comment
    })
  }

  async sendAllMoneyToQiwiWallet(phone) {
    const sum = await this.getRubBalance() / 100 * 95
    const body = this.createPaymentsObj(phone, sum)

    return await this.doRequest(HttpMethodsEnum.POST, `/sinap/api/v2/terms/99/payments`, body).catch(e => {
      throw new HttpException(e, 500)
    })
  }

  async createPaymentComment() {
    var comment = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 7; i++)
      comment += possible.charAt(Math.floor(Math.random() * possible.length));

    return comment;
  }

  private createPaymentsObj(account, sum) {
    return {
      id: (1000 * new Date().getTime()).toString(),
      sum: {
        amount: sum,
        currency: "643"
      },
      paymentMethod: {
        type: "Account",
        accountId: "643"
      },
      fields: {
        account: account.toString()
      }
    }
  }

  private doRequest(method, url, resBody?): Array<any> | any {
    return new Promise((resolve, reject) => {

      const options = {
        'method': `${method}`,
        'url': `${this.apiHost}${url}`,
        'headers': {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resBody)
      }

      request(options,
        (err, response, body) => {
          if (err || response.statusCode == 401) reject("Ошибка с серверами QIWI")
          else {
            resolve(JSON.parse(body))
          }
        }
      )
    })
  }
}

enum HttpMethodsEnum {
  GET = "GET",
  POST = "POST"
}