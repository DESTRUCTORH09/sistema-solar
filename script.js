const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 5000);
camera.position.set(0, 300, 600);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controles orbitales
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Luz
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 2, 5000);
scene.add(pointLight);

// Texturas
const loader = new THREE.TextureLoader();
const textures = {
  sun: loader.load('textures/sun.jpg'),
  mercury: loader.load('textures/mercury.jpg'),
  venus: loader.load('textures/venus.jpg'),
  earth: loader.load('textures/earth.jpg'),
  mars: loader.load('textures/mars.jpg'),
  jupiter: loader.load('textures/jupiter.jpg'),
  saturn: loader.load('textures/saturn.jpg'),
  uranus: loader.load('textures/uranus.jpg'),
  neptune: loader.load('textures/neptune.jpg')
};

// Planetas
const planetsData = [
  {name:'Mercurio', radius:5, distance:50, texture:textures.mercury, info:'El planeta más cercano al Sol.'},
  {name:'Venus', radius:8, distance:80, texture:textures.venus, info:'Segundo planeta, muy caliente.'},
  {name:'Tierra', radius:10, distance:120, texture:textures.earth, info:'Nuestro hogar, con vida.'},
  {name:'Marte', radius:7, distance:160, texture:textures.mars, info:'El planeta rojo.'},
  {name:'Júpiter', radius:20, distance:220, texture:textures.jupiter, info:'Gigante gaseoso.'},
  {name:'Saturno', radius:18, distance:280, texture:textures.saturn, info:'Famoso por sus anillos.'},
  {name:'Urano', radius:14, distance:340, texture:textures.uranus, info:'Gigante helado.'},
  {name:'Neptuno', radius:14, distance:400, texture:textures.neptune, info:'Planeta azul profundo.'}
];

const planetMeshes = [];

// Sol
const sunGeometry = new THREE.SphereGeometry(30, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({map:textures.sun});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Crear planetas
planetsData.forEach(data=>{
  const geo = new THREE.SphereGeometry(data.radius,32,32);
  const mat = new THREE.MeshStandardMaterial({map:data.texture});
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.x = data.distance;
  mesh.userData = data;
  scene.add(mesh);
  planetMeshes.push(mesh);
});

// Raycaster para click
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const infoPanel = document.getElementById('infoPanel');
const planetNameEl = document.getElementById('planetName');
const planetInfoEl = document.getElementById('planetInfo');

window.addEventListener('click', e=>{
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planetMeshes);

  if(intersects.length > 0){
    const planet = intersects[0].object.userData;
    planetNameEl.textContent = planet.name;
    planetInfoEl.textContent = planet.info;
    infoPanel.style.display = 'block';

    // Mover cámara cerca del planeta
    const targetPos = intersects[0].object.position.clone();
    camera.position.set(targetPos.x + 50, targetPos.y + 50, targetPos.z + 100);
    controls.target.copy(targetPos);
  }
});

// Animación
function animate(){
  requestAnimationFrame(animate);
  planetMeshes.forEach((mesh, i)=>{
    mesh.position.x = planetsData[i].distance * Math.cos(Date.now()*0.0001*(i+1));
    mesh.position.z = planetsData[i].distance * Math.sin(Date.now()*0.0001*(i+1));
  });
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Ajustar al tamaño de la ventana
window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
