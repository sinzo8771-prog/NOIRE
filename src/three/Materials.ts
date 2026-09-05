import * as THREE from "three";

export function createChocolateMaterial(roughness = 0.35, metalness = 0.12) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color("#1F120A"), // Rich dark 72% cacao
    roughness: roughness,
    metalness: metalness,
    roughnessMap: null,
  });
}

export function createCacaoBeanMaterial() {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color("#3D2314"), // Earthy roasted bean shell
    roughness: 0.82,
    metalness: 0.08,
  });
}

export function createCacaoPodMaterial() {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color("#5A2D12"), // Ripe dark copper pod rind
    roughness: 0.74,
    metalness: 0.05,
  });
}

export function createFractureMaterial() {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color("#2A170D"), // Rough crystalline interior break
    roughness: 0.94,
    metalness: 0.04,
  });
}
