import { clientInstance, getData } from '..'

const Api = {
  async videoLength(): Promise<{ length: number }> {
    return getData(await clientInstance.get('/video/length'))
  },
  async videoLog(): Promise<{ length: number }> {
    return getData(await clientInstance.get('/video/log'))
  }
}

export default Api