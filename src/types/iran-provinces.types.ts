export type Position = [longitude: number, latitude: number]

export type LinearRing = Position[]

export type PolygonCoordinates = LinearRing[]

export type MultiPolygonCoordinates = PolygonCoordinates[]

export interface PolygonGeometry {
  type: 'Polygon'
  coordinates: PolygonCoordinates
}

export interface MultiPolygonGeometry {
  type: 'MultiPolygon'
  coordinates: MultiPolygonCoordinates
}

export type IranGeometry = PolygonGeometry | MultiPolygonGeometry

export interface IranProvinceProperties {
  name?: string
  id?: string | number
  NAME_ENG?: string
  CNTRY?: string
  TYPE?: string
  TYPE_EN?: string
}

export interface IranProvinceFeature {
  type?: 'Feature'
  id?: string | number
  geometry: IranGeometry
  properties: IranProvinceProperties
}

export interface IranProvinceFeatureCollection {
  type?: 'FeatureCollection'
  features: IranProvinceFeature[]
}