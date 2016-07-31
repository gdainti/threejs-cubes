!function() {

    const PI2 = Math.PI * 2;

    var container, stats;
    var camera, scene, renderer;
    var particleMaterial;

    var raycaster;
    var mouse;

    var objects = [];
    var particles = [];
    var particleToObject = [];


    // N - number of cubes
    var N = Math.floor(Math.random() * (30 - 5)) + 5; // range [5 : 30]

    init(N);
    animate();

    function init(cubesNumber) {

        cubesNumber =(Number.isInteger(cubesNumber)) ? cubesNumber : 10;

        container = document.createElement('div');
        document.body.appendChild(container);

        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.set(0, 300, 500);

        scene = new THREE.Scene();

        var geometry = new THREE.BoxGeometry(100, 100, 100);

        for (var i = 0; i < cubesNumber; i ++) {

            var object = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ }));

            object.position.x = Math.random() * 800 - 400;
            object.position.y = Math.random() * 800 - 400;
            object.position.z = Math.random() * 800 - 400;

            var helper = new THREE.BoxHelper( object );
            helper.material.color.set( 0x000000 );

            scene.add( helper );
            //scene.add(object);

            objects.push(helper);

            for (var v = 0; v < object.geometry.vertices.length; v++) {

                particleMaterial = new THREE.SpriteCanvasMaterial({

                    color: Math.random() * 0xffffff,

                    program: function (context) {

                        context.beginPath();
                        context.arc(0, 0, 0.5, 0, PI2, true);
                        context.fill();
                    }

                });

                var particle = new THREE.Sprite(particleMaterial);

                particle.position.x =  object.position.x + object.geometry.vertices[v].x;
                particle.position.y =  object.position.y + object.geometry.vertices[v].y;
                particle.position.z =  object.position.z + object.geometry.vertices[v].z;

                particle.scale.x = particle.scale.y = 16;

                particles.push(particle);
                particleToObject[particle.id] = helper.id;

                scene.add(particle);
            }

        }

        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        renderer = new THREE.CanvasRenderer();
        renderer.setClearColor(0xf0f0f0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        stats = new Stats();
        container.appendChild(stats.dom);

        document.addEventListener('mousedown', onDocumentMouseDown, false);
        document.addEventListener('touchstart', onDocumentTouchStart, false);

        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

    }

    function onDocumentTouchStart(event) {

        event.preventDefault();

        event.clientX = event.touches[0].clientX;
        event.clientY = event.touches[0].clientY;
        onDocumentMouseDown(event);

    }

    function onDocumentMouseDown(event) {

        event.preventDefault();

        mouse.x = (event.clientX / renderer.domElement.clientWidth)* 2 - 1;
        mouse.y = - (event.clientY / renderer.domElement.clientHeight)* 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects(particles);

        if (intersects.length > 0) {
            var particleId = intersects[0].object.id;
            var objectId = particleToObject[particleId];
            var object = scene.getObjectById(objectId, true);
            object.material.color.set( intersects[0].object.material.color );

        }
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
        stats.update();
    }

    var theta = 0;

    function render() {

        var radius = 600;

        // rotation
        theta += 0.05;
        camera.position.x = radius * Math.sin(THREE.Math.degToRad(theta));
        camera.position.y = radius * Math.sin(THREE.Math.degToRad(theta));
        camera.position.z = radius * Math.cos(THREE.Math.degToRad(theta));
        camera.lookAt(scene.position);

        //render
        renderer.render(scene, camera);
    }

}();