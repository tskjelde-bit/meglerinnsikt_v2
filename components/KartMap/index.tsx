import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import Mapbox, { Marker, NavigationControl, Source, Layer, MapRef } from 'react-map-gl';
import type mapboxgl from 'mapbox-gl';
import { useMap } from '@/context/Map';
import { kartMapStyle } from './kartMapStyle';
import { prefixPath } from '@/utils/path';
import classes from './KartMap.module.css';

// ---- Mock data per bydel ----
const districtData: Record<string, {
  priceChange: number;
  turnoverDays: number;
  sqmPrice: number;
  statusText: string;
  sellerPoints: string[];
  buyerPoints: string[];
}> = {
  'Frogner': {
    priceChange: 1.5, turnoverDays: 25, sqmPrice: 125000,
    statusText: 'Denne bydelen ligger nå over Oslo-snittet, med moderat omsetningshastighet.',
    sellerPoints: ['Stabil etterspørsel gir forutsigbar salgsprosess', 'Høy kvm-pris gir godt grunnlag for prising'],
    buyerPoints: ['Moderat konkurranse sammenlignet med sentrale bydeler', 'Prisene har steget mindre enn snittet – mulighet for verdiøkning'],
  },
  'Grünerløkka': {
    priceChange: 3.2, turnoverDays: 16, sqmPrice: 105000,
    statusText: 'Denne bydelen ligger nå over Oslo-snittet, med relativt rask omsetning.',
    sellerPoints: ['Rask omsetning betyr kort tid på markedet', 'Prisene stiger raskere enn snittet – godt tidspunkt å selge'],
    buyerPoints: ['Høy konkurranse – vær forberedt på budrunder', 'Prisvekst over snittet kan bety at vindusperioden lukker seg'],
  },
  'St. Hanshaugen': {
    priceChange: 2.9, turnoverDays: 18, sqmPrice: 112000,
    statusText: 'Denne bydelen ligger nå rundt Oslo-snittet, med normal omsetningshastighet.',
    sellerPoints: ['Balansert marked gir rom for god prissetting', 'Stabil etterspørsel fra unge profesjonelle'],
    buyerPoints: ['Markedet er ikke overopphetet – tid til å vurdere', 'God balanse mellom tilbud og etterspørsel'],
  },
  'Sagene': {
    priceChange: 3.5, turnoverDays: 14, sqmPrice: 108000,
    statusText: 'Denne bydelen ligger nå over Oslo-snittet, med relativt rask omsetning.',
    sellerPoints: ['Svært rask omsetning – boliger selges fort', 'Prisvekst godt over snittet'],
    buyerPoints: ['Forvent sterk konkurranse i budrunder', 'Prisene stiger raskt – handle tidlig'],
  },
  'Gamle Oslo': {
    priceChange: 4.1, turnoverDays: 15, sqmPrice: 102000,
    statusText: 'Denne bydelen ligger nå over Oslo-snittet, med rask omsetning.',
    sellerPoints: ['Sterk prisvekst gir mulighet for god fortjeneste', 'Kort liggetid på markedet'],
    buyerPoints: ['Prisene øker raskt – vurder å handle snart', 'Stort utvalg av boligtyper i ulike prisklasser'],
  },
  'Nordstrand': {
    priceChange: 2.2, turnoverDays: 35, sqmPrice: 85000,
    statusText: 'Denne bydelen ligger nå rundt Oslo-snittet, med rolig omsetning.',
    sellerPoints: ['Lengre liggetid krever tålmodighet og riktig prising', 'Familieboliger har stabil etterspørsel'],
    buyerPoints: ['Rolig marked gir bedre forhandlingsposisjon', 'Lavere kvm-pris enn sentrale bydeler'],
  },
  'Nordre Aker': {
    priceChange: 2.5, turnoverDays: 28, sqmPrice: 94000,
    statusText: 'Denne bydelen ligger nå rundt Oslo-snittet, med normal omsetningshastighet.',
    sellerPoints: ['Stabil etterspørsel fra familier', 'God prisstabilitet over tid'],
    buyerPoints: ['Moderate priser for kvalitetsområde', 'Mer tid til å finne riktig bolig'],
  },
  'Vestre Aker': {
    priceChange: 1.8, turnoverDays: 32, sqmPrice: 98000,
    statusText: 'Denne bydelen ligger nå under Oslo-snittet i prisvekst, med rolig omsetning.',
    sellerPoints: ['Premium-segment krever riktig prising', 'Kjøpere er selektive – boligstandard avgjør'],
    buyerPoints: ['Lavere prisvekst gir rom for forhandling', 'Lengre liggetid betyr mindre press'],
  },
  'Ullern': {
    priceChange: 1.6, turnoverDays: 30, sqmPrice: 100000,
    statusText: 'Denne bydelen ligger nå under Oslo-snittet i prisvekst, med moderat omsetning.',
    sellerPoints: ['Høy kvm-pris, men moderat etterspørsel', 'Riktig styling og prising er avgjørende'],
    buyerPoints: ['Mulighet for å forhandle på pris', 'Premium-område med lavere konkurransepress'],
  },
  'Østensjø': {
    priceChange: 3.8, turnoverDays: 20, sqmPrice: 78000,
    statusText: 'Denne bydelen ligger nå over Oslo-snittet, med god omsetning.',
    sellerPoints: ['Sterk prisvekst gjør det til et godt tidspunkt å selge', 'God omsetningshastighet'],
    buyerPoints: ['Prisvekst over snittet kan fortsette', 'Lavere kvm-pris enn mange bydeler – god inngang'],
  },
  'Alna': {
    priceChange: 5.2, turnoverDays: 19, sqmPrice: 65000,
    statusText: 'Denne bydelen ligger nå godt over Oslo-snittet, med rask omsetning.',
    sellerPoints: ['Svært sterk prisvekst – markedet er varmt', 'Rask omsetning gir kort salgsprosess'],
    buyerPoints: ['Blant de mest prisgunstige bydelene', 'Sterk vekst kan gi god verdiutvikling'],
  },
  'Bjerke': {
    priceChange: 4.5, turnoverDays: 21, sqmPrice: 72000,
    statusText: 'Denne bydelen ligger nå over Oslo-snittet, med god omsetning.',
    sellerPoints: ['Prisene stiger markant – selg mens trenden varer', 'God etterspørsel i alle segmenter'],
    buyerPoints: ['Overkommelig prisnivå med sterk vekst', 'God infrastruktur og utvikling i området'],
  },
  'Grorud': {
    priceChange: 5.8, turnoverDays: 24, sqmPrice: 58000,
    statusText: 'Denne bydelen ligger nå godt over Oslo-snittet, med moderat omsetning.',
    sellerPoints: ['Blant bydelene med sterkest prisvekst', 'Økende interesse fra førstegangskjøpere'],
    buyerPoints: ['Lavest kvm-pris i Oslo – god inngangsport', 'Sterk prisvekst kan gi god avkastning'],
  },
  'Stovner': {
    priceChange: 6.1, turnoverDays: 26, sqmPrice: 52000,
    statusText: 'Denne bydelen ligger nå godt over Oslo-snittet, med moderat omsetning.',
    sellerPoints: ['Sterkest prisvekst i Oslo – markedet er varmt', 'Økende etterspørsel løfter prisene'],
    buyerPoints: ['Laveste kvm-pris i Oslo', 'Stor verdiøkningspotensial basert på pristrend'],
  },
  'Søndre Nordstrand': {
    priceChange: 4.9, turnoverDays: 29, sqmPrice: 54000,
    statusText: 'Denne bydelen ligger nå over Oslo-snittet, med moderat omsetning.',
    sellerPoints: ['Sterk prisvekst gir gode salgsmuligheter', 'Familieboliger er etterspurt'],
    buyerPoints: ['Prisgunstig med sterk utvikling', 'Mer plass for pengene enn sentrale bydeler'],
  },
  'Sentrum': {
    priceChange: 2.0, turnoverDays: 20, sqmPrice: 110000,
    statusText: 'Denne bydelen ligger nå rundt Oslo-snittet, med normal omsetning.',
    sellerPoints: ['Sentralt beliggenhet er alltid etterspurt', 'Kompakte leiligheter selges raskt'],
    buyerPoints: ['Stabil verdiutvikling over tid', 'Høy kvm-pris, men svært sentral beliggenhet'],
  },
};

