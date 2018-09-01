var scene; // 場景
var camera; // 攝影機
var renderer; // 渲染
var geometry;
var material; // 材質
var earth_mesh; // 地球

function init() {
	scene = new THREE.Scene(); //建立場景
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // fov , aspect, near ,far
	renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setSize(window.innerWidth, window.innerHeight); // 設定場景大小
	scene.background = new THREE.Color(0xffffff); // 設定場景背景色
	document.body.appendChild(renderer.domElement);

	var loader = new THREE.TextureLoader();
	loader.load(
		'/universe/static/img/4096_earth.jpg', // resource URL
		function(texture) {
			// callback

			/**
			 * 光亮材質
			 */
			var earth_material = new THREE.MeshPhongMaterial({
				// 網格材質
				map: texture
			});

			/**
			 * 增加表面高度
			 */
			earth_material.bumpMap = new THREE.TextureLoader().load('/universe/static/img/4096_bump.jpg');
			earth_material.bumpScale = 0.05; // bump 影響 material的程度

			/**
			 * 增加雲朵
			 */
			var cloud_geometry = new THREE.SphereGeometry(2.5, 64, 64);
			var cloud_material = new THREE.MeshPhongMaterial({
				map: new THREE.TextureLoader().load('/universe/static/img/earthcloudmap.jpg'),
				side: THREE.DoubleSide,
				opacity: 0.8,
				transparent: true,
				depthWrite: false
			});
			var cloud_mesh = new THREE.Mesh(cloud_geometry, cloud_material);

			/**
			 * 球體設置
			 */
			earth_geometry = new THREE.SphereGeometry(2.5, 64, 64); // radius, widthFragment, heightFragment
			earth_mesh = new THREE.Mesh(earth_geometry, earth_material); // 建立物件
			earth_mesh.position.set(0, 0, 0); // x,y,z

			earth_mesh.add(cloud_mesh);

			scene.add(earth_mesh); // 將地球加入場景

			/**
			 * meshPhongMaterial 要加入燈光，否則會顯示不出來
			 */
			var light = new THREE.DirectionalLight(0xffffff);
			light.position.set(0, 1, 1).normalize();
			scene.add(light); // 加入燈光
		},
		undefined, // onPress callback
		function(err) {
			// onError callback
			console.log(err);
		}
	);

	camera.position.z = 5;
}

var animate = function() {
	requestAnimationFrame(animate);

	if (earth_mesh) {
		earth_mesh.rotation.y += 0.01;
	}

	renderer.render(scene, camera);
};
init();
animate();
