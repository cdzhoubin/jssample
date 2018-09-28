var imgageZoom = function (id, config) {
            var imgId = id;
            var canvasId = id + "_canvas";
            var _config = { scale: 2, raddius: 100,canvasClass:"canvas"};  // 图片被放大区域的半径  // 放大倍数

            var img = document.getElementById(imgId);
            _config.width = img.width;
            _config.height = img.height;
            if (config) {
                if (config.width) {
                    _config.width = config.width;
                }

                if (config.height) {
                    _config.height = config.height;
                }
                if(config.canvasClass){
                    _config.canvasClass = config.canvasClass;
                }
            }
            //创建包裹div
            function _createRelDiv() {
                var oRelDiv = document.createElement("div");
                oRelDiv.id = imgId + "_div";
                oRelDiv.style.width = _config.width + "px";
                oRelDiv.style.height = _config.height + "px";

                //插入到当前图片对象之前
                img.parentNode.insertBefore(oRelDiv, img);
                var sInnerHtml = "";
                sInnerHtml += '<canvas id="' + canvasId + '" style="display:none" class="'+ _config.canvasClass +'" width="' + _config.width + '" height="' + _config.height + '" ></canvas>';

                //嵌入HTML元素
                oRelDiv.innerHTML = sInnerHtml;
                //图片重新插入
                var canvas1 = document.getElementById(canvasId);
                if (window.ActiveXObject && window.G_vmlCanvasManager) {
                    //IE
                    canvas1 = window.G_vmlCanvasManager.initElement(canvas1); //使IE支持动态创建的canvas元素
                }
                oRelDiv.insertBefore(img, canvas1);
                return canvas1;
            }

            var canvas = _createRelDiv();


            //画图方法集开始
            // 图片被放大区域的中心点，也是放大镜的中心点
            var centerPoint = {};
            // 图片被放大区域
            var originalRectangle = {};
            // 放大后区域
            var scaleGlassRectangle

            centerPoint.x = 200;
            centerPoint.y = 200;


            var context = canvas.getContext("2d");
            function drawBackGround() {
                context.drawImage(img, 0, 0,_config.width,_config.height);
            }
            function calOriginalRectangle(point) {
                originalRectangle.x = point.x - _config.raddius;
                originalRectangle.y = point.y - _config.raddius;
                originalRectangle.width = _config.raddius * 2;
                originalRectangle.height = _config.raddius * 2;
            }

            function drawMagnifyingGlass() {
                scaleGlassRectangle = {
                    x: centerPoint.x - originalRectangle.width * _config.scale / 2,
                    y: centerPoint.y - originalRectangle.height * _config.scale / 2,
                    width: originalRectangle.width * _config.scale,
                    height: originalRectangle.height * _config.scale
                }

                context.save();
                context.beginPath();
                context.arc(centerPoint.x, centerPoint.y, _config.raddius, 0, Math.PI * 2, false);
                context.clip();

                context.drawImage(canvas,

                    originalRectangle.x, originalRectangle.y,
                    originalRectangle.width, originalRectangle.height,
                    scaleGlassRectangle.x, scaleGlassRectangle.y,
                    scaleGlassRectangle.width, scaleGlassRectangle.height
                )

                context.restore();
                context.beginPath();

                var gradient = context.createRadialGradient(
                    centerPoint.x, centerPoint.y, _config.raddius - 5,
                    centerPoint.x, centerPoint.y, _config.raddius);
                gradient.addColorStop(0, 'rgba(0,0,0,0.2)');
                gradient.addColorStop(0.80, 'silver');
                gradient.addColorStop(0.90, 'silver');
                gradient.addColorStop(1.0, 'rgba(150,150,150,0.9)');

                context.strokeStyle = gradient;
                context.lineWidth = 5;
                context.arc(centerPoint.x, centerPoint.y, _config.raddius, 0, Math.PI * 2, false);
                context.stroke();
            }

            function draw() {
                clear();
                drawBackGround();
                calOriginalRectangle(centerPoint);
                drawMagnifyingGlass();
            }
            function clear() {
                context.clearRect(0, 0, canvas.width, canvas.height);
            }

            function addListener() {
                canvas.onmousemove = function (e) {
                    centerPoint = windowToCanvas(e.clientX, e.clientY);
                    draw();
                }
            }
            function removeListener() {
                canvas.onmousemove = null;
            }

            function windowToCanvas(x, y) {
                var bbox = canvas.getBoundingClientRect();
                var bbox = canvas.getBoundingClientRect();
                return { x: x - bbox.left, y: y - bbox.top }
            }
            function _start() {
                img.style.display = "none";
                canvas.style.display = "";
                addListener();
                draw();
            }
            function _stop() {
                img.style.display = "";
                canvas.style.display = "none";
                removeListener();
                clear();
            }
            //画图方法集完成

            return {
                start: function () { _start(); },
                stop: function () { _stop(); }
            };


        };