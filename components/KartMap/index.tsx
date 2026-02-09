import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import Mapbox, { Marker, NavigationControl, Source, Layer, MapRef } from 'react-map-gl';
import type mapboxgl from 'mapbox-gl';
import { useMap } from '@/context/Map';
import { snapMapStyle } from '@/components/Map/snapMapStyle';
import { prefixPath } from '@/utils/path';
import classes from './KartMap.module.css';

// ---- Mock data per bydel (structure only, values are placeholders) ----
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

// Oslo average for comparison
const OSLO_AVG_PRICE_CHANGE = 2.8;

function getDistrictColor(priceChange: number): string {
  const diff = priceChange - OSLO_AVG_PRICE_CHANGE;
  if (diff > 1.0) return 'rgba(34, 197, 94, 0.45)';   // Green: well above average
  if (diff > -0.5) return 'rgba(148, 163, 184, 0.3)';  // Gray: around average
  return 'rgba(239, 68, 68, 0.4)';                      // Red: below average
}

function getDistrictOutlineColor(priceChange: number): string {
  const diff = priceChange - OSLO_AVG_PRICE_CHANGE;
  if (diff > 1.0) return '#16a34a';
  if (diff > -0.5) return '#94a3b8';
  return '#dc2626';
}

function KartMap() {
  const { center, setCenter, selectedDistrict, setSelectedDistrict } = useMap();
  const mapRef = useRef<MapRef>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [labelFeatures, setLabelFeatures] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formRole, setFormRole] = useState<string | null>(null);
  const [formSize, setFormSize] = useState(70);

  // Load label points for markers
  useEffect(() => {
    fetch(prefixPath('/oslo_label_points.geojson?v=2'))
      .then(res => res.json())
      .then(data => {
        if (data.features) setLabelFeatures(data.features);
      })
      .catch(err => console.error('Error loading labels:', err));
  }, []);

  // Build fill-color expression for bydeler based on price change
  const fillColorExpression: any = (() => {
    const expr: any[] = ['case'];
    Object.entries(districtData).forEach(([name, data]) => {
      // Selected district: highlight
      expr.push(['==', ['get', 'BYDELSNAVN'], name]);
      if (selectedDistrict === name) {
        expr.push('rgba(59, 130, 246, 0.35)');
      } else if (selectedDistrict && selectedDistrict !== name) {
        // Dimmed when another district is selected
        const base = getDistrictColor(data.priceChange);
        expr.push(base.replace(/[\d.]+\)$/, '0.12)'));
      } else {
        expr.push(getDistrictColor(data.priceChange));
      }
    });
    // Default fallback
    expr.push('rgba(148, 163, 184, 0.15)');
    return expr;
  })();

  const outlineColorExpression: any = (() => {
    const expr: any[] = ['case'];
    Object.entries(districtData).forEach(([name, data]) => {
      expr.push(['==', ['get', 'BYDELSNAVN'], name]);
      if (selectedDistrict === name) {
        expr.push('#2563eb');
      } else if (selectedDistrict && selectedDistrict !== name) {
        expr.push('rgba(148, 163, 184, 0.3)');
      } else {
        expr.push(getDistrictOutlineColor(data.priceChange));
      }
    });
    expr.push('rgba(148, 163, 184, 0.3)');
    return expr;
  })();

  const outlineWidthExpression: any = (() => {
    const expr: any[] = ['case'];
    Object.entries(districtData).forEach(([name]) => {
      expr.push(['==', ['get', 'BYDELSNAVN'], name]);
      if (selectedDistrict === name) {
        expr.push(3);
      } else if (selectedDistrict && selectedDistrict !== name) {
        expr.push(0.5);
      } else {
        expr.push(1);
      }
    });
    expr.push(0.5);
    return expr;
  })();

  const onHover = useCallback((event: mapboxgl.MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    setHoveredDistrict(feature?.properties?.BYDELSNAVN || null);
  }, []);

  const onClick = useCallback((event: mapboxgl.MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    const name = feature?.properties?.BYDELSNAVN;
    if (name && districtData[name]) {
      setSelectedDistrict(name);
      setPanelOpen(true);
    }
  }, [setSelectedDistrict]);

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    setSelectedDistrict(null);
  }, [setSelectedDistrict]);

  const openModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const currentData = selectedDistrict ? districtData[selectedDistrict] : null;

  return (
    <div className={classes.mapWrapper}>
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
        mapStyle={snapMapStyle as any}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-left" />

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

            {/* District name labels as markers */}
            {labelFeatures.map((feature, index) => {
              const name = feature.properties?.BYDELSNAVN;
              const coords = feature.geometry.coordinates;
              if (!name || !coords) return null;

              const isSelected = name === selectedDistrict;
              const isDimmed = !!selectedDistrict && !isSelected;

              return (
                <Marker
                  key={`kart-label-${index}`}
                  latitude={coords[1]}
                  longitude={coords[0]}
                  style={{ zIndex: isSelected ? 100 : 10 }}
                >
                  <div
                    className={`${classes.mapLabel} ${isSelected ? classes.mapLabelActive : ''} ${isDimmed ? classes.mapLabelDimmed : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (districtData[name]) {
                        setSelectedDistrict(name);
                        setPanelOpen(true);
                      }
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

      {/* Legend */}
      <div className={classes.legend}>
        Farge viser prisutvikling hittil i år relativt til Oslo-snitt
        <div className={classes.legendDots}>
          <div className={classes.legendDot}>
            <span style={{ background: '#22c55e' }} /> Over snitt
          </div>
          <div className={classes.legendDot}>
            <span style={{ background: '#94a3b8' }} /> Rundt snitt
          </div>
          <div className={classes.legendDot}>
            <span style={{ background: '#ef4444' }} /> Under snitt
          </div>
        </div>
      </div>

      {/* ===== Side Panel ===== */}
      <div className={`${classes.sidePanel} ${panelOpen && currentData ? classes.open : ''}`}>
        <div className={classes.panelHeader}>
          <h2 className={classes.panelTitle}>
            {selectedDistrict} – markedsstatus nå
          </h2>
          <button className={classes.panelClose} onClick={closePanel} aria-label="Lukk panel">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {currentData && (
          <div className={classes.panelBody}>
            {/* 2. Status line */}
            <div className={classes.statusLine}>
              {currentData.statusText}
            </div>

            {/* 3. Key figures */}
            <div className={classes.keyFigures}>
              <div className={classes.keyFigure}>
                <svg className={classes.keyFigureIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className={classes.keyFigureValue}>
                  {currentData.priceChange > 0 ? '+' : ''}{currentData.priceChange.toFixed(1)}%
                </div>
                <div className={classes.keyFigureLabel}>Prisendring i år</div>
              </div>
              <div className={classes.keyFigure}>
                <svg className={classes.keyFigureIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className={classes.keyFigureValue}>{currentData.turnoverDays}</div>
                <div className={classes.keyFigureLabel}>Dager omsetning</div>
              </div>
              <div className={classes.keyFigure}>
                <svg className={classes.keyFigureIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1m-2 0h2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className={classes.keyFigureValue}>
                  {(currentData.sqmPrice / 1000).toFixed(0)}k
                </div>
                <div className={classes.keyFigureLabel}>Kr/m²</div>
              </div>
            </div>

            {/* 4. Mini graph placeholder */}
            <div className={classes.graphPlaceholder}>
              <svg className={classes.graphLine} viewBox="0 0 300 60" preserveAspectRatio="none">
                <polyline
                  points="0,50 30,45 60,48 90,40 120,35 150,38 180,30 210,25 240,20 270,22 300,15"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className={classes.graphLabel}>Siste 12 mnd</div>
            </div>

            {/* 5. Interpretation */}
            <div className={classes.interpretSection}>
              <h3 className={classes.interpretTitle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Dette betyr for selger
              </h3>
              <ul className={classes.interpretList}>
                {currentData.sellerPoints.map((point, i) => (
                  <li key={`seller-${i}`}>{point}</li>
                ))}
              </ul>
            </div>

            <div className={classes.interpretDivider} />

            <div className={classes.interpretSection}>
              <h3 className={classes.interpretTitle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Dette betyr for kjøper
              </h3>
              <ul className={classes.interpretList}>
                {currentData.buyerPoints.map((point, i) => (
                  <li key={`buyer-${i}`}>{point}</li>
                ))}
              </ul>
            </div>

            {/* 6. CTA */}
            <button className={classes.ctaButton} onClick={openModal}>
              Hva betyr dette for min bolig?
            </button>
          </div>
        )}
      </div>

      {/* ===== Form Modal ===== */}
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
            {/* Boligtype */}
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

            {/* Størrelse */}
            <div className={classes.formGroup}>
              <label className={classes.formLabel}>Ca. størrelse</label>
              <div className={classes.rangeGroup}>
                <input
                  type="range"
                  className={classes.formRange}
                  min={20}
                  max={250}
                  step={5}
                  value={formSize}
                  onChange={(e) => setFormSize(Number(e.target.value))}
                />
                <span className={classes.rangeValue}>{formSize} m²</span>
              </div>
            </div>

            {/* Rolle */}
            <div className={classes.formGroup}>
              <label className={classes.formLabel}>Jeg er</label>
              <div className={classes.roleSelector}>
                {['Selger', 'Kjøper', 'Begge'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    className={`${classes.roleOption} ${formRole === role ? classes.selected : ''}`}
                    onClick={() => setFormRole(role)}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Kontaktinfo */}
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

            {/* Submit (visual only) */}
            <button type="button" className={classes.formSubmit}>
              Send forespørsel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KartMap;
