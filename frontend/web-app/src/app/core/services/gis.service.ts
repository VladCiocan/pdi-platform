import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  GisLayer,
  GisFeatureCollection,
  GisSearchResult,
  ReverseGeocodeResult,
  BufferResult,
  ExportResult,
  LayerStats,
  GisStats,
  OrthophotoRequest,
  GisFeature
} from '../models/gis.model';

@Injectable({ providedIn: 'root' })
export class GisService {
  private readonly API_URL = `${environment.apiUrl}/gis`;

  constructor(private http: HttpClient) {}

  // === Layers ===
  getLayers(): Observable<GisLayer[]> {
    return this.http.get<GisLayer[]>(`${this.API_URL}/layers`);
  }

  // === Features ===
  getLayerFeatures(
    layerId: string,
    bbox?: { minX: number; minY: number; maxX: number; maxY: number }
  ): Observable<GisFeatureCollection> {
    let params = new HttpParams();
    if (bbox) {
      params = params
        .set('bboxMinX', bbox.minX.toString())
        .set('bboxMinY', bbox.minY.toString())
        .set('bboxMaxX', bbox.maxX.toString())
        .set('bboxMaxY', bbox.maxY.toString());
    }
    return this.http.get<GisFeatureCollection>(
      `${this.API_URL}/layers/${layerId}/features`,
      { params }
    );
  }

  // === Search ===
  search(query: string, layer?: string): Observable<GisSearchResult[]> {
    let params = new HttpParams().set('query', query);
    if (layer) params = params.set('layer', layer);
    return this.http.get<GisSearchResult[]>(`${this.API_URL}/search`, { params });
  }

  // === Reverse Geocoding ===
  reverseGeocode(lat: number, lon: number): Observable<ReverseGeocodeResult> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lon', lon.toString());
    return this.http.get<ReverseGeocodeResult>(
      `${this.API_URL}/reverse-geocode`,
      { params }
    );
  }

  // === Buffer ===
  createBuffer(lat: number, lon: number, distanceMeters: number): Observable<BufferResult> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lon', lon.toString())
      .set('distanceMeters', distanceMeters.toString());
    return this.http.get<BufferResult>(`${this.API_URL}/buffer`, { params });
  }

  // === Intersections ===
  findIntersections(
    layer1: string,
    layer2: string,
    bbox: { minX: number; minY: number; maxX: number; maxY: number }
  ): Observable<{ features: GisFeature[] }> {
    const params = new HttpParams()
      .set('layer1', layer1)
      .set('layer2', layer2)
      .set('bboxMinX', bbox.minX.toString())
      .set('bboxMinY', bbox.minY.toString())
      .set('bboxMaxX', bbox.maxX.toString())
      .set('bboxMaxY', bbox.maxY.toString());
    return this.http.get<{ features: GisFeature[] }>(
      `${this.API_URL}/intersects`,
      { params }
    );
  }

  // === Orthophoto ===
  getOrthophoto(bbox: OrthophotoRequest): Observable<{ url: string; bounds: any; dpi: number }> {
    const params = new HttpParams()
      .set('bboxMinX', bbox.bboxMinX.toString())
      .set('bboxMinY', bbox.bboxMinY.toString())
      .set('bboxMaxX', bbox.bboxMaxX.toString())
      .set('bboxMaxY', bbox.bboxMaxY.toString())
      .set('dpi', (bbox.dpi || 150).toString());
    return this.http.get<{ url: string; bounds: any; dpi: number }>(
      `${this.API_URL}/raster/orthophoto`,
      { params }
    );
  }

  // === Export ===
  exportData(layer: string, format: string = 'geojson'): Observable<ExportResult> {
    const params = new HttpParams()
      .set('layer', layer)
      .set('format', format);
    return this.http.get<ExportResult>(`${this.API_URL}/export`, { params });
  }

  // === Statistics ===
  getLayerStats(layerId: string): Observable<LayerStats> {
    return this.http.get<LayerStats>(
      `${this.API_URL}/stats/layer/${layerId}`
    );
  }

  getStats(): Observable<GisStats> {
    return this.http.get<GisStats>(`${this.API_URL}/stats`);
  }
}