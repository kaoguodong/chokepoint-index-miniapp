import { dataSourceConfig } from '../config/dataSource'
import { localChokepointIndexData } from '../data/chokepointIndex'
import { ChokepointIndexData, LoadedIndexData } from '../types/index-data'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isValidIndexData(value: unknown): value is ChokepointIndexData {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.asOf === 'string' &&
    typeof value.sourceName === 'string' &&
    typeof value.indexScore === 'number' &&
    typeof value.summary === 'string' &&
    Array.isArray(value.pillars) &&
    Array.isArray(value.sectors) &&
    Array.isArray(value.companies) &&
    Array.isArray(value.watchlist)
  )
}

function requestRemoteData(url: string, timeoutMs: number): Promise<ChokepointIndexData> {
  return new Promise((resolve, reject) => {
    let settled = false
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true
        reject(new Error('remote data request timeout'))
      }
    }, timeoutMs)

    wx.request({
      url,
      method: 'GET',
      success: (res: WechatMiniprogram.RequestSuccessCallbackResult) => {
        if (settled) {
          return
        }
        settled = true
        clearTimeout(timer)

        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`remote status ${res.statusCode}`))
          return
        }

        if (!isValidIndexData(res.data)) {
          reject(new Error('remote data schema invalid'))
          return
        }

        resolve(res.data)
      },
      fail: () => {
        if (settled) {
          return
        }
        settled = true
        clearTimeout(timer)
        reject(new Error('remote data request failed'))
      },
    })
  })
}

export async function loadChokepointIndexData(): Promise<LoadedIndexData> {
  const hasRemote = dataSourceConfig.remoteUrl.trim().length > 0

  if (dataSourceConfig.mode === 'local' || !hasRemote) {
    return {
      data: localChokepointIndexData,
      source: 'local',
      message: hasRemote ? '本地示例' : '未配置远程数据，使用本地示例',
    }
  }

  try {
    const data = await requestRemoteData(dataSourceConfig.remoteUrl, dataSourceConfig.timeoutMs)
    return {
      data,
      source: 'remote',
      message: '远程数据',
    }
  } catch (error) {
    if (dataSourceConfig.mode === 'remote') {
      throw error
    }

    return {
      data: localChokepointIndexData,
      source: 'fallback',
      message: '远程不可用，已回退本地示例',
    }
  }
}
