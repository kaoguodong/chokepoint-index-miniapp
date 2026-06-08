export type DataSourceMode = 'local' | 'remote' | 'hybrid'

export interface DataSourceConfig {
  mode: DataSourceMode
  remoteUrl: string
  timeoutMs: number
}

export const dataSourceConfig: DataSourceConfig = {
  mode: 'hybrid',
  remoteUrl: '',
  timeoutMs: 4500,
}
