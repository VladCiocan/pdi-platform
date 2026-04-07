// GIS Layer Types
export type LayerType = 'point' | 'line' | 'polygon' | 'raster';

export interface GisLayer {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  opacity?: number;
  style?: LayerStyle;
}

export interface LayerStyle {
  color?: string;
  fillColor?: string;
  strokeWidth?: number;
  radius?: number;
}

// GIS Feature (GeoJSON compatible)
export interface GisFeature {
  type: 'Feature';
  id: string;
  geometry: GisGeometry;
  properties: Record<string, any>;
}

export interface GisGeometry {
  type: 'Point' | 'LineString' | 'Polygon' | 'MultiPoint' | 'MultiLineString' | 'MultiPolygon';
  coordinates: number[] | number[][] | number[][][];
}

export interface GisFeatureCollection {
  type: 'FeatureCollection';
  layer: string;
  features: GisFeature[];
  totalFeatures: number;
  bbox?: [number, number, number, number];
}

// Search & Geocoding
export interface GisSearchResult {
  id: string;
  layer: string;
  name: string;
  address?: string;
  coordinates: [number, number];
  properties: Record<string, any>;
}

export interface ReverseGeocodeResult {
  address: string;
  parcelId?: string;
  zone?: string;
  coordinates: [number, number];
}

// Buffer & Intersections
export interface BufferResult {
  type: 'Polygon';
  center: { lat: number; lon: number };
  radius: number;
  coordinates: number[][][];
}

export interface IntersectionResult {
  features: GisFeature[];
  layer1: string;
  layer2: string;
  totalCount: number;
}

// Orthophoto
export interface OrthophotoRequest {
  bboxMinX: number;
  bboxMinY: number;
  bboxMaxX: number;
  bboxMaxY: number;
  dpi?: number;
}

export interface OrthophotoResult {
  url: string;
  bounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
  dpi: number;
}

// Export
export type ExportFormat = 'geojson' | 'kml' | 'shapefile' | 'gml';

export interface ExportRequest {
  layer: string;
  format: ExportFormat;
}

export interface ExportResult {
  layer: string;
  format: ExportFormat;
  url: string;
}

// Statistics
export interface LayerStats {
  layerId: string;
  totalFeatures: number;
  areaCovered?: number;
  lastUpdated: Date;
  bounds?: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
}

// GIS Stats Overview
export interface GisStats {
  totalLayers: number;
  totalFeatures: number;
  layers: LayerStats[];
}