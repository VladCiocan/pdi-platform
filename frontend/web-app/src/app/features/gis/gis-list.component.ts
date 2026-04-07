import { Component, OnInit, inject, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { GisService } from '../../core/services/gis.service';
import {
  GisLayer,
  GisFeatureCollection,
  GisSearchResult,
  LayerStats,
  GisStats
} from '../../core/models/gis.model';

// Leaflet imports
import * as L from 'leaflet';
import { Marker, LatLng, Layer, Icon } from 'leaflet';

@Component({
  selector: 'app-gis-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSliderModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule,
    MatToolbarModule,
    MatBadgeModule,
    MatDividerModule
  ],
  template: `
    <div class="gis-container fade-in">
      <!-- Top Toolbar -->
      <div class="gis-toolbar">
        <div class="toolbar-left">
          <h1><mat-icon>map</mat-icon> Sistem Informatic Geografic</h1>
        </div>
        <div class="toolbar-center">
          <mat-form-field appearance="outline" class="search-field">
            <mat-icon matPrefix>search</mat-icon>
            <input matInput 
                   placeholder="Caută adrese, parcele, străzi..." 
                   [(ngModel)]="searchQuery"
                   (keyup.enter)="performSearch()">
            <button mat-icon-button matSuffix *ngIf="searchQuery" (click)="clearSearch()">
              <mat-icon>close</mat-icon>
            </button>
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="performSearch()">
            <mat-icon>search</mat-icon> Caută
          </button>
        </div>
        <div class="toolbar-right">
          <button mat-icon-button matTooltip="Zoom In" (click)="zoomIn()">
            <mat-icon>add</mat-icon>
          </button>
          <button mat-icon-button matTooltip="Zoom Out" (click)="zoomOut()">
            <mat-icon>remove</mat-icon>
          </button>
          <button mat-icon-button matTooltip="Centrare pe selectie" (click)="centerOnSelection()">
            <mat-icon>center_focus_strong</mat-icon>
          </button>
          <button mat-icon-button matTooltip="Refresh" (click)="refreshMap()">
            <mat-icon>refresh</mat-icon>
          </button>
        </div>
      </div>

      <div class="gis-main">
        <!-- Left Sidebar - Layers & Tools -->
        <mat-sidenav-container class="sidenav-container">
          <mat-sidenav mode="side" opened position="start" class="left-sidenav">
            
            <!-- Search Results -->
            @if (searchResults.length > 0) {
              <div class="panel search-results-panel">
                <div class="panel-header">
                  <h3><mat-icon>search</mat-icon> Rezultate Căutare ({{ searchResults.length }})</h3>
                  <button mat-icon-button (click)="clearSearch()">
                    <mat-icon>close</mat-icon>
                  </button>
                </div>
                <mat-nav-list>
                  @for (result of searchResults; track result.id) {
                    <mat-list-item (click)="selectSearchResult(result)" class="search-result-item">
                      <mat-icon matListItemIcon>location_on</mat-icon>
                      <div matListItemTitle>{{ result.name }}</div>
                      <div matListItemLine>{{ result.layer }} - {{ result.address }}</div>
                    </mat-list-item>
                  }
                </mat-nav-list>
              </div>
              <mat-divider></mat-divider>
            }

            <!-- Layers Panel -->
            <mat-expansion-panel [expanded]="true" class="layers-panel">
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <mat-icon>layers</mat-icon> Straturi GIS
                </mat-panel-title>
                <mat-panel-description>
                  {{ visibleLayersCount }} / {{ layers.length }} vizibile
                </mat-panel-description>
              </mat-expansion-panel-header>

              @if (loading) {
                <div class="loading-container">
                  <mat-spinner diameter="30"></mat-spinner>
                </div>
              } @else if (layers.length === 0) {
                <div class="empty-state">
                  <mat-icon>layers_clear</mat-icon>
                  <p>Nu sunt straturi disponibile</p>
                </div>
              } @else {
                <div class="layers-list">
                  @for (layer of layers; track layer.id) {
                    <div class="layer-item" [class.visible]="layer.visible">
                      <mat-checkbox 
                        [checked]="layer.visible"
                        (change)="toggleLayer(layer)">
                        <span class="layer-name">{{ layer.name }}</span>
                      </mat-checkbox>
                      <div class="layer-controls">
                        <button mat-icon-button 
                                matTooltip="Statistici" 
                                (click)="showLayerStats(layer); $event.stopPropagation()">
                          <mat-icon>analytics</mat-icon>
                        </button>
                        <button mat-icon-button 
                                matTooltip="Editează stil" 
                                (click)="editLayerStyle(layer); $event.stopPropagation()">
                          <mat-icon>palette</mat-icon>
                        </button>
                        <button mat-icon-button 
                                matTooltip="Exportă" 
                                (click)="exportLayer(layer); $event.stopPropagation()">
                          <mat-icon>download</mat-icon>
                        </button>
                        <mat-chip class="layer-type-chip">{{ layer.type }}</mat-chip>
                      </div>
                    </div>
                  }
                </div>
              }
            </mat-expansion-panel>

            <!-- Map Tools Panel -->
            <mat-expansion-panel class="tools-panel">
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <mat-icon>construction</mat-icon> Instrumente
                </mat-panel-title>
              </mat-expansion-panel-header>

              <div class="tools-grid">
                <button mat-stroked-button class="tool-button" 
                        [class.active]="activeTool === 'pan'"
                        (click)="setActiveTool('pan')">
                  <mat-icon>pan_tool</mat-icon>
                  <span>Pan</span>
                </button>
                <button mat-stroked-button class="tool-button"
                        [class.active]="activeTool === 'select'"
                        (click)="setActiveTool('select')">
                  <mat-icon>near_me</mat-icon>
                  <span>Select</span>
                </button>
                <button mat-stroked-button class="tool-button"
                        [class.active]="activeTool === 'draw-point'"
                        (click)="setActiveTool('draw-point')">
                  <mat-icon>add_location</mat-icon>
                  <span>Punct</span>
                </button>
                <button mat-stroked-button class="tool-button"
                        [class.active]="activeTool === 'draw-polygon'"
                        (click)="setActiveTool('draw-polygon')">
                  <mat-icon>square_foot</mat-icon>
                  <span>Polygon</span>
                </button>
                <button mat-stroked-button class="tool-button"
                        [class.active]="activeTool === 'measure'"
                        (click)="setActiveTool('measure')">
                  <mat-icon>straighten</mat-icon>
                  <span>Măsoară</span>
                </button>
                <button mat-stroked-button class="tool-button"
                        (click)="openBufferDialog()">
                  <mat-icon>circle</mat-icon>
                  <span>Buffer</span>
                </button>
              </div>

              <mat-divider></mat-divider>

              <div class="buffer-controls" *ngIf="showBufferForm">
                <h4>Creare Zonă Buffer</h4>
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Distanță (metri)</mat-label>
                  <input matInput type="number" [(ngModel)]="bufferDistance" min="10" max="5000">
                </mat-form-field>
                <div class="buffer-actions">
                  <button mat-raised-button color="primary" (click)="createBuffer()">
                    <mat-icon>check</mat-icon> Creează
                  </button>
                  <button mat-button (click)="showBufferForm = false">Anulează</button>
                </div>
              </div>
            </mat-expansion-panel>

            <!-- Coordinates Display -->
            <mat-expansion-panel class="coords-panel">
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <mat-icon>my_location</mat-icon> Coordonate Cursor
                </mat-panel-title>
              </mat-expansion-panel-header>
              <div class="coords-display">
                <div class="coord-row">
                  <span class="coord-label">Latitudine:</span>
                  <span class="coord-value">{{ cursorLat.toFixed(6) }}</span>
                </div>
                <div class="coord-row">
                  <span class="coord-label">Longitudine:</span>
                  <span class="coord-value">{{ cursorLon.toFixed(6) }}</span>
                </div>
                @if (selectedFeature) {
                  <mat-divider></mat-divider>
                  <h4>Element Selectat</h4>
                  <div class="selected-info">
                    <p><strong>Strat:</strong> {{ selectedFeature.layer }}</p>
                    <p><strong>Tip geometrie:</strong> {{ selectedFeature.geometry?.type }}</p>
                  </div>
                }
              </div>
            </mat-expansion-panel>

          </mat-sidenav>

          <!-- Main Map Area -->
          <mat-sidenav-content class="map-content">
            <div class="map-container"
                 (mousemove)="onMouseMove($event)"
                 (click)="onMapClick($event)">

              <!-- Leaflet Map Container -->
              <div #mapContainer class="leaflet-map-container"></div>

              <!-- Map Controls Overlay -->
              <div class="map-scale">
                <span>1:{{ mapScale }}</span>
              </div>

              <!-- Attribution -->
              <div class="map-attribution">
                &copy; PDI Platform - Sistem Geografic
              </div>

              <!-- North Arrow -->
              <div class="north-arrow">
                <mat-icon>north</mat-icon>
              </div>

              <!-- Loading Overlay -->
              @if (loading) {
                <div class="map-loading-overlay">
                  <mat-spinner diameter="50"></mat-spinner>
                  <p>Se încarcă datele GIS...</p>
                </div>
              }
            </div>
          </mat-sidenav-content>

          <!-- Right Sidebar - Info Panel -->
          <mat-sidenav mode="side" position="end" class="right-sidenav" *ngIf="selectedLayer">
            <div class="info-panel">
              <div class="panel-header">
                <h3><mat-icon>info</mat-icon> Informații Strat</h3>
                <button mat-icon-button (click)="selectedLayer = null">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
              
              <mat-card class="layer-info-card">
                <mat-card-header>
                  <mat-card-title>{{ selectedLayer.name }}</mat-card-title>
                  <mat-card-subtitle>ID: {{ selectedLayer.id }}</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <div class="info-row">
                    <span class="label">Tip:</span>
                    <mat-chip>{{ selectedLayer.type }}</mat-chip>
                  </div>
                  <div class="info-row">
                    <span class="label">Vizibil:</span>
                    <mat-chip [color]="selectedLayer.visible ? 'accent' : 'warn'" selected>
                      {{ selectedLayer.visible ? 'Da' : 'Nu' }}
                    </mat-chip>
                  </div>
                  @if (selectedLayerStats) {
                    <mat-divider></mat-divider>
                    <h4>Statistici</h4>
                    <div class="stats-grid">
                      <div class="stat-item">
                        <span class="stat-value">{{ selectedLayerStats.totalFeatures }}</span>
                        <span class="stat-label">Elemente</span>
                      </div>
                      <div class="stat-item" *ngIf="selectedLayerStats.areaCovered">
                        <span class="stat-value">{{ selectedLayerStats.areaCovered | number:'1.0-2' }}</span>
                        <span class="stat-label">ha</span>
                      </div>
                    </div>
                  }
                </mat-card-content>
              </mat-card>

              <mat-expansion-panel class="properties-panel">
                <mat-expansion-panel-header>
                  <mat-panel-title>Proprietăți</mat-panel-title>
                </mat-expansion-panel-header>
                <div class="properties-list">
                  <p class="no-props" *ngIf="!selectedFeature">Selectați un element de pe hartă</p>
                  @if (selectedFeature && selectedFeature.properties) {
                    @for (prop of getPropertyKeys(selectedFeature.properties); track prop) {
                      <div class="property-row">
                        <span class="prop-key">{{ prop }}</span>
                        <span class="prop-value">{{ selectedFeature.properties[prop] }}</span>
                      </div>
                    }
                  }
                </div>
              </mat-expansion-panel>

              <!-- Quick Actions -->
              <div class="quick-actions">
                <button mat-stroked-button color="primary" (click)="zoomToLayer(selectedLayer)">
                  <mat-icon>zoom_in</mat-icon> Mărește
                </button>
                <button mat-stroked-button (click)="exportLayer(selectedLayer)">
                  <mat-icon>download</mat-icon> Exportă
                </button>
              </div>
            </div>
          </mat-sidenav>
        </mat-sidenav-container>
      </div>

      <!-- Snackbar for messages -->
      <div class="snackbar-container"></div>
    </div>
  `,
  styles: [`
    .gis-container {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 64px);
      background: #f5f5f5;
    }

    .gis-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 16px;
      background: #fff;
      border-bottom: 1px solid #e0e0e0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .toolbar-left h1 {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.25rem;
      color: #333;
    }

    .toolbar-center {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .search-field {
      width: 400px;
    }

    .toolbar-right {
      display: flex;
      gap: 4px;
    }

    .gis-main {
      flex: 1;
      display: flex;
    }

    .sidenav-container {
      flex: 1;
      height: 100%;
    }

    .left-sidenav {
      width: 320px;
      background: #fff;
      border-right: 1px solid #e0e0e0;
    }

    .right-sidenav {
      width: 300px;
      background: #fff;
      border-left: 1px solid #e0e0e0;
    }

    .map-content {
      background: #e8e8e8;
    }

    .map-container {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
      cursor: crosshair;
    }

    .leaflet-map-container {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }

    .map-scale {
      position: absolute;
      bottom: 40px;
      left: 16px;
      background: rgba(255,255,255,0.9);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }

    .map-attribution {
      position: absolute;
      bottom: 8px;
      left: 8px;
      font-size: 10px;
      color: #666;
    }

    .north-arrow {
      position: absolute;
      top: 16px;
      right: 16px;
      background: rgba(255,255,255,0.9);
      padding: 8px;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .north-arrow mat-icon {
      color: #f44336;
      font-size: 24px;
    }

    .map-loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255,255,255,0.8);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .map-loading-overlay p {
      margin-top: 16px;
      color: #666;
    }

    /* Panels */
    .panel {
      padding: 12px;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .panel-header h3 {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .search-results-panel {
      max-height: 200px;
      overflow-y: auto;
    }

    .search-result-item {
      cursor: pointer;
    }

    .search-result-item:hover {
      background: #f5f5f5;
    }

    /* Layers */
    .layers-panel, .tools-panel, .coords-panel {
      box-shadow: none !important;
    }

    .layers-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .layer-item {
      display: flex;
      flex-direction: column;
      padding: 8px;
      border-radius: 4px;
      background: #f9f9f9;
    }

    .layer-item.visible {
      background: #e3f2fd;
    }

    .layer-name {
      font-weight: 500;
    }

    .layer-controls {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 4px;
    }

    .layer-type-chip {
      font-size: 10px;
      min-height: 20px;
    }

    /* Tools */
    .tools-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .tool-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px;
    }

    .tool-button.active {
      background: #e3f2fd;
      color: #1976d2;
    }

    .tool-button mat-icon {
      margin-bottom: 4px;
    }

    .buffer-controls {
      padding: 12px 0;
    }

    .full-width {
      width: 100%;
    }

    .buffer-actions {
      display: flex;
      gap: 8px;
    }

    /* Coordinates */
    .coords-display {
      font-size: 14px;
    }

    .coord-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
    }

    .coord-label {
      color: #666;
    }

    .coord-value {
      font-family: monospace;
      font-weight: 500;
    }

    /* Info Panel */
    .info-panel {
      height: 100%;
      overflow-y: auto;
    }

    .layer-info-card {
      margin: 12px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-top: 12px;
    }

    .stat-item {
      text-align: center;
    }

    .stat-value {
      display: block;
      font-size: 24px;
      font-weight: bold;
      color: #1976d2;
    }

    .stat-label {
      font-size: 12px;
      color: #666;
    }

    .properties-list {
      max-height: 200px;
      overflow-y: auto;
    }

    .property-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      border-bottom: 1px solid #eee;
      font-size: 13px;
    }

    .prop-key {
      color: #666;
    }

    .no-props {
      color: #999;
      text-align: center;
      padding: 16px;
    }

    .quick-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
    }

    /* Loading state */
    .loading-container {
      display: flex;
      justify-content: center;
      padding: 20px;
    }

    .empty-state {
      text-align: center;
      padding: 20px;
      color: #999;
    }

    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }
  `]
})
export class GisListComponent implements OnInit, AfterViewInit, OnDestroy {
  private gisService = inject(GisService);
  private snackBar = inject(MatSnackBar);

  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  // Leaflet map instance
  private map: L.Map | null = null;
  private layerControl: L.Control.Layers | null = null;
  private baseLayers: Map<string, L.TileLayer> = new Map();
  private overlayLayers: Map<string, L.Layer> = new Map();
  private featureLayer: L.GeoJSON | null = null;

  // Layers
  layers: GisLayer[] = [];
  selectedLayer: GisLayer | null = null;
  selectedLayerStats: LayerStats | null = null;
  visibleLayersCount = 0;

  // Features
  features: GisFeatureCollection | null = null;
  displayedFeatures: any[] = [];
  selectedFeature: any = null;

  // Search
  searchQuery = '';
  searchResults: GisSearchResult[] = [];

  // Map state
  cursorLat = 44.4268;
  cursorLon = 26.1025;
  mapScale = 10000;
  activeTool: string = 'pan';

  // Buffer
  showBufferForm = false;
  bufferDistance = 100;
  bufferCoords: { lat: number; lon: number } | null = null;

  // UI
  loading = false;

  ngOnInit() {
    this.loadLayers();
  }

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  /**
   * Initialize Leaflet map with OpenStreetMap base layer
   */
  private initMap() {
    if (this.map) return;

    // Fix default marker icon issue in Leaflet + Webpack
    const defaultIcon = L.icon({
      iconUrl: 'node_modules/leaflet/dist/images/marker-icon.png',
      iconRetinaUrl: 'node_modules/leaflet/dist/images/marker-icon-2x.png',
      shadowUrl: 'node_modules/leaflet/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    (L.Marker.prototype as any).options.icon = defaultIcon;

    // Initialize map centered on Nucet, Romania
    this.map = L.map('map-container', {
      center: [46.4167, 22.6833], // Nucet coordinates
      zoom: 13,
      zoomControl: false
    });

    // Add zoom control to top-right
    L.control.zoom({ position: 'topright' }).addTo(this.map);

    // Base layers
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    });

    const satelliteLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '&copy; Esri',
        maxZoom: 18
      }
    );

    const topoLayer = L.tileLayer(
      'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenTopoMap',
        maxZoom: 17
      }
    );

    // Set default base layer
    osmLayer.addTo(this.map);

    // Store base layers
    this.baseLayers.set('OpenStreetMap', osmLayer);
    this.baseLayers.set('Satelit', satelliteLayer);
    this.baseLayers.set('Topo', topoLayer);

    // Initialize layer control
    const baseLayersObj: Record<string, L.TileLayer> = {};
    this.baseLayers.forEach((layer, name) => {
      baseLayersObj[name] = layer;
    });

    this.layerControl = L.control.layers(baseLayersObj, {}, { position: 'topright' }).addTo(this.map);

    // Map move event to update coordinates
    this.map.on('mousemove', (e: L.LeafletMouseEvent) => {
      this.cursorLat = e.latlng.lat;
      this.cursorLon = e.latlng.lng;
    });

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (this.activeTool === 'draw-point') {
        L.marker(e.latlng).addTo(this.map!);
        this.showSnackBar(`Punct adăugat la: ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`);
      }
    });

    this.map.on('zoomend', () => {
      const zoom = this.map?.getZoom() || 0;
      // Approximate scale calculation
      this.mapScale = Math.round(10000 / Math.pow(2, zoom - 13));
    });
  }

  loadLayers() {
    this.loading = true;
    this.gisService.getLayers().subscribe({
      next: (layers) => {
        this.layers = layers;
        this.visibleLayersCount = layers.filter(l => l.visible).length;
        this.loading = false;

        // Auto-select first visible layer
        const visibleLayer = layers.find(l => l.visible);
        if (visibleLayer) {
          this.selectLayer(visibleLayer);
        }

        // Generate mock features for demo and add to map
        this.generateMockFeatures();
        this.addMockFeaturesToMap();
      },
      error: (err) => {
        this.loading = false;
        this.showSnackBar('Eroare la încărcarea straturilor');
        console.error(err);
      }
    });
  }

  generateMockFeatures() {
    const mockProps = {
      parcels: [
        { id: '1', name: 'Parcela A1', area: 5.5, owner: 'Popescu Ion' },
        { id: '2', name: 'Parcela A2', area: 3.2, owner: 'Ionescu Maria' },
        { id: '3', name: 'Parcela B1', area: 8.0, owner: 'Dumitrescu Gheorghe' }
      ],
      streets: [
        { id: '4', name: 'Strada Victoriei', length: 450 },
        { id: '5', name: 'Bulevardul Central', length: 1200 }
      ],
      addresses: [
        { id: '6', name: 'Str. Victoriei Nr. 10', type: 'Residential' },
        { id: '7', name: 'Str. Victoriei Nr. 25', type: 'Commercial' }
      ],
      buildings: [
        { id: '8', name: 'Primăria', floors: 3 },
        { id: '9', name: 'Școala Generală', floors: 2 }
      ]
    };

    this.displayedFeatures = [];
    for (const [layerId, feats] of Object.entries(mockProps)) {
      const layer = this.layers.find(l => l.id === layerId);
      if (layer) {
        for (const prop of feats as any[]) {
          this.displayedFeatures.push({
            id: prop.id,
            layer: layer.name,
            geometry: { type: layer.type === 'point' ? 'Point' : layer.type === 'line' ? 'LineString' : 'Polygon' },
            properties: prop,
            _x: Math.random() * 80 + 10,
            _y: Math.random() * 80 + 10
          });
        }
      }
    }
  }

  /**
   * Add mock features to the Leaflet map as GeoJSON layers
   */
  private addMockFeaturesToMap() {
    if (!this.map) return;

    // Clear existing overlay layers
    this.overlayLayers.clear();

    // Mock GeoJSON features for parcels (polygons)
    const parcelsGeoJSON: L.GeoJSON = L.geoJSON(
      {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { name: 'Parcela A1', area: 5.5, owner: 'Popescu Ion' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [22.6750, 46.4200], [22.6780, 46.4200], [22.6780, 46.4170],
                [22.6750, 46.4170], [22.6750, 46.4200]
              ]]
            }
          } as GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>,
          {
            type: 'Feature',
            properties: { name: 'Parcela A2', area: 3.2, owner: 'Ionescu Maria' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [22.6785, 46.4200], [22.6810, 46.4200], [22.6810, 46.4175],
                [22.6785, 46.4175], [22.6785, 46.4200]
              ]]
            }
          } as GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>,
          {
            type: 'Feature',
            properties: { name: 'Parcela B1', area: 8.0, owner: 'Dumitrescu Gheorghe' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [22.6815, 46.4195], [22.6860, 46.4195], [22.6860, 46.4155],
                [22.6815, 46.4155], [22.6815, 46.4195]
              ]]
            }
          } as GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
        ]
      } as GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>,
      {
        style: {
          color: '#4caf50',
          fillColor: '#4caf50',
          fillOpacity: 0.3,
          weight: 2
        },
        onEachFeature: (feature, layer) => {
          if (feature.properties && feature.properties.name) {
            layer.bindPopup(`<b>${feature.properties.name}</b><br>Suprafață: ${feature.properties.area} ha<br>Proprietar: ${feature.properties.owner}`);
          }
          layer.on('click', () => this.selectFeature(feature));
        }
      }
    );

    // Mock GeoJSON features for buildings (points)
    const buildingsGeoJSON: L.GeoJSON = L.geoJSON(
      {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { name: 'Primăria', floors: 3 },
            geometry: { type: 'Point', coordinates: [22.6833, 46.4167] }
          } as GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>,
          {
            type: 'Feature',
            properties: { name: 'Școala Generală', floors: 2 },
            geometry: { type: 'Point', coordinates: [22.6850, 46.4180] }
          } as GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
        ]
      } as GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>,
      {
        onEachFeature: (feature, layer) => {
          if (feature.properties && feature.properties.name) {
            layer.bindPopup(`<b>${feature.properties.name}</b><br>Etaje: ${feature.properties.floors}`);
          }
          layer.on('click', () => this.selectFeature(feature));
        }
      }
    );

    // Mock GeoJSON features for streets (lines)
    const streetsGeoJSON: L.GeoJSON = L.geoJSON(
      {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { name: 'Strada Victoriei', length: 450 },
            geometry: {
              type: 'LineString',
              coordinates: [[22.6780, 46.4160], [22.6810, 46.4170], [22.6840, 46.4175]]
            }
          } as GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>,
          {
            type: 'Feature',
            properties: { name: 'Bulevardul Central', length: 1200 },
            geometry: {
              type: 'LineString',
              coordinates: [[22.6750, 46.4140], [22.6800, 46.4155], [22.6850, 46.4170], [22.6900, 46.4180]]
            }
          } as GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
        ]
      } as GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>,
      {
        style: {
          color: '#ff9800',
          weight: 4
        },
        onEachFeature: (feature, layer) => {
          if (feature.properties && feature.properties.name) {
            layer.bindPopup(`<b>${feature.properties.name}</b><br>Lungime: ${feature.properties.length}m`);
          }
          layer.on('click', () => this.selectFeature(feature));
        }
      }
    );

    // Add layers to map and store references
    this.overlayLayers.set('parcels', parcelsGeoJSON);
    this.overlayLayers.set('buildings', buildingsGeoJSON);
    this.overlayLayers.set('streets', streetsGeoJSON);

    // Add to layer control
    if (this.layerControl) {
      this.layerControl.addOverlay(parcelsGeoJSON, 'Parcele');
      this.layerControl.addOverlay(buildingsGeoJSON, 'Clădiri');
      this.layerControl.addOverlay(streetsGeoJSON, 'Străzi');
    }

    // Add default visible layers
    parcelsGeoJSON.addTo(this.map);
    buildingsGeoJSON.addTo(this.map);
  }

  toggleLayer(layer: GisLayer) {
    layer.visible = !layer.visible;
    this.visibleLayersCount = this.layers.filter(l => l.visible).length;
    this.showSnackBar(`Stratul ${layer.name} ${layer.visible ? 'vizibil' : 'invizibil'}`);

    // Toggle corresponding Leaflet overlay
    const overlayMap: Record<string, string> = {
      'parcels': 'parcels',
      'buildings': 'buildings',
      'streets': 'streets'
    };
    const overlayKey = overlayMap[layer.id];
    if (overlayKey && this.overlayLayers.has(overlayKey)) {
      const overlay = this.overlayLayers.get(overlayKey)!;
      if (layer.visible) {
        overlay.addTo(this.map!);
      } else {
        this.map?.removeLayer(overlay);
      }
    }
  }

  selectLayer(layer: GisLayer) {
    this.selectedLayer = layer;
    if (layer.visible) {
      this.loadLayerFeatures(layer.id);
    }
  }

  loadLayerFeatures(layerId: string) {
    this.loading = true;
    this.gisService.getLayerFeatures(layerId).subscribe({
      next: (features) => {
        this.features = features;
        this.displayedFeatures = features.features || [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      }
    });
  }

  showLayerStats(layer: GisLayer) {
    this.selectedLayer = layer;
    this.loading = true;
    this.gisService.getLayerStats(layer.id).subscribe({
      next: (stats) => {
        this.selectedLayerStats = stats;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showSnackBar('Eroare la încărcarea statistilor');
      }
    });
  }

  editLayerStyle(layer: GisLayer) {
    this.showSnackBar(`Editare stil pentru ${layer.name} (în dezvoltare)`);
  }

  exportLayer(layer: GisLayer) {
    this.gisService.exportData(layer.id).subscribe({
      next: (result) => {
        this.showSnackBar(`Export: ${result.url}`);
        // In real app, would trigger download
      },
      error: () => {
        this.showSnackBar('Eroare la export');
      }
    });
  }

  // Search
  performSearch() {
    if (!this.searchQuery.trim()) return;
    
    this.loading = true;
    this.gisService.search(this.searchQuery).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.loading = false;
        if (results.length === 0) {
          this.showSnackBar('Niciun rezultat găsit');
        }
      },
      error: () => {
        // Mock search results for demo
        this.searchResults = [
          {
            id: 'mock1',
            layer: 'Parcele',
            name: `${this.searchQuery}`,
            address: 'Strada Principală, Nr. 5',
            coordinates: [26.1025, 44.4268],
            properties: {}
          }
        ];
        this.loading = false;
      }
    });
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];
    this.selectedFeature = null;
  }

  selectSearchResult(result: GisSearchResult) {
    this.cursorLat = result.coordinates[1];
    this.cursorLon = result.coordinates[0];
    this.showSnackBar(`Centrat pe: ${result.name}`);
  }

  // Map interactions
  onMouseMove(event: MouseEvent) {
    // Coordinates are updated via Leaflet's mousemove event in initMap
  }

  onMapClick(event: MouseEvent) {
    // Click handling is done via Leaflet's click event in initMap
  }

  setActiveTool(tool: string) {
    this.activeTool = this.activeTool === tool ? 'pan' : tool;
  }

  zoomIn() {
    this.mapScale = Math.max(1000, this.mapScale / 2);
  }

  zoomOut() {
    this.mapScale = Math.min(100000, this.mapScale * 2);
  }

  centerOnSelection() {
    if (this.selectedFeature) {
      this.showSnackBar('Centrat pe selecție');
    }
  }

  refreshMap() {
    this.loadLayers();
    this.showSnackBar('Hartă reîmprospătată');
  }

  selectFeature(feature: any) {
    this.selectedFeature = feature;
    this.showSnackBar(`Selectat: ${feature.properties?.name || feature.id}`);
  }

  // Buffer
  openBufferDialog() {
    this.bufferCoords = { lat: this.cursorLat, lon: this.cursorLon };
    this.showBufferForm = true;
  }

  createBuffer() {
    if (!this.bufferCoords) return;
    
    this.loading = true;
    this.gisService.createBuffer(this.bufferCoords.lat, this.bufferCoords.lon, this.bufferDistance).subscribe({
      next: (result) => {
        this.loading = false;
        this.showBufferForm = false;
        this.showSnackBar(`Zonă buffer creată: ${this.bufferDistance}m`);
      },
      error: () => {
        this.loading = false;
        this.showBufferForm = false;
        this.showSnackBar('Zonă buffer creată (demo)');
      }
    });
  }

  zoomToLayer(layer: GisLayer) {
    this.showSnackBar(`Mărire pe stratul ${layer.name}`);
  }

  // Helpers (removed old placeholder map methods)

  getPropertyKeys(props: Record<string, any>): string[] {
    return Object.keys(props || {});
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, 'Închide', { duration: 3000 });
  }
}