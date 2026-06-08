import { loadChokepointIndexData } from '../../services/indexData'
import { CompanyScore, SectorScore } from '../../types/index-data'

interface SectorView extends SectorScore {
  companyCount: number
}

interface SectorsPageData {
  loading: boolean
  sourceLabel: string
  sectors: SectorView[]
  allCompanies: CompanyScore[]
  selectedSectorId: string
  selectedSector: SectorView | null
  filteredCompanies: CompanyScore[]
}

Page({
  data: {
    loading: true,
    sourceLabel: '加载中',
    sectors: [],
    allCompanies: [],
    selectedSectorId: '',
    selectedSector: null,
    filteredCompanies: [],
  } as SectorsPageData,

  onLoad() {
    this.loadSectors()
  },

  async loadSectors() {
    this.setData({ loading: true })

    try {
      const loaded = await loadChokepointIndexData()
      const sectors = loaded.data.sectors.map((sector) => ({
        ...sector,
        companyCount: sector.companies.length,
      }))
      const selectedSector = sectors[0] || null
      const filteredCompanies = selectedSector
        ? loaded.data.companies.filter((company) => company.sectorId === selectedSector.id)
        : []

      this.setData({
        loading: false,
        sourceLabel: loaded.message,
        sectors,
        allCompanies: loaded.data.companies,
        selectedSectorId: selectedSector ? selectedSector.id : '',
        selectedSector,
        filteredCompanies,
      })
    } catch (error) {
      this.setData({ loading: false })
      wx.showToast({ title: '板块加载失败', icon: 'none' })
    }
  },

  selectSector(event: WechatMiniprogram.TouchEvent) {
    const id = String(event.currentTarget.dataset.id || '')
    const selectedSector = this.data.sectors.find((sector) => sector.id === id) || null

    if (!selectedSector) {
      return
    }

    const filteredCompanies = this.data.allCompanies.filter((company) => company.sectorId === id)
    this.setData({ selectedSectorId: id, selectedSector, filteredCompanies })
  },

  goCompany(event: WechatMiniprogram.TouchEvent) {
    const id = String(event.currentTarget.dataset.id || '')
    if (!id) {
      return
    }
    wx.navigateTo({ url: `/pages/company/index?id=${id}` })
  },
})