// Oslo-wide default data
const osloDefault = {
  statusText: 'Hovedstaden er preget av høy etterspørsel og moderat prisvekst.',
  priceChange: 2.8,
  turnoverDays: 22,
  sqmPrice: 92000,
  sellerPoints: ['Stabil etterspørsel i de fleste bydeler', 'Moderat prisvekst gir forutsigbarhet'],
  buyerPoints: ['Variert tilbud på tvers av bydeler', 'Klikk på en bydel for detaljert innsikt'],
};

// Choropleth color scale based on priceChange value
const CHOROPLETH_SCALE: [number, string][] = [
  [0, '#F1F5F9'],
  [2, '#DBEAFE'],
  [3, '#BFDBFE'],
  [4, '#93C5FD'],
  [5, '#60A5FA'],
  [6, '#3B82F6'],
];
const CHOROPLETH_MAX = '#2563EB';

function getChoroplethColor(priceChange: number): string {
  for (let i = CHOROPLETH_SCALE.length - 1; i >= 0; i--) {
    if (priceChange >= CHOROPLETH_SCALE[i][0]) return CHOROPLETH_SCALE[i][1];
  }
  return CHOROPLETH_SCALE[0][1];
}

function KartMap() {
  const { center, setCenter, selectedDistrict, setSelectedDistrict } = useMap();
  const mapRef = useRef<MapRef>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [labelFeatures, setLabelFeatures] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formRole, setFormRole] = useState<string | null>(null);
  const [formSize, setFormSize] = useState(70);

  useEffect(() => {
    fetch(prefixPath('/oslo_label_points.geojson?v=2'))
      .then(res => res.json())
      .then(data => {
        if (data.features) setLabelFeatures(data.features);
      })
      .catch(err => console.error('Error loading labels:', err));
  }, []);

  // True choropleth: varying blue shades based on priceChange
  const fillColorExpression: any = (() => {
    const expr: any[] = ['case'];
    Object.entries(districtData).forEach(([name, data]) => {
      expr.push(['==', ['get', 'BYDELSNAVN'], name]);
      if (selectedDistrict === name) {
        expr.push('#2D4B5F');
      } else if (hoveredDistrict === name) {
        const natural = getChoroplethColor(data.priceChange);
        const idx = CHOROPLETH_SCALE.findIndex(([, c]) => c === natural);
        expr.push(idx < CHOROPLETH_SCALE.length - 1 ? CHOROPLETH_SCALE[idx + 1][1] : CHOROPLETH_MAX);
      } else {
        expr.push(getChoroplethColor(data.priceChange));
      }
    });
    expr.push('rgba(0, 0, 0, 0)');
    return expr;
  })();

  const outlineColorExpression = '#FFFFFF';
  const outlineWidthExpression = 1;

  const onHover = useCallback((event: mapboxgl.MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    setHoveredDistrict(feature?.properties?.BYDELSNAVN || null);
  }, []);

  const onClick = useCallback((event: mapboxgl.MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    const name = feature?.properties?.BYDELSNAVN;
    if (name && districtData[name]) {
      setSelectedDistrict(name);
    }
  }, [setSelectedDistrict]);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const currentData = selectedDistrict ? districtData[selectedDistrict] : null;
  const displayData = currentData || osloDefault;
  const displayName = selectedDistrict || 'Oslo';

  const fmtSqm = (v: number) => v.toLocaleString('nb-NO');

  return (
    <div className={classes.pageLayout}>
      {/* LEFT: Static about column */}
      <div className={classes.aboutColumn}>
        <div className={classes.columnUpper}>
          <h1 className={classes.aboutTitle}>#1 Innsikt i <span className={classes.aboutTitleGradient}>BoligMarkedet</span></h1>
          <p className={classes.aboutText}>Det du ønsker å vite om boligmarkedet. Motta min månedlige oppdatering på boligmarkedet i Oslo. Faglig og ærlig om fortid, nåtid og fremtid.</p>
        </div>

        <div className={classes.columnLower}>
          <div className={classes.aboutFeatures}>
            <div className={classes.aboutFeature}>
              <svg className={classes.aboutFeatureIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <div className={classes.aboutFeatureText}>
                <p className={classes.aboutFeatureTitle}>Selgere</p>
                <p className={classes.aboutFeatureDesc}>{displayData.sellerPoints[0]}</p>
              </div>
            </div>
            <div className={classes.aboutFeature}>
              <svg className={classes.aboutFeatureIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M16 8l-4 4-4-4" />
              </svg>
              <div className={classes.aboutFeatureText}>
                <p className={classes.aboutFeatureTitle}>Kjøpere</p>
                <p className={classes.aboutFeatureDesc}>{displayData.buyerPoints[0]}</p>
              </div>
            </div>
            <div className={classes.aboutFeature}>
              <svg className={classes.aboutFeatureIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <div className={classes.aboutFeatureText}>
                <p className={classes.aboutFeatureTitle}>Meglere</p>
                <p className={classes.aboutFeatureDesc}>Datadrevet innsikt for rådgivning</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CENTER: Map */}
      <div className={classes.mapColumn}>
        <Mapbox
          ref={mapRef}
          initialViewState={{
            latitude: 59.93,
            longitude: 10.79,
            zoom: 11.0,
            bearing: 0,
            pitch: 0,
          }}
          onMove={(evt) => setCenter(evt.viewState)}
          onClick={onClick}
          onMouseMove={onHover}
          onMouseLeave={() => setHoveredDistrict(null)}
          onLoad={() => setIsLoaded(true)}
          interactiveLayerIds={['kart-bydel-polygons']}
          cursor={hoveredDistrict ? 'pointer' : 'auto'}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          mapStyle={kartMapStyle as any}
          style={{ width: '100%', height: '100%' }}
        >
          <NavigationControl position="top-left" showCompass={false} />

          {isLoaded && (
            <>
              <Source id="kart-oslo-bydeler" type="geojson" data={prefixPath('/oslo_bydeler.geojson?v=5')}>
                <Layer
                  id="kart-bydel-polygons"
                  type="fill"
                  paint={{
                    'fill-color': fillColorExpression,
                    'fill-color-transition': { duration: 300 },
                  }}
                />
                <Layer
                  id="kart-bydel-outlines"
                  type="line"
                  paint={{
                    'line-color': outlineColorExpression,
                    'line-width': outlineWidthExpression,
                    'line-color-transition': { duration: 300 },
                    'line-width-transition': { duration: 300 },
                  }}
                />
              </Source>

              {labelFeatures.map((feature, index) => {
                const name = feature.properties?.BYDELSNAVN;
                const coords = feature.geometry.coordinates;
                if (!name || !coords) return null;
                const isSelected = name === selectedDistrict;
                return (
                  <Marker
                    key={`kart-label-${index}`}
                    latitude={coords[1]}
                    longitude={coords[0]}
                    style={{ zIndex: isSelected ? 100 : 10 }}
                  >
                    <div
                      className={`${classes.mapLabel} ${isSelected ? classes.mapLabelActive : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (districtData[name]) setSelectedDistrict(name);
                      }}
                    >
                      {name}
                    </div>
                  </Marker>
                );
              })}
            </>
          )}
        </Mapbox>
      </div>

      {/* RIGHT: Dynamic stats column */}
      <div className={classes.statsColumn}>
        <div className={classes.columnUpper}>
          <h2 className={classes.statsTitle}>{displayName}</h2>
          <div className={classes.keyFigures}>
            <div className={classes.keyFigure}>
              <div className={classes.keyFigureValue}>
                {displayData.priceChange > 0 ? '+' : ''}{displayData.priceChange.toFixed(1)}%
              </div>
              <div className={classes.keyFigureLabel}>Prisendring i år</div>
            </div>
            <div className={classes.keyFigure}>
              <div className={classes.keyFigureValue}>{displayData.turnoverDays}</div>
              <div className={classes.keyFigureLabel}>Dager omsetning</div>
            </div>
            <div className={classes.keyFigure}>
              <div className={classes.keyFigureValue}>{fmtSqm(displayData.sqmPrice)}</div>
              <div className={classes.keyFigureLabel}>Kr/m²</div>
            </div>
          </div>
        </div>

        <div className={classes.columnLower}>
          <p className={classes.statusLine}>{displayData.statusText}</p>
          {currentData && (
            <button className={classes.ctaButton} onClick={openModal}>
              Hva betyr dette for min bolig?
            </button>
          )}
        </div>
      </div>

      {/* Form Modal */}
      <div className={`${classes.modalOverlay} ${modalOpen ? classes.open : ''}`} onClick={closeModal}>
        <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
          <div className={classes.modalHeader}>
            <div>
              <h2 className={classes.modalTitle}>Hva betyr dette for min bolig?</h2>
              <p className={classes.modalSubtitle}>
                Basert på dagens marked i {selectedDistrict || '...'}
              </p>
            </div>
            <button className={classes.modalClose} onClick={closeModal} aria-label="Lukk">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className={classes.modalBody}>
            <div className={classes.formGroup}>
              <label className={classes.formLabel}>Boligtype</label>
              <select className={classes.formSelect} defaultValue="">
                <option value="" disabled>Velg boligtype</option>
                <option value="leilighet">Leilighet</option>
                <option value="rekkehus">Rekkehus</option>
                <option value="enebolig">Enebolig</option>
                <option value="tomannsbolig">Tomannsbolig</option>
              </select>
            </div>
            <div className={classes.formGroup}>
              <label className={classes.formLabel}>Ca. størrelse</label>
              <div className={classes.rangeGroup}>
                <input type="range" className={classes.formRange} min={20} max={250} step={5} value={formSize} onChange={(e) => setFormSize(Number(e.target.value))} />
                <span className={classes.rangeValue}>{formSize} m²</span>
              </div>
            </div>
            <div className={classes.formGroup}>
              <label className={classes.formLabel}>Jeg er</label>
              <div className={classes.roleSelector}>
                {['Selger', 'Kjøper', 'Begge'].map((role) => (
                  <button key={role} type="button" className={`${classes.roleOption} ${formRole === role ? classes.selected : ''}`} onClick={() => setFormRole(role)}>{role}</button>
                ))}
              </div>
            </div>
            <div className={classes.formGroup}>
              <label className={classes.formLabel}>Navn</label>
              <input type="text" className={classes.formInput} placeholder="Ditt navn" />
            </div>
            <div className={classes.formGroup}>
              <label className={classes.formLabel}>E-post</label>
              <input type="email" className={classes.formInput} placeholder="din@epost.no" />
            </div>
            <div className={classes.formGroup}>
              <label className={classes.formLabel}>Telefon</label>
              <input type="tel" className={classes.formInput} placeholder="000 00 000" />
            </div>
            <button type="button" className={classes.formSubmit}>Send forespørsel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KartMap;
