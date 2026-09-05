// Node.js script to sculpt and generate high-precision GLB assets for NOIRÉ
class FileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buffer) => {
      this.result = buffer;
      if (this.onloadend) this.onloadend();
      else if (this.onload) this.onload();
    });
  }
}
global.FileReader = FileReader;

const fs = require('fs');
const path = require('path');
const THREE = require('three');
const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter.js');

const outputDir = path.join(__dirname, '..', 'public', 'models');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function exportToGLB(object3D, filename) {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
    exporter.parse(
      object3D,
      (result) => {
        const filePath = path.join(outputDir, filename);
        if (result instanceof ArrayBuffer) {
          fs.writeFileSync(filePath, Buffer.from(result));
        } else {
          fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
        }
        console.log(`Successfully generated ${filename} (${(result.byteLength || 0) / 1024} KB)`);
        resolve();
      },
      (error) => {
        console.error(`Error exporting ${filename}:`, error);
        reject(error);
      },
      { binary: true }
    );
  });
}

// 1. CACAO BEAN HERO
// Sculpted organic bean: asymmetric curved almond profile with longitudinal husk ridges and organic variations
function createCacaoBean() {
  const geom = new THREE.SphereGeometry(1, 64, 48);
  const pos = geom.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);

    // Elongate along Z
    v.z *= 2.0;

    // Flatten along Y
    v.y *= 0.65;

    // Organic asymmetrical almond bend
    const zNorm = v.z / 2.0; // -1 to 1
    v.x += Math.sin(zNorm * Math.PI * 0.8) * 0.22;
    v.y += Math.cos(zNorm * Math.PI * 0.6) * 0.08;

    // Taper ends
    const taper = 1.0 - Math.pow(Math.abs(zNorm), 2.2) * 0.35;
    v.x *= taper;
    v.y *= taper;

    // Husk micro-ridges along longitudinal axis
    const angle = Math.atan2(v.y, v.x);
    const ridgeCount = 6;
    const ridgeAmp = 0.04 * (1.0 - Math.abs(zNorm));
    v.x += Math.cos(angle) * Math.sin(angle * ridgeCount) * ridgeAmp;
    v.y += Math.sin(angle) * Math.sin(angle * ridgeCount) * ridgeAmp;

    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geom.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({
    color: 0x3d2314,
    roughness: 0.82,
    metalness: 0.08,
    name: 'CacaoBeanHuskMat'
  });

  const mesh = new THREE.Mesh(geom, mat);
  mesh.name = 'CacaoBeanHero';
  return mesh;
}

// 2. CACAO POD HERO
// Botanical Theobroma Cacao pod: tapered spindle with 10 pronounced fluted ridges and stem
function createCacaoPod() {
  const group = new THREE.Group();
  group.name = 'CacaoPodGroup';

  const geom = new THREE.SphereGeometry(1.2, 72, 60);
  const pos = geom.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);

    // Elongate along Y
    v.y *= 2.6;

    const yNorm = v.y / 2.6; // approx -1 to 1

    // Pod profile: bulbous center, tapered tip, pinched stem base
    let profile = Math.cos(yNorm * Math.PI * 0.45);
    if (profile < 0.1) profile = 0.1;
    v.x *= profile * 1.15;
    v.z *= profile * 1.15;

    // 10 longitudinal fluted ridges
    const angle = Math.atan2(v.z, v.x);
    const ridges = 10;
    const ridgeStrength = 0.12 * Math.sin(angle * ridges) * Math.max(0, 1.0 - Math.abs(yNorm * 0.9));
    v.x += Math.cos(angle) * ridgeStrength;
    v.z += Math.sin(angle) * ridgeStrength;

    // Pointed botanical tip at bottom
    if (v.y < -1.8) {
      const tipFactor = (v.y + 1.8) / -0.8;
      v.y -= tipFactor * 0.15;
    }

    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geom.computeVertexNormals();

  const podMat = new THREE.MeshStandardMaterial({
    color: 0x5a2d12, // Rich dark roasted copper pod
    roughness: 0.75,
    metalness: 0.05,
    name: 'CacaoPodRindMat'
  });

  const podMesh = new THREE.Mesh(geom, podMat);
  podMesh.name = 'CacaoPodBody';
  group.add(podMesh);

  // Pod stem
  const stemGeom = new THREE.CylinderGeometry(0.12, 0.18, 0.8, 16);
  stemGeom.translate(0, 2.7, 0);
  const stemMat = new THREE.MeshStandardMaterial({
    color: 0x2e1b10,
    roughness: 0.9,
    name: 'CacaoPodStemMat'
  });
  const stemMesh = new THREE.Mesh(stemGeom, stemMat);
  stemMesh.name = 'CacaoPodStem';
  group.add(stemMesh);

  return group;
}

// 3. CHOCOLATE BAR HERO
// 24 beveled snap blocks (6 rows x 4 columns) with crisp molded chamfers and NOIRÉ proportions
function createChocolateBar() {
  const group = new THREE.Group();
  group.name = 'ChocolateBarGroup';

  const barMat = new THREE.MeshStandardMaterial({
    color: 0x1f120a, // Deep dark cacao
    roughness: 0.38,
    metalness: 0.12,
    name: 'ChocolateSilkMat'
  });

  // Base slab
  const baseGeom = new THREE.BoxGeometry(2.4, 0.2, 4.0);
  baseGeom.translate(0, -0.1, 0);
  const baseMesh = new THREE.Mesh(baseGeom, barMat);
  baseMesh.name = 'BarBaseSlab';
  group.add(baseMesh);

  // 6 rows x 4 columns of individual beveled blocks
  const rows = 6;
  const cols = 4;
  const blockW = 0.52;
  const blockH = 0.18;
  const startX = -((cols - 1) * 0.58) / 2;
  const startZ = -((rows - 1) * 0.64) / 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const blockGeom = new THREE.CylinderGeometry(
        blockW * 0.42, // top radius
        blockW * 0.54, // bottom radius
        blockH,
        4, // 4-sided square with bevel
        1
      );
      blockGeom.rotateY(Math.PI / 4);
      blockGeom.translate(0, blockH / 2, 0);

      const blockMesh = new THREE.Mesh(blockGeom, barMat);
      blockMesh.position.set(startX + c * 0.58, 0, startZ + r * 0.64);
      blockMesh.name = `SnapBlock_r${r}_c${c}`;
      group.add(blockMesh);
    }
  }

  return group;
}

// 4. CHOCOLATE PIECE (Single hero break piece)
function createChocolatePiece() {
  const group = new THREE.Group();
  group.name = 'ChocolatePieceHeroGroup';

  const pieceMat = new THREE.MeshStandardMaterial({
    color: 0x1f120a,
    roughness: 0.36,
    metalness: 0.12,
    name: 'ChocolatePieceSilkMat'
  });

  const breakMat = new THREE.MeshStandardMaterial({
    color: 0x2a170d,
    roughness: 0.92, // rough crystalline break fracture
    metalness: 0.04,
    name: 'ChocolateFractureMat'
  });

  // Top beveled segment
  const geom = new THREE.CylinderGeometry(0.7, 0.85, 0.35, 4, 1);
  geom.rotateY(Math.PI / 4);
  const mesh = new THREE.Mesh(geom, pieceMat);
  mesh.name = 'SnappedBlock';
  group.add(mesh);

  // Rough fracture lip on back edge
  const fractureGeom = new THREE.BoxGeometry(1.2, 0.25, 0.3);
  fractureGeom.translate(0, -0.1, -0.6);
  const fractureMesh = new THREE.Mesh(fractureGeom, breakMat);
  fractureMesh.name = 'RoughFractureLip';
  group.add(fractureMesh);

  return group;
}

// 5. PACKAGING SLIDE BOX
function createPackaging() {
  const group = new THREE.Group();
  group.name = 'PackagingBoxGroup';

  const paperMat = new THREE.MeshStandardMaterial({
    color: 0x120b08, // Matte dark cacao luxury paperboard
    roughness: 0.88,
    metalness: 0.02,
    name: 'TexturedPaperMat'
  });

  const foilMat = new THREE.MeshStandardMaterial({
    color: 0x9b6742, // Warm copper hot foil stamp
    roughness: 0.28,
    metalness: 0.82,
    name: 'CopperFoilMat'
  });

  const sleeveGeom = new THREE.BoxGeometry(2.6, 0.5, 4.4);
  const sleeveMesh = new THREE.Mesh(sleeveGeom, paperMat);
  sleeveMesh.name = 'OuterSleeve';
  group.add(sleeveMesh);

  const bandGeom = new THREE.BoxGeometry(2.62, 0.52, 1.2);
  const bandMesh = new THREE.Mesh(bandGeom, foilMat);
  bandMesh.name = 'CopperFoilEmbossBand';
  group.add(bandMesh);

  return group;
}

async function main() {
  console.log('Generating high-precision NOIRÉ 3D GLB assets...');
  await exportToGLB(createCacaoBean(), 'cacao-bean.glb');
  await exportToGLB(createCacaoPod(), 'cacao-pod.glb');
  await exportToGLB(createChocolateBar(), 'chocolate-bar.glb');
  await exportToGLB(createChocolatePiece(), 'chocolate-piece.glb');
  await exportToGLB(createPackaging(), 'packaging.glb');
  console.log('All 5 hero GLB models successfully generated!');
}

main().catch(err => {
  console.error('Failed to generate models:', err);
  process.exit(1);
});
