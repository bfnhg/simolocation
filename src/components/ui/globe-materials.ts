import * as THREE from "three";

export function createGlobeMaterial(bumpScale: number = 5) {
  const textureLoader = new THREE.TextureLoader();
  
  // Création des textures procédurales si les images ne sont pas disponibles
  const createEarthMap = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Dégradé bleu pour l'océan
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#1a4d8c');
    gradient.addColorStop(0.5, '#2a5c9c');
    gradient.addColorStop(1, '#1a4d8c');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Ajout de continents simplifiés
    ctx.fillStyle = '#3a7e3a';
    
    // Amérique du Nord
    ctx.beginPath();
    ctx.arc(200, 200, 80, 0, Math.PI * 2);
    ctx.fill();
    
    // Amérique du Sud
    ctx.beginPath();
    ctx.arc(250, 350, 70, 0, Math.PI * 2);
    ctx.fill();
    
    // Europe
    ctx.beginPath();
    ctx.arc(550, 150, 60, 0, Math.PI * 2);
    ctx.fill();
    
    // Afrique
    ctx.beginPath();
    ctx.arc(600, 300, 70, 0, Math.PI * 2);
    ctx.fill();
    
    // Asie
    ctx.beginPath();
    ctx.arc(800, 200, 90, 0, Math.PI * 2);
    ctx.fill();
    
    // Australie
    ctx.beginPath();
    ctx.arc(900, 400, 50, 0, Math.PI * 2);
    ctx.fill();
    
    return new THREE.CanvasTexture(canvas);
  };

  const createBumpMap = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Ajout de reliefs
    ctx.fillStyle = '#a0a0a0';
    
    // Montagnes
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, 20 + Math.random() * 30, 0, Math.PI * 2);
      ctx.fill();
    }
    
    return new THREE.CanvasTexture(canvas);
  };

  const createSpecularMap = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Ajout de reflets sur les océans
    ctx.fillStyle = '#333333';
    ctx.fillRect(0, 200, canvas.width, 100);
    
    return new THREE.CanvasTexture(canvas);
  };

  const mapTexture = createEarthMap();
  const bumpTexture = createBumpMap();
  const specularTexture = createSpecularMap();

  return new THREE.MeshPhongMaterial({
    map: mapTexture,
    bumpMap: bumpTexture,
    bumpScale: bumpScale,
    specularMap: specularTexture,
    specular: new THREE.Color('grey'),
    shininess: 10,
    emissive: new THREE.Color(0x000022),
  });
}

export function createAtmosphereMaterial(color: string, intensity: number = 20) {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,0.8)');
  gradient.addColorStop(0.5, `rgba(77, 166, 255, 0.2)`);
  gradient.addColorStop(1, 'rgba(77, 166, 255, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  
  const texture = new THREE.CanvasTexture(canvas);
  
  return new THREE.MeshPhongMaterial({
    map: texture,
    color: new THREE.Color(color),
    transparent: true,
    opacity: 0.2,
    side: THREE.BackSide,
    emissive: new THREE.Color(color),
    emissiveIntensity: intensity / 10,
  });
}