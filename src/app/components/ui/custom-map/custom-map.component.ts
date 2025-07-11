import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import decode from 'decode-base64';
import {CoreWaterResourceAreaService} from "../../../shared/services/core-water-resource-area.service";

import * as L from "leaflet";
import {CoreWaterResourceUnitService} from "../../../shared/services/core-water-resource-unit.service";
import {COMMON_MODULES} from "../../../custom-material/custom-material.module";
import {LocationService} from "../../../shared/services/location.service";
import {NotificationService} from "../../../shared/services/notification.service";
import {Clipboard} from '@angular/cdk/clipboard';
import {GeoJSON, icon} from "leaflet";
// import * as console from "node:console";
// import {window} from "rxjs";
import {SpinnerService} from "../../../shared/services/spinner.service";

@Component({
  selector: 'app-custom-map',
  standalone: true,
  imports: [
    COMMON_MODULES

  ],
  templateUrl: './custom-map.component.html',
  styleUrl: './custom-map.component.scss'
})
export class CustomMapComponent implements OnInit, AfterViewInit {
  showSpinner: boolean = false;
  private map!: L.Map
  markers: L.Marker[] = [
    L.marker([-13.9626121, 33.7741195]) // Lilongwe, Malawi
  ];
  wra: GeoJSON.Feature[];
  zoom: number = 7;
  center = [];
  areaMode: boolean = true;
  wraName: string;


  constructor(private wruService: CoreWaterResourceUnitService, private wraService: CoreWaterResourceAreaService, private locationService: LocationService,
              private notificationService: NotificationService, private clipboard: Clipboard, public spinnerService: SpinnerService,private changeDetectorRef: ChangeDetectorRef,) {
  }

  ngOnInit(): void {
    this.spinnerService.visibility.subscribe( (res) => {
      this.showSpinner = res;
      this.changeDetectorRef.detectChanges();
    });
    this.getWRA().then( () => {});
  }
  async getWRA() {
    this.areaMode = true;
    this.wraName="Water resource areas ";
    await this.locationService.getPosition().then(pos => {
      // console.log(`Position: ${pos.lng} ${pos.lat}`);
      this.center = [pos.lat, pos.lng]
    });
    if (this.center.length == 0) {
      // Center LL if user location not detectable
      this.center = [-13.9626121, 33.7741195]
    }
    this.wraService.getAll().then(res => {
      this.zoom = 7;
      this.transformData(res);
    });
  }
  createMap(): void {
    if(this.map) {
      this.map.remove();
    }
    // setTimeout( () => {
      this.map = L.map("map", {
        center: L.latLng(this.center[0], this.center[1]),
        zoom: this.zoom
      });
    // the marker gets it's position from map.getCenter()
    const ICON = icon({
      iconUrl: "marker-icon.png",
      iconSize: [32, 32],
    })
    const marker = L.marker(this.map.getCenter()).addTo(this.map)
      .setIcon(ICON)
      .bindPopup("Your position")
      .openPopup();

      const openStreetLayer = new    L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 3,
          maxZoom: 18,
        attribution: '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> '
    });
    openStreetLayer.addTo(this.map);
    // this.centerMap();
      this.wra.forEach( x => {
        // console.log(x);
        L.geoJSON(x
          , {
            onEachFeature: this.onEachFeature,
            style: this.style
          }
          )
          .on('click', (e: any) => {
            // alert(e.latlng)
            this.center = [e.latlng.lat,e.latlng.lng];
            this.zoom = 9;
            // console.log(e.sourceTarget.feature);
            if(this.areaMode)
            {
              // Only if area mode, we can get units
              this.wruService.getByArea(e.sourceTarget.feature.id).then(res => {
                this.areaMode = false;
                this.wraName="Water resource units for area "+e.sourceTarget.feature.properties?.Name;
                this.transformData(res);
              });
            } else {
              this.copyCoordinate();
            }
          }
        )
          .addTo(this.map);
      })
    // }, 3000);

  }

  // private centerMap() {
  //   // Create a boundary based on the markers
  //   const bounds = L.latLngBounds(this.markers.map(marker => marker.getLatLng()));
  //
  //   // Fit the map into the boundary
  //   this.map.fitBounds(bounds);
  // }

  onEachFeature(feature: any, layer: any) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.Name) {
      layer.bindPopup(feature.properties.Name);
      layer.bindTooltip(feature.properties.Name.toString(), { permanent: true });
    }
  }
  style(feature: any) {
      const val = parseInt(feature.properties?.Name, 10);
      // console.log(val)
      switch (true) {
        // case (val<=10): return {color: "#ff0000"};
        // case val>10:   return {color: "#00FF00"};
        // default: return {color: "#0000ff", fillColor: '#3399FF', weight: 2, opacity: 1, dashArray: '3', fillOpacity: 0.7};
        default: return {color: "#0000ff", fillColor: '#3399FF', weight: 2, opacity: 1, dashArray: '3', fillOpacity: 0.4};
      }
  }

  wraClick(e: any) {
    console.log(e.sourceTarget.feature);
  }

  private transformData(res: any) {
    this.wra = (res || []).map(it => {
      let obj = {} as any;
      obj.id = it.id;
      obj.type = it.geoType;
      obj.geometry = JSON.parse(new TextDecoder().decode(decode(it.geoGeometry))) as any;
      obj.properties = JSON.parse(new TextDecoder().decode(decode(it.geoProperty))) as any;
      return obj;

    });
    this.createMap();
  }

  copyCoordinate() {
    const points: string = this.center.join(", ");
    this.notificationService.coreConfirm("Chosen coordinates", points, ["Copy & continue", "Cancel"]).then( x => {
      if(x) {
        this.clipboard.copy(points);
        this.notificationService.coreInformation("LAT/LNG info", "Paste the copied data in the LAT/LNG fields. First number is LAT and the second number is LNG")
          .then(y => {
            window.close();
          });
        // this.notificationService.info("Info", "Copied to clipboard");

      }
    });
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }
}
