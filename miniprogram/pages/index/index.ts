import { loadChokepointIndexData } from '../../services/indexData'
import {
  ChokepointIndexData,
  CompanyScore,
  DataSourceState,
  SectorScore,
  SupplyMapNode,
} from '../../types/index-data'

interface SupplyMapNodeView extends SupplyMapNode {
  markerStyle: string
  levelLabel: string
}

interface DashboardData {
  loading: boolean
  sourceLabel: string
  sourceClass: string
  indexData: ChokepointIndexData | null
  sectors: SectorScore[]
  topCompanies: CompanyScore[]
  supplyNodes: SupplyMapNodeView[]
  selectedSupplyNode: SupplyMapNodeView | null
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

function getStressLabel(level: SupplyMapNode['stressLevel']): string {
  const labelMap: Record<SupplyMapNode['stressLevel'], string> = {
    normal: '正常',
    watch: '观察',
    tight: '偏紧',
    critical: '紧缺',
  }
  return labelMap[level]
}

function buildSupplyNodeViews(nodes: SupplyMapNode[] = []): SupplyMapNodeView[] {
  return nodes.map((node) => ({
    ...node,
    levelLabel: getStressLabel(node.stressLevel),
    markerStyle: `left: ${node.x}%; top: ${node.y}%;`,
  }))
}

Page({
  data: {
    loading: true,
    sourceLabel: '加载中',
    sourceClass: 'source-local',
    indexData: null,
    sectors: [],
    topCompanies: [],
    supplyNodes: [],
    selectedSupplyNode: null,
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
      const supplyNodes = buildSupplyNodeViews(loaded.data.supplyMap)

      this.setData({
        loading: false,
        sourceLabel: loaded.message,
        sourceClass: getSourceClass(loaded.source),
        indexData: loaded.data,
        sectors: loaded.data.sectors,
        topCompanies,
        supplyNodes,
        selectedSupplyNode: supplyNodes[0] || null,
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

  selectSupplyNode(event: WechatMiniprogram.TouchEvent) {
    const id = String(event.currentTarget.dataset.id || '')
    const selectedSupplyNode = this.data.supplyNodes.find((node) => node.id === id) || null
    this.setData({ selectedSupplyNode })
  },
})
