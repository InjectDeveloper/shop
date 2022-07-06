import {Logger} from "@nestjs/common";

const BlockIo = require('block_io');
const request = require('request')

export class CryptoLib {
  private readonly blockIo_BTC;
  private readonly blockIo_LTC;

  constructor() {
    this.blockIo_BTC = new BlockIo({
      api_key: process.env.BLOCKIO_BTC_API_KEY,
      pin: process.env.BLOCKIO_PIN
    }),
      this.blockIo_LTC = new BlockIo({
        api_key: process.env.BLOCKIO_LTC_API_KEY,
        pin: process.env.BLOCKIO_PIN
      })
  }

  async getNewBTCAdress(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.blockIo_BTC.get_new_address().then(data => {
        resolve(data.data.address)
      }).catch(e => reject(e))
    })
  }
  async getNewLTCAdress(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.blockIo_LTC.get_new_address().then(data => {
        resolve(data.data.address)
      }).catch(e => reject(e))
    })
  }

  async getBTCAdressBalance(address): Promise<string> {
    return new Promise((resolve, reject) => {
      this.blockIo_BTC.get_address_balance({address: address}).then(data => {
        if (data.status == "success") {
          resolve(data.data.balances[0].available_balance)
        } else {
          reject("Ошибка сервера block.io")
        }
      }).catch(e => reject(e))
    })
  }
  async getLTCAdressBalance(address): Promise<string> {
    return new Promise((resolve, reject) => {
      this.blockIo_LTC.get_address_balance({address: address}).then(data => {
        if (data.status == "success") {
          resolve(data.data.balances[0].available_balance)
        } else {
          reject("Ошибка сервера block.io")
        }
      }).catch(e => reject(e))
    })
  }

  async getBTCprice(): Promise<number> {
    return new Promise((resolve, reject) => {
      const options = {
        'method': `GET`,
        'url': `https://block.io/api/v2/get_current_price/?api_key=`+process.env.BLOCKIO_BTC_API_KEY,
      }

      request(options,
        (err, response, body) => {
          if (err || response.statusCode == 404) reject("Ошибка с серверами CRYPTO")
          else {
            body = JSON.parse(body)

            const btcPrice = body.data.prices.find((elem) => {
              if (elem.price_base == "USD") {
                return elem
              }
            }).price
            resolve(parseInt(btcPrice))
          }
        }
      )
    })
  }
  async getLTCprice(): Promise<number> {
    return new Promise((resolve, reject) => {
      const options = {
        'method': `GET`,
        'url': `https://block.io/api/v2/get_current_price/?api_key=`+process.env.BLOCKIO_LTC_API_KEY,
      }

      request(options,
        (err, response, body) => {
          if (err || response.statusCode == 404) reject("Ошибка с серверами CRYPTO")
          else {
            body = JSON.parse(body)

            const ltcPrice = body.data.prices.find((elem) => {
              if (elem.price_base == "USD") {
                return elem
              }
            }).price
            resolve(parseInt(ltcPrice))
          }
        }
      )
    })
  }

  async getPriceInBTC(sum): Promise<number> {

    return new Promise((resolve, reject) => {
      const options = {
        'method': `GET`,
        'url': `https://block.io/api/v2/get_current_price/?api_key=`+process.env.BLOCKIO_BTC_API_KEY,
      }

      request(options,
        (err, response, body) => {
          if (err || response.statusCode == 404) reject("Ошибка с серверами CRYPTO")
          else {
            body = JSON.parse(body)

            const btcPrice = body.data.prices.find((elem) => {
              if (elem.price_base == "USD") {
                return elem
              }
            }).price
            resolve(sum / 55 / parseInt(btcPrice))
          }
        }
      )
    })

  }
  async getPriceInLTC(sum): Promise<number> {

    return new Promise((resolve, reject) => {
      const options = {
        'method': `GET`,
        'url': `https://block.io/api/v2/get_current_price/?api_key=`+process.env.BLOCKIO_LTC_API_KEY,
      }

      request(options,
        (err, response, body) => {
          if (err || response.statusCode == 404) reject("Ошибка с серверами CRYPTO")
          else {
            body = JSON.parse(body)

            const ltcPrice = body.data.prices.find((elem) => {
              if (elem.price_base == "USD") {
                return elem
              }
            }).price
            resolve(sum / 55 / parseInt(ltcPrice))
          }
        }
      )
    })

  }
}