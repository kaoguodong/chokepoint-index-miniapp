export type SignalStatus = '观察' | '跟踪' | '风险升高'
export type EvidenceLevel = 'Confirmed' | 'Inferred' | 'Needs verification'

export interface ScoreBreakdown {
  scarcity: number
  policy: number
  margin: number
  rnd: number
}

export interface PillarScore {
  key: keyof ScoreBreakdown
  name: string
  score: number
  description: string
}

export interface SectorScore {
  id: string
  name: string
  score: number
  trend: string
  bottleneck: string
  description: string
  companies: string[]
}

export type SupplyStressLevel = 'normal' | 'watch' | 'tight' | 'critical'

export interface SupplyMapNode {
  id: string
  name: string
  layer: string
  leadTimeWeeks: number
  supplyIndex: number
  demandPressure: number
  riskScore: number
  stressLevel: SupplyStressLevel
  reason: string
  x: number
  y: number
}

export interface CompanyScore {
  id: string
  ticker: string
  name: string
  sectorId: string
  role: string
  chokepointScore: number
  signal: SignalStatus
  evidenceLevel: EvidenceLevel
  scoreBreakdown: ScoreBreakdown
  risks: string[]
  thesis: string
  nextWatch: string
  betaFactors: string[]
}

export interface ChokepointIndexData {
  asOf: string
  sourceName: string
  indexScore: number
  summary: string
  pillars: PillarScore[]
  sectors: SectorScore[]
  companies: CompanyScore[]
  supplyMap?: SupplyMapNode[]
  watchlist: string[]
}

export type DataSourceState = 'local' | 'remote' | 'fallback'

export interface LoadedIndexData {
  data: ChokepointIndexData
  source: DataSourceState
  message: string
}
