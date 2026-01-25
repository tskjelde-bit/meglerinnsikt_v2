const fs = require('fs');
const topojson = require('topojson-client');

try {
    const topology = JSON.parse(fs.readFileSync('./public/oslo_topo.json', 'utf8'));
    console.log('Topology loaded');
    const geojson = topojson.feature(topology, topology.objects.Bydeler);
    console.log('Features extracted:', geojson.features.length);

    fs.writeFileSync('./public/oslo_bydeler.geojson', JSON.stringify(geojson));
    console.log('File written successfully.');
} catch (error) {
    console.error('Error during conversion:', error);
    process.exit(1);
}
