var scene; // 場景
var camera; // 攝影機
var renderer; // 渲染
var geometry;
var material; // 材質
var earth_mesh; // 地球
var controls; // 控制元件
var light; // 燈光
var sun_mesh; // 太陽
var moon_mesh; //月亮
var cloud_mesh; // 雲朵
var mercury_mesh; // 水星

function init() {
	scene = new THREE.Scene(); //建立場景
	camera = new THREE.PerspectiveCamera(150, window.innerWidth / window.innerHeight, 0.1, 1000); // fov , aspect, near ,far
	renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setSize(window.innerWidth, window.innerHeight); // 設定場景大小
	scene.background = new THREE.Color(0xffffff); // 設定場景背景色
	document.body.appendChild(renderer.domElement);

	camera.position.set(0, 7, 0); // 設定相機位置 x,y,z

	// 設定軌道運行控制
	controls = new THREE.OrbitControls(camera);
	controls.autoRotate = false;
	controls.autoRotateSpeed = 3.0;
	controls.update();

	var loader = new THREE.TextureLoader();
	loader.load(
		'/universe/static/img/4096_earth.jpg', // resource URL
		function(texture) {
			// callback

			//光亮材質
			var earth_material = new THREE.MeshPhongMaterial({
				// 網格材質
				map: texture
			});

			//增加表面高度
			earth_material.bumpMap = new THREE.TextureLoader().load('/universe/static/img/4096_bump.jpg');
			earth_material.bumpScale = 0.05; // bump 影響 material的程度

			//增加雲朵
			var cloud_geometry = new THREE.SphereGeometry(2, 150, 150);
			var cloud_material = new THREE.MeshPhongMaterial({
				map: new THREE.TextureLoader().load('/universe/static/img/earthcloudmap.jpg'),
				side: THREE.DoubleSide,
				opacity: 0.45,
				transparent: true,
				depthWrite: false
			});
			cloud_mesh = new THREE.Mesh(cloud_geometry, cloud_material);

			//球體設置
			earth_geometry = new THREE.SphereGeometry(2, 64, 64); // radius, widthFragment, heightFragment
			earth_mesh = new THREE.Mesh(earth_geometry, earth_material); // 建立物件
			earth_mesh.position.set(10, 0, -1); // x,y,z

			earth_mesh.add(cloud_mesh);

			scene.add(earth_mesh); //將地球加入場景;

			//加入星空
			var star_geometry = new THREE.SphereGeometry(15, 64, 64);
			var star_material = new THREE.MeshBasicMaterial({
				map: new THREE.TextureLoader().load('/universe/static/img/StarsMap.jpg'),
				side: THREE.BackSide,
				shininess: 0
			});
			var star_mesh = new THREE.Mesh(star_geometry, star_material);
			scene.add(star_mesh); // 將星空加入場景

			// meshPhongMaterial 要加入燈光，否則會顯示不出來
			light = new THREE.DirectionalLight(0xffffff);
			light.position.set(0, 1, 1).normalize();
			scene.add(light); // 加入燈光
		},
		undefined, // onPress callback
		function(err) {
			// onError callback
			console.log(err);
		}
	);

	// 增加太陽
	loader.load(
		'/universe/static/img/sun.jpg',
		function(texture) {
			var sun_material = new THREE.MeshPhongMaterial({
				map: texture
			});

			var sun_geometry = new THREE.SphereGeometry(2, 64, 64);
			sun_mesh = new THREE.Mesh(sun_geometry, sun_material);
			sun_mesh.position.set(0, 0, 0);
			scene.add(sun_mesh);
		},
		undefined,
		function(err) {
			console.log('load sun image err', err);
		}
	);

	//增加月亮
	loader.load(
		'/universe/static/img/moon.jpg',
		function(texture) {
			var moon_material = new THREE.MeshPhongMaterial({
				map: texture
			});

			var moon_geometry = new THREE.SphereGeometry(2, 64, 64);
			moon_mesh = new THREE.Mesh(moon_geometry, moon_material);
			moon_mesh.position.set(14, 0, -1);
			scene.add(moon_mesh);
		},
		undefined,
		function(err) {
			console.log('load moon image err', err);
		}
	);

	// 增加水星
	loader.load(
		'/universe/static/img/mercurymap.jpg',
		function(texture) {
			var mercury_material = new THREE.MeshPhongMaterial({
				map: texture
			});
			var mercury_geometry = new THREE.SphereGeometry(2, 64, 64);
			mercury_mesh = new THREE.Mesh(mercury_geometry, mercury_material);
			mercury_mesh.bumpMap = new THREE.TextureLoader().load('/universe/static/img/mercurybump.jpg');
			mercury_material.bumpScale = 0.05;
			mercury_mesh.position.set(4, 0, -1);
			scene.add(mercury_mesh);
		},
		undefined,
		function(err) {
			console.log('load mercury image err', err);
		}
	);

	camera.position.z = 7;
	window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix(); // update camera
	renderer.setSize(window.innerWidth, window.innerHeight);
	controls.handleResize();
}

let moon_r = 14;
let moon_theta = 0;
let moon_dtheta = 2 * Math.PI / 700;

let earth_r = 10;
let earth_theta = 0;
let earth_dtheta = 2 * Math.PI / 1000;

let mercury_r = 4;
let mercury_theta = 0;
let mercury_dtheta = 2 * Math.PI / 650;

var animate = function() {
	requestAnimationFrame(animate);

	if (sun_mesh) {
		sun_mesh.rotation.y += 0.01;
	}

	if (light) {
		light.position.copy(camera.getWorldPosition(new THREE.Vector3()));
	}

	if (cloud_mesh) {
		cloud_mesh.rotation.y += 0.01;
	}

	moon_theta += moon_dtheta;
	earth_theta += earth_dtheta;
	mercury_theta += mercury_dtheta;

	if (earth_mesh) {
		earth_mesh.rotation.y += 0.01;
		earth_mesh.position.x = -earth_r * Math.cos(earth_theta);
		earth_mesh.position.z = -earth_r * Math.sin(earth_theta);
	}

	if (moon_mesh) {
		moon_mesh.position.x = -moon_r * Math.cos(moon_theta);
		moon_mesh.position.z = -moon_r * Math.sin(moon_theta);
	}

	if (mercury_mesh) {
		mercury_mesh.rotation.y += 0.01;
		mercury_mesh.position.x = -mercury_r * Math.cos(mercury_theta);
		mercury_mesh.position.z = -mercury_r * Math.sin(mercury_theta);
	}

	controls.update();
	renderer.render(scene, camera);
};

init();
animate();
