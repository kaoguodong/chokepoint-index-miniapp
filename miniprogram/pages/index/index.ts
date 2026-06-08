import { loadChokepointIndexData } from '../../services/indexData'
import { ChokepointIndexData, CompanyScore, DataSourceState, SectorScore } from '../../types/index-data'

interface DashboardData {
  loading: boolean
  sourceLabel: string
  sourceClass: string
  indexData: ChokepointIndexData | null
  sectors: SectorScore[]
  topCompanies: CompanyScore[]
  watchlist: string[]
}

function getSourceClass(source: DataSourceState): string {
  if (source === 'remote') {
    return 'source-remote'
  }
  if (source === 'fallback') {
    return 'source-fallback'
  }
  return 'source-local'
}

Page({
  data: {
    loading: true,
    sourceLabel: '加载中',
    sourceClass: 'source-local',
    indexData: null,
    sectors: [],
    topCompanies: [],
    watchlist: [],
  } as DashboardData,

  onLoad() {
    this.loadDashboard()
  },

  onPullDownRefresh() {
    this.loadDashboard().finally(() => wx.stopPullDownRefresh())
  },

  async loadDashboard() {
    this.setData({ loading: true })

    try {
      const loaded = await loadChokepointIndexData()
      const topCompanies = loaded.data.companies
        .slice()
        .sort((left, right) => right.chokepointScore - left.chokepointScore)
        .slice(0, 4)

      this.setData({
        loading: false,
        sourceLabel: loaded.message,
        sourceClass: getSourceClass(loaded.source),
        indexData: loaded.data,
        sectors: loaded.data.sectors,
        topCompanies,
        watchlist: loaded.data.watchlist,
      })
    } catch (error) {
      this.setData({ loading: false })
      wx.showToast({ title: '数据加载失败', icon: 'none' })
    }
  },

  goSectors() {
    wx.navigateTo({ url: '/pages/sectors/index' })
  },

  goCompany(event: WechatMiniprogram.TouchEvent) {
    const id = String(event.currentTarget.dataset.id || '')
    if (!id) {
      return
    }
    wx.navigateTo({ url: `/pages/company/index?id=${id}` })
  },
})
