(function(){
	//initialize the angular app and inject dependencies.
	var app = angular.module("olinbaja", ['ngRoute']);

	app.config(function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl : './pages/home.html'
      })
      .when('/car', {
      	templateUrl : './pages/car.html',
        controller: 'CarController',
        controllerAs: 'car'
      })
      .when('/admin', {
        templateUrl : './pages/admin.html',
        controller : 'AdminController'
      })
      .when('/gallery', {
        templateUrl : './pages/gallery.html',
        controller : 'GalleryController'
      });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  });

  app.controller('GalleryController', ['$scope', '$http', '$window', function($scope, $http, $window) {

    function reloadTeam() {
      $http({
        method:'GET',
        url: '/team'
      }).then(function successCallback(response) {
        $scope.team = response.data;
      }, function errorCallback(response) {
        console.log(response);
      });
    }

    $http.get('/gallerydata', {}).then(
      function success(response) {
        console.log(response);
        $scope.images = response.data;
      }, function error(response) {
        console.log(status);
      }
    );
  }]);

  app.controller('AdminController', ['$scope', '$http', '$window', function($scope, $http, $window) {

    function reloadTeam() {
      $http({
        method:'GET',
        url: '/team'
      }).then(function successCallback(response) {
        $scope.team = response.data;
      }, function errorCallback(response) {
        console.log(response);
      });
    }

    $scope.editAdmin = function(user, isAdmin) {
      console.log(user);
      $http({
        method:'POST',
        url: '/admin/edit',
        data: { 
          userId: user._id,
          isAdmin: isAdmin
        }
      }).then(function successCallback(response) {
        console.log(response);
        reloadTeam();
      }, function errorCallback(response) {
        console.log(response);
      });
    };

    $scope.removeUser = function(user) {
      $http({
        method:'POST',
        url: '/admin/deleteUser',
        data: { 
          userId: user._id
        }
      }).then(function successCallback(response) {
        console.log(response);
        reloadTeam();
      }, function errorCallback(response) {
        console.log(response);
      });
    };

    $http.get('/auth/isAdmin', {}).then(
      function success(response) {
        console.log(response);
        reloadTeam();
      }, function error(response) {
        console.log(status);
        if (response.status == 401) {
          $window.location = "/";
        } else {
          $window.location = "/auth/login?next=/#/admin";
        }
      }
    );
  }]);

  app.controller('CarController', ['$http', function($http){
    var gl;
    var canvas;
    var shaderProgram;
    var vertexPositionBuffer;

    // Create a place to store vertex colors
    var vertexColorBuffer;
    var mvMatrix = mat4.create();
    var pMatrix = mat4.create();
    var mvMatrixStack = [];
    var GLOBALS = {};
    var angle = 0;

    window.requestAnimFrame = (function() {
      return window.requestAnimationFrame ||
             window.webkitRequestAnimationFrame ||
             window.mozRequestAnimationFrame ||
             window.oRequestAnimationFrame ||
             window.msRequestAnimationFrame ||
             function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
               window.setTimeout(callback, 1000/60);
             };
    })();
    console.log("LOADED");
    // window.addEventListener("load", init);

    function mvPushMatrix() {
        var copy = mat4.clone(mvMatrix);
        mvMatrixStack.push(copy);
    }

    function mvPopMatrix() {
        if (mvMatrixStack.length == 0) {
          throw "Invalid popMatrix!";
        }
        mvMatrix = mvMatrixStack.pop();
    }

    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    }

    function createGLContext(canvas) {
      var names = ["webgl", "experimental-webgl"];
      var context = null;
      for (var i=0; i < names.length; i++) {
        try {
          context = canvas.getContext(names[i]);
        } catch(e) {}
        if (context) {
          break;
        }
      }
      if (context) {
        context.viewportWidth = canvas.width;
        context.viewportHeight = canvas.height;
      } else {
        alert("Failed to create WebGL context!");
      }
      return context;
    }


    function loadShaderFromDOM(id) {
      var shaderScript = document.getElementById(id);
      
      // If we don't find an element with the specified id
      // we do an early exit 
      if (!shaderScript) {
        return null;
      }
      
      // Loop through the children for the found DOM element and
      // build up the shader source code as a string
      var shaderSource = "";
      var currentChild = shaderScript.firstChild;
      while (currentChild) {
        if (currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE
          shaderSource += currentChild.textContent;
        }
        currentChild = currentChild.nextSibling;
      }
     
      var shader;
      if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
      } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
      } else {
        return null;
      }
     
      gl.shaderSource(shader, shaderSource);
      gl.compileShader(shader);
     
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
      } 
      return shader;
    }

    function setupShaders() {
      vertexShader = loadShaderFromDOM("shader-vs");
      fragmentShader = loadShaderFromDOM("shader-fs");
      
      shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);

      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Failed to setup shaders");
      }

      gl.useProgram(shaderProgram);
      shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
      gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

      shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
      gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
      shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
      shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
      
    }

    function setupBuffers() {
      vertexPositionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
      var triangleVertices = GLOBALS.triangles;
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
      vertexPositionBuffer.itemSize = 3;
      vertexPositionBuffer.numberOfItems = GLOBALS.cad.faces.length;
        
      vertexColorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
      var colors = [];
      for (var i = 0; i<triangleVertices; i++) {
        colors.push(1.0, 0.0, 0.0, 1.0)
      }
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
      vertexColorBuffer.itemSize = 4;
      vertexColorBuffer.numItems = triangleVertices.length/4;  
    }

    function draw() { 
      console.log("Drawing");
      var transformVec = vec3.create();

      gl.viewport(0.0, 0.0, gl.viewportWidth, gl.viewportHeight);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      mat4.ortho(pMatrix, -1, 1, -1, 1, 1, -1);

      mat4.identity(mvMatrix);
      mvPushMatrix();
      mvPushMatrix();
      vec3.set(transformVec,10.0,10.0,10.0);
      mat4.rotateX(mvMatrix, mvMatrix, angle*Math.PI/180);
      mat4.rotateY(mvMatrix, mvMatrix, angle*Math.PI/180); 
      mat4.rotateZ(mvMatrix, mvMatrix, angle*Math.PI/180); 
      mat4.scale(mvMatrix, mvMatrix,transformVec);

      gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
      gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                             vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
      gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
                                vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
      
      setMatrixUniforms();                      
      gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numberOfItems);
    }

    function getCAD(callback) {  
      // var request = new XMLHttpRequest();
      // request.open('GET', '/test/JSON', true);

      // request.onload = function() {
      //   if (request.status >= 200 && request.status < 400) {
      //     // Success!
      //     var data = JSON.parse(request.responseText);
      //     return callback(null, data);
      //   } else {
      //     // We reached our target server, but it returned an error
      //     var err = new Error('Bad Request:' + request.status);
      //     return callback(err, null);
      //   }
      // };

      // request.onerror = function() {
      //   // There was a connection error of some sort
      //   var err = new Error('Bad Request: getting CAD');
      //   return callback(err, null)
      // };

      // request.send();
      $http({
        method:'GET',
        url: 'test/JSON'
      }).then(function successCallback(response){
        console.log("RETURNED");
        console.log(response.data);
        // var data = JSON.parse(response.data);
        return callback(null, response.data);
      }, function errorCallback(response){
        console.log(response);
      })
    }

    function setupTriangleArray() {
      var triangles = [];
      var face, vert;
      for (var i = 0; i<GLOBALS.cad.faces.length; i++) {
        face = GLOBALS.cad.faces[i];
        for (var j = 0; j<face.length-1; j++) {
          vert = GLOBALS.cad.verts[face[j]]
          for (var k = 0; k<vert.length; k++) {
            triangles.push(vert[k]);
          }
        }
      }
      GLOBALS.triangles = triangles;
    }

    function animate() {
        angle=angle+1.;
    }

    function init() {
      getCAD(function(err, data) {
        GLOBALS.cad = data;
        setupTriangleArray();
        canvas = document.getElementById("test");
        // canvas = document.createElement('Canvas');
        // canvas.height = 800;
        // canvas.width = 1000;
        gl = createGLContext(canvas);
        // document.body.appendChild(canvas);
        setupShaders(); 
        setupBuffers();
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        draw();
        tick();
      });
      
    }

    function tick() {
        requestAnimFrame(tick);
        draw();
        animate();
    }

    this.init = function(){
        init();
    }
  }]);
})();