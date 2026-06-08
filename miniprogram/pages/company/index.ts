import { loadChokepointIndexData } from '../../services/indexData'
import { CompanyScore, PillarScore, ScoreBreakdown, SectorScore } from '../../types/index-data'

interface MetricItem {
  key: keyof ScoreBreakdown
  name: string
  score: number
}

interface CompanyPageData {
  loading: boolean
  company: CompanyScore | null
  sector: SectorScore | null
  metrics: MetricItem[]
  risks: string[]
  betaFactors: string[]
}

const metricNames: Record<keyof ScoreBreakdown, string> = {
  scarcity: '供应稀缺',
  policy: '政策敏感',
  margin: '盈利韧性',
  rnd: '研发壁垒',
}

function buildMetrics(scoreBreakdown: ScoreBreakdown, pillars: PillarScore[]): MetricItem[] {
  return pillars.map((pillar) => ({
    key: pillar.key,
    name: metricNames[pillar.key],
    score: scoreBreakdown[pillar.key],
  }))
}

Page({
  data: {
    loading: true,
    company: null,
    sector: null,
    metrics: [],
    risks: [],
    betaFactors: [],
  } as CompanyPageData,

  onLoad(query: Record<string, string | undefined>) {
    this.loadCompany(query.id || '')
  },

  async loadCompany(id: string) {
    this.setData({ loading: true })

    try {
      const loaded = await loadChokepointIndexData()
      const company = loaded.data.companies.find((item) => item.id === id) || null
      const sector = company
        ? loaded.data.sectors.find((item) => item.id === company.sectorId) || null
        : null

      if (!company) {
        this.setData({ loading: false, company: null, sector: null, metrics: [], risks: [], betaFactors: [] })
        return
      }

      this.setData({
        loading: false,
        company,
        sector,
        metrics: buildMetrics(company.scoreBreakdown, loaded.data.pillars),
        risks: company.risks,
        betaFactors: company.betaFactors,
      })
    } catch (error) {
      this.setData({ loading: false })
      wx.showToast({ title: '详情加载失败', icon: 'none' })
    }
  },
})
