/**
 * ==============================================================================
 * SCRIPT DE FISIOLOGÍA MÉDICA INTEGRADA (APUNTES UNI)
 * Módulo interactivo con Simulador Cardíaco 3D, Wiggers, Navegador de Nefrona,
 * Laboratorio de Digestión, Balanza Ácido-Base, Flashcards 3D, Audio-Card y Casos
 * Basado en el "Tratado Avanzado de Fisiología Médica: Sistemas y Homeostasis"
 * ==============================================================================
 */

(function () {
    'use strict';

    // --------------------------------------------------------------------------
    // 0. GESTIÓN DE PESTAÑAS (TABS) DEL MÓDULO DE FISIOLOGÍA
    // --------------------------------------------------------------------------
    function initFisioTabs() {
        const tabBtns = document.querySelectorAll('.fisio-tab-btn');
        const tabPanels = document.querySelectorAll('.fisio-tab-panel');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-fisio-tab');
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanels.forEach(p => {
                    p.classList.add('hidden');
                    p.classList.remove('block');
                });

                btn.classList.add('active');
                const targetPanel = document.getElementById(targetId);
                if (targetPanel) {
                    targetPanel.classList.remove('hidden');
                    targetPanel.classList.add('block');
                }

                // Disparar re-render de Three.js si se cambia al simulador cardíaco o nefrona
                if (targetId === 'tab-cardio' && window.onResizeCardio3D) {
                    setTimeout(window.onResizeCardio3D, 50);
                }
                if (targetId === 'tab-nefrona' && window.onResizeNephron3D) {
                    setTimeout(window.onResizeNephron3D, 50);
                }
            });
        });
    }

    // --------------------------------------------------------------------------
    // 1. SIMULADOR DEL CICLO CARDÍACO Y DIAGRAMA DE WIGGERS
    // --------------------------------------------------------------------------
    function initCardiacSimulator() {
        const container3D = document.getElementById('cardiac-3d-canvas-container');
        const wiggersCanvas = document.getElementById('wiggers-canvas');
        if (!container3D || !wiggersCanvas) return;

        let scene, camera, renderer, controls;
        let heartGroup, ventricleMesh, atriumMesh, aortaMesh;
        let saNodeMesh, avNodeMesh, purkinjeMesh;
        let animFrameId = null;

        // Estado del Ciclo Cardíaco
        const cycleState = {
            time: 0,           // 0 a 0.8 s (75 lpm)
            duration: 0.8,     // Segundos por ciclo
            heartRate: 75,     // lpm
            isPlaying: true,
            selectedNode: 'sa', // 'sa', 'av', 'ventricle'
            lastTimestamp: 0
        };

        // Fases del Ciclo Cardíaco según Tratado (Diagrama de Wiggers)
        const cardiacPhases = [
            { id: 1, name: 'Llenado Rápido Ventricular', range: [0.45, 0.60], valves: 'Mitral: Abierta | Aórtica: Cerrada', desc: 'Apertura de la válvula AV por caída de presión intraventricular. Ingreso pasivo de ~70% del volumen telediastólico.' },
            { id: 2, name: 'Diástasis (Llenado Lento)', range: [0.60, 0.72], valves: 'Mitral: Abierta | Aórtica: Cerrada', desc: 'Flujo pasivo continuo de baja velocidad desde las venas cavas y pulmonares hacia los ventrículos.' },
            { id: 3, name: 'Sístole Auricular (Onda P)', range: [0.72, 0.80], valves: 'Mitral: Abierta | Aórtica: Cerrada', desc: 'Despolarización del nodo SA (onda P). Contracción auricular que aporta el 15-20% final de la precarga miocárdica (Ley de Frank-Starling).' },
            { id: 4, name: 'Contracción Isovolumétrica', range: [0.00, 0.08], valves: 'Mitral: CERRADA (R1) | Aórtica: Cerrada', desc: 'Despolarización ventricular masiva (complejo QRS). Cierre hermético de válvulas AV (Primer ruido R1 - "Lub"). Rápido ascenso presurizado sin cambio de volumen.' },
            { id: 5, name: 'Eyección Ventricular Rápida', range: [0.08, 0.24], valves: 'Mitral: Cerrada | Aórtica: ABIERTA', desc: 'La presión ventricular supera a la aórtica (>80 mmHg). Apertura de válvulas semilunares con expulsión masiva del 70% del volumen sistólico.' },
            { id: 6, name: 'Eyección Ventricular Lenta', range: [0.24, 0.38], valves: 'Mitral: Cerrada | Aórtica: ABIERTA', desc: 'Disminución del gradiente de presión. Desaceleración del flujo sistólico mientras inicia la repolarización ventricular (onda T).' },
            { id: 7, name: 'Relajación Isovolumétrica', range: [0.38, 0.45], valves: 'Mitral: Cerrada | Aórtica: CERRADA (R2)', desc: 'Desplome de la presión ventricular por debajo de la aórtica. Cierre semilunar (Segundo ruido R2 - "Dub" con muesca dícrota aórtica).' }
        ];

        // 1.1 Configurar Three.js para el Corazón 3D
        if (typeof THREE !== 'undefined') {
            const width = container3D.clientWidth || 400;
            const height = container3D.clientHeight || 380;

            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
            camera.position.set(0, 0, 7.5);

            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.2;
            container3D.appendChild(renderer.domElement);

            if (typeof THREE.OrbitControls !== 'undefined') {
                controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
                controls.dampingFactor = 0.08;
                controls.minDistance = 3.5;
                controls.maxDistance = 12;
                controls.enablePan = false;
            }

            // Luces médicas estilizadas
            const ambLight = new THREE.AmbientLight(0xffffff, 0.85);
            scene.add(ambLight);

            const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
            dirLight1.position.set(5, 8, 5);
            scene.add(dirLight1);

            const dirLight2 = new THREE.DirectionalLight(0x60a5fa, 0.5);
            dirLight2.position.set(-5, -4, -4);
            scene.add(dirLight2);

            // Construcción Procedural del Corazón 3D
            heartGroup = new THREE.Group();

            // Materiales de alta calidad y muy ligeros
            const muscleMat = new THREE.MeshStandardMaterial({
                color: 0xef4444,
                roughness: 0.35,
                metalness: 0.1,
                emissive: 0x7f1d1d,
                emissiveIntensity: 0.25
            });

            const blueVesselMat = new THREE.MeshStandardMaterial({
                color: 0x3b82f6,
                roughness: 0.3,
                metalness: 0.2
            });

            const redAortaMat = new THREE.MeshStandardMaterial({
                color: 0xdc2626,
                roughness: 0.3,
                metalness: 0.15
            });

            // Ventrículos (Cuerpo muscular con dos lóbulos fusionados)
            const leftVentGeom = new THREE.SphereGeometry(1.3, 32, 32);
            leftVentGeom.scale(1, 1.45, 0.95);
            const leftVent = new THREE.Mesh(leftVentGeom, muscleMat);
            leftVent.position.set(-0.35, -0.4, 0);
            leftVent.rotation.z = 0.2;
            heartGroup.add(leftVent);

            const rightVentGeom = new THREE.SphereGeometry(1.15, 32, 32);
            rightVentGeom.scale(0.9, 1.35, 0.9);
            const rightVent = new THREE.Mesh(rightVentGeom, muscleMat);
            rightVent.position.set(0.65, -0.45, 0.15);
            rightVent.rotation.z = -0.15;
            heartGroup.add(rightVent);
            ventricleMesh = leftVent;

            // Aurículas (Superior)
            const atriumGeom = new THREE.SphereGeometry(0.9, 24, 24);
            const leftAtrium = new THREE.Mesh(atriumGeom, muscleMat);
            leftAtrium.position.set(-0.6, 1.1, -0.2);
            heartGroup.add(leftAtrium);

            const rightAtrium = new THREE.Mesh(atriumGeom, muscleMat);
            rightAtrium.position.set(0.7, 1.0, 0.1);
            heartGroup.add(rightAtrium);
            atriumMesh = rightAtrium;

            // Arco Aórtico (Tubo curvado rojo)
            const aortaCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-0.1, 0.8, 0.2),
                new THREE.Vector3(-0.2, 1.8, 0.1),
                new THREE.Vector3(0.2, 2.3, -0.2),
                new THREE.Vector3(0.7, 1.9, -0.4),
                new THREE.Vector3(0.8, 0.8, -0.6)
            ]);
            const aortaGeom = new THREE.TubeGeometry(aortaCurve, 32, 0.35, 16, false);
            aortaMesh = new THREE.Mesh(aortaGeom, redAortaMat);
            heartGroup.add(aortaMesh);

            // Ramas del arco aórtico (Tronco braquiocefálico, carótida, subclavia)
            for (let i = 0; i < 3; i++) {
                const branchGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 12);
                const branch = new THREE.Mesh(branchGeom, redAortaMat);
                branch.position.set(-0.1 + i * 0.3, 2.45, -0.15 + i * -0.05);
                branch.rotation.z = -0.2 + i * 0.1;
                heartGroup.add(branch);
            }

            // Tronco y Arteria Pulmonar (Azul)
            const pulmCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0.4, 0.6, 0.4),
                new THREE.Vector3(0.1, 1.5, 0.2),
                new THREE.Vector3(-0.5, 1.7, -0.1)
            ]);
            const pulmGeom = new THREE.TubeGeometry(pulmCurve, 24, 0.3, 16, false);
            const pulmMesh = new THREE.Mesh(pulmGeom, blueVesselMat);
            heartGroup.add(pulmMesh);

            // Vena Cava Superior e Inferior
            const cavaGeom = new THREE.CylinderGeometry(0.26, 0.26, 1.8, 16);
            const cavaMesh = new THREE.Mesh(cavaGeom, blueVesselMat);
            cavaMesh.position.set(1.3, 1.1, -0.3);
            heartGroup.add(cavaMesh);

            // 1.2 NODOS DE CONDUCCIÓN ELÉCTRICA INTERACTIVOS 3D
            const glowNodeMat = new THREE.MeshStandardMaterial({
                color: 0xfef08a,
                emissive: 0xeab308,
                emissiveIntensity: 1.2,
                roughness: 0.2
            });

            // Nodo SA (Unión vena cava superior y aurícula derecha)
            const saGeom = new THREE.SphereGeometry(0.22, 16, 16);
            saNodeMesh = new THREE.Mesh(saGeom, glowNodeMat.clone());
            saNodeMesh.position.set(1.2, 1.6, 0.1);
            saNodeMesh.userData = { id: 'sa', name: 'Nodo Sinoauricular (SA)' };
            heartGroup.add(saNodeMesh);

            // Nodo AV (Base del tabique interauricular)
            const avGeom = new THREE.SphereGeometry(0.2, 16, 16);
            avNodeMesh = new THREE.Mesh(avGeom, glowNodeMat.clone());
            avNodeMesh.position.set(0.2, 0.4, 0.3);
            avNodeMesh.userData = { id: 'av', name: 'Nodo Auriculoventricular (AV)' };
            heartGroup.add(avNodeMesh);

            // Fibras de Purkinje / Miocardiocito Ventricular
            const purkMat = new THREE.MeshStandardMaterial({
                color: 0x67e8f9,
                emissive: 0x06b6d4,
                emissiveIntensity: 1.0,
                roughness: 0.2
            });
            const purkGeom = new THREE.SphereGeometry(0.24, 16, 16);
            purkinjeMesh = new THREE.Mesh(purkGeom, purkMat);
            purkinjeMesh.position.set(-0.7, -0.6, 0.7);
            purkinjeMesh.userData = { id: 'ventricle', name: 'Miocardiocito Contráctil Ventricular' };
            heartGroup.add(purkinjeMesh);

            heartGroup.position.set(0, -0.2, 0);
            scene.add(heartGroup);

            // Ajuste responsivo de la ventana 3D
            window.onResizeCardio3D = () => {
                if (!container3D || !renderer || !camera) return;
                const w = container3D.clientWidth || 400;
                const h = container3D.clientHeight || 380;
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
            };
            window.addEventListener('resize', window.onResizeCardio3D);

            // Raycasting para clics en los nodos 3D
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();

            renderer.domElement.addEventListener('click', (event) => {
                const rect = renderer.domElement.getBoundingClientRect();
                mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects([saNodeMesh, avNodeMesh, purkinjeMesh], false);

                if (intersects.length > 0) {
                    const clickedObj = intersects[0].object;
                    const nodeId = clickedObj.userData.id;
                    selectCardiacNode(nodeId);
                }
            });
        }

        // 1.3 Canvas del Diagrama de Wiggers
        const ctx = wiggersCanvas.getContext('2d');
        let dpr = window.devicePixelRatio || 1;

        function resizeWiggersCanvas() {
            const rect = wiggersCanvas.parentElement.getBoundingClientRect();
            wiggersCanvas.width = rect.width * dpr;
            wiggersCanvas.height = 360 * dpr;
            wiggersCanvas.style.height = '360px';
        }
        resizeWiggersCanvas();
        window.addEventListener('resize', resizeWiggersCanvas);

        // Click en el diagrama de Wiggers para scrubear fase
        wiggersCanvas.addEventListener('click', (e) => {
            const rect = wiggersCanvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const progress = Math.max(0, Math.min(1, clickX / rect.width));
            cycleState.time = progress * cycleState.duration;
            updateCardiacInfo();
        });

        // 1.4 Renderizado del Diagrama de Wiggers
        function drawWiggers(t) {
            const w = wiggersCanvas.width;
            const h = wiggersCanvas.height;
            ctx.clearRect(0, 0, w, h);

            const computedStyle = getComputedStyle(document.body);
            const gridColor = computedStyle.getPropertyValue('--color-text-inactive').trim();
            const textColor = computedStyle.getPropertyValue('--black-color').trim();

            // Ejes y Grid
            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 1 * dpr;
            ctx.font = `${10 * dpr}px sans-serif`;
            ctx.fillStyle = textColor;

            // Líneas horizontales de presión (0, 40, 80, 120 mmHg)
            const pTop = 30 * dpr;
            const pHeight = 200 * dpr;
            const pressures = [0, 40, 80, 120];
            pressures.forEach(p => {
                const y = pTop + pHeight - (p / 130) * pHeight;
                ctx.beginPath();
                ctx.moveTo(45 * dpr, y);
                ctx.lineTo(w - 15 * dpr, y);
                ctx.stroke();
                ctx.fillText(`${p} mmHg`, 5 * dpr, y + 3 * dpr);
            });

            // Trazado de las curvas en función del tiempo t (0 a 0.8)
            const plotStart = 50 * dpr;
            const plotWidth = w - 65 * dpr;

            function getX(timeSec) {
                return plotStart + (timeSec / cycleState.duration) * plotWidth;
            }

            function getYPress(mmHg) {
                return pTop + pHeight - (mmHg / 130) * pHeight;
            }

            // AÓRTICA (Curva Roja)
            ctx.beginPath();
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2.5 * dpr;
            for (let s = 0; s <= 0.8; s += 0.01) {
                let p = 80;
                if (s >= 0.08 && s < 0.22) {
                    // Ascenso eyección rápida
                    const f = (s - 0.08) / 0.14;
                    p = 80 + 40 * Math.sin(f * Math.PI * 0.5);
                } else if (s >= 0.22 && s < 0.38) {
                    // Eyección lenta
                    const f = (s - 0.22) / 0.16;
                    p = 120 - 20 * f;
                } else if (s >= 0.38 && s < 0.42) {
                    // Muesca dícrota
                    p = 100 + 4 * Math.sin((s - 0.38) / 0.04 * Math.PI);
                } else if (s >= 0.42) {
                    // Caída diastólica lenta
                    const f = (s - 0.42) / 0.38;
                    p = 100 - 20 * f;
                } else {
                    p = 80;
                }
                const x = getX(s);
                const y = getYPress(p);
                if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // VENTRICULAR IZQUIERDA (Curva Azul)
            ctx.beginPath();
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2.5 * dpr;
            for (let s = 0; s <= 0.8; s += 0.01) {
                let p = 8;
                if (s < 0.08) {
                    // Contracción isovolumétrica: sube de 10 a 80 mmHg
                    p = 10 + 70 * (s / 0.08);
                } else if (s >= 0.08 && s < 0.20) {
                    // Pico sistólico 120 mmHg
                    const f = (s - 0.08) / 0.12;
                    p = 80 + 40 * Math.sin(f * Math.PI * 0.5);
                } else if (s >= 0.20 && s < 0.38) {
                    // Descenso eyección tardía
                    const f = (s - 0.20) / 0.18;
                    p = 120 - 40 * f;
                } else if (s >= 0.38 && s < 0.45) {
                    // Relajación isovolumétrica: cae de 80 a 5 mmHg
                    const f = (s - 0.38) / 0.07;
                    p = 80 - 75 * f;
                } else if (s >= 0.72) {
                    // Sístole auricular: ligera onda 'a'
                    p = 5 + 6 * Math.sin((s - 0.72) / 0.08 * Math.PI);
                } else {
                    p = 5;
                }
                const x = getX(s);
                const y = getYPress(p);
                if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // AURICULAR IZQUIERDA (Curva Amarilla con ondas a, c, v)
            ctx.beginPath();
            ctx.strokeStyle = '#eab308';
            ctx.lineWidth = 1.8 * dpr;
            for (let s = 0; s <= 0.8; s += 0.01) {
                let p = 6;
                if (s >= 0.72 && s < 0.80) {
                    // Onda a (contracción auricular)
                    p = 6 + 7 * Math.sin((s - 0.72) / 0.08 * Math.PI);
                } else if (s >= 0.02 && s < 0.09) {
                    // Onda c (abombamiento válvula mitral en sístole temprana)
                    p = 6 + 5 * Math.sin((s - 0.02) / 0.07 * Math.PI);
                } else if (s >= 0.30 && s < 0.45) {
                    // Onda v (llenado auricular con válvula cerrada)
                    p = 6 + 6 * Math.sin((s - 0.30) / 0.15 * Math.PI);
                }
                const x = getX(s);
                const y = getYPress(p);
                if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // VOLUMEN VENTRICULAR (Curva Verde en tercio inferior)
            const volTop = 245 * dpr;
            const volHeight = 70 * dpr;
            ctx.beginPath();
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2 * dpr;
            for (let s = 0; s <= 0.8; s += 0.01) {
                let vol = 120; // EDV ~120 ml
                if (s >= 0.08 && s < 0.38) {
                    // Eyección: cae a ESV ~50 ml
                    const f = (s - 0.08) / 0.30;
                    vol = 120 - 70 * (0.5 - 0.5 * Math.cos(f * Math.PI));
                } else if (s >= 0.45 && s < 0.60) {
                    // Llenado rápido: sube a 100 ml
                    const f = (s - 0.45) / 0.15;
                    vol = 50 + 50 * f;
                } else if (s >= 0.60 && s < 0.72) {
                    // Diástasis: sube a 105 ml
                    vol = 100 + 5 * ((s - 0.60) / 0.12);
                } else if (s >= 0.72) {
                    // Sístole auricular: llena hasta 120 ml
                    const f = (s - 0.72) / 0.08;
                    vol = 105 + 15 * f;
                } else {
                    vol = 120;
                }
                const x = getX(s);
                const y = volTop + volHeight - ((vol - 40) / 90) * volHeight;
                if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Leyendas compactas
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(plotStart, 12 * dpr, 8 * dpr, 8 * dpr);
            ctx.fillStyle = textColor;
            ctx.fillText('P. Aórtica', plotStart + 12 * dpr, 19 * dpr);

            ctx.fillStyle = '#3b82f6';
            ctx.fillRect(plotStart + 75 * dpr, 12 * dpr, 8 * dpr, 8 * dpr);
            ctx.fillStyle = textColor;
            ctx.fillText('P. Ventricular Izq.', plotStart + 87 * dpr, 19 * dpr);

            ctx.fillStyle = '#eab308';
            ctx.fillRect(plotStart + 185 * dpr, 12 * dpr, 8 * dpr, 8 * dpr);
            ctx.fillStyle = textColor;
            ctx.fillText('P. Auricular (a, c, v)', plotStart + 197 * dpr, 19 * dpr);

            ctx.fillStyle = '#10b981';
            ctx.fillRect(plotStart + 300 * dpr, 12 * dpr, 8 * dpr, 8 * dpr);
            ctx.fillStyle = textColor;
            ctx.fillText('Volumen Ventricular', plotStart + 312 * dpr, 19 * dpr);

            // CURSOR VERTICAL SINCRONIZADO EN TIEMPO REAL
            const cursorX = getX(t);
            ctx.strokeStyle = '#8b5cf6';
            ctx.lineWidth = 2 * dpr;
            ctx.setLineDash([4 * dpr, 2 * dpr]);
            ctx.beginPath();
            ctx.moveTo(cursorX, 10 * dpr);
            ctx.lineTo(cursorX, h - 10 * dpr);
            ctx.stroke();
            ctx.setLineDash([]);

            // Indicador de tiempo en el cursor
            ctx.fillStyle = '#8b5cf6';
            ctx.beginPath();
            ctx.arc(cursorX, 12 * dpr, 5 * dpr, 0, Math.PI * 2);
            ctx.fill();
        }

        // 1.5 Actualización de Textos e Info del Ciclo Cardíaco
        function updateCardiacInfo() {
            const currentSec = cycleState.time;
            const phase = cardiacPhases.find(p => currentSec >= p.range[0] && currentSec < p.range[1]) || cardiacPhases[3];

            const phaseTitleEl = document.getElementById('cardiac-phase-title');
            const phaseDescEl = document.getElementById('cardiac-phase-desc');
            const valvesStatusEl = document.getElementById('cardiac-valves-status');
            const timeDisplayEl = document.getElementById('cardiac-time-display');

            if (phaseTitleEl) phaseTitleEl.textContent = `${phase.id}. ${phase.name}`;
            if (phaseDescEl) phaseDescEl.textContent = phase.desc;
            if (valvesStatusEl) valvesStatusEl.textContent = phase.valves;
            if (timeDisplayEl) timeDisplayEl.textContent = `${currentSec.toFixed(2)} s / 0.80 s`;
        }

        // 1.6 Bucle Principal de Animación
        function animateCardiac(timestamp) {
            animFrameId = requestAnimationFrame(animateCardiac);

            if (!cycleState.lastTimestamp) cycleState.lastTimestamp = timestamp;
            const deltaSec = (timestamp - cycleState.lastTimestamp) / 1000;
            cycleState.lastTimestamp = timestamp;

            if (cycleState.isPlaying) {
                cycleState.time += deltaSec * (cycleState.heartRate / 75);
                if (cycleState.time >= cycleState.duration) {
                    cycleState.time = 0;
                }
            }

            // Animación física del corazón 3D
            if (heartGroup) {
                // Sístole ocurre entre 0.0s y 0.38s: contracción rítmica
                const t = cycleState.time;
                let contractionFactor = 1.0;

                if (t >= 0.05 && t < 0.25) {
                    // Sístole ventricular máxima
                    const s = (t - 0.05) / 0.20;
                    contractionFactor = 1.0 - 0.09 * Math.sin(s * Math.PI);
                } else if (t >= 0.70 && t < 0.80) {
                    // Contracción auricular
                    contractionFactor = 1.0 + 0.03 * Math.sin((t - 0.70) / 0.10 * Math.PI);
                }

                heartGroup.scale.set(contractionFactor, contractionFactor, contractionFactor);

                // Rotación suave automática
                heartGroup.rotation.y += 0.003;

                // Pulsación luminosa del nodo activo
                if (cycleState.selectedNode === 'sa' && saNodeMesh) {
                    const pulse = 1.0 + 0.5 * Math.sin(timestamp * 0.008);
                    saNodeMesh.material.emissiveIntensity = pulse;
                } else if (cycleState.selectedNode === 'av' && avNodeMesh) {
                    const pulse = 1.0 + 0.5 * Math.sin(timestamp * 0.008);
                    avNodeMesh.material.emissiveIntensity = pulse;
                } else if (cycleState.selectedNode === 'ventricle' && purkinjeMesh) {
                    const pulse = 1.0 + 0.5 * Math.sin(timestamp * 0.008);
                    purkinjeMesh.material.emissiveIntensity = pulse;
                }
            }

            if (controls) controls.update();
            if (renderer && scene && camera) renderer.render(scene, camera);

            // Dibujar Wiggers sincronizado
            drawWiggers(cycleState.time);
            updateCardiacInfo();
        }

        // Iniciar loop
        animFrameId = requestAnimationFrame(animateCardiac);

        // Controles de Play/Pause y BPM
        const playBtn = document.getElementById('btn-play-cardio');
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                cycleState.isPlaying = !cycleState.isPlaying;
                playBtn.innerHTML = cycleState.isPlaying ?
                    '<span class="material-symbols-outlined">pause</span> Pausar' :
                    '<span class="material-symbols-outlined">play_arrow</span> Reanudar';
            });
        }

        const bpmSelect = document.getElementById('select-cardio-bpm');
        if (bpmSelect) {
            bpmSelect.addEventListener('change', (e) => {
                cycleState.heartRate = parseInt(e.target.value) || 75;
            });
        }

        // 1.7 Gráfico Dinámico de Potenciales de Acción (Nodos vs Ventrículo)
        window.selectCardiacNode = function (nodeId) {
            cycleState.selectedNode = nodeId;

            // Actualizar botones de nodo en UI
            const nodeBtns = document.querySelectorAll('.node-pill-btn');
            nodeBtns.forEach(btn => {
                if (btn.getAttribute('data-node') === nodeId) {
                    btn.classList.add('active-node');
                } else {
                    btn.classList.remove('active-node');
                }
            });

            renderActionPotentialGraph(nodeId);
        };

        // Escuchar clics en los botones de selección de nodos de la UI
        document.querySelectorAll('.node-pill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const nodeId = btn.getAttribute('data-node');
                selectCardiacNode(nodeId);
            });
        });

        // Dibujar potencial de acción en el canvas comparativo
        function renderActionPotentialGraph(nodeType) {
            const apCanvas = document.getElementById('action-potential-canvas');
            if (!apCanvas) return;
            const apCtx = apCanvas.getContext('2d');
            const apDpr = window.devicePixelRatio || 1;

            const w = apCanvas.clientWidth * apDpr;
            const h = 220 * apDpr;
            apCanvas.width = w;
            apCanvas.height = h;
            apCanvas.style.height = '220px';

            const computedStyle = getComputedStyle(document.body);
            const textColor = computedStyle.getPropertyValue('--black-color').trim();
            const gridColor = computedStyle.getPropertyValue('--color-text-inactive').trim();

            apCtx.clearRect(0, 0, w, h);

            // Ejes de Voltaje (-90 mV a +30 mV)
            const vMin = -100;
            const vMax = +40;
            function getYVolt(mv) {
                return h - 30 * apDpr - ((mv - vMin) / (vMax - vMin)) * (h - 50 * apDpr);
            }

            // Líneas horizontales de referencia (-90, -60, -40 umbral, 0, +20 mV)
            [-90, -60, -40, 0, 20].forEach(mv => {
                const y = getYVolt(mv);
                apCtx.strokeStyle = gridColor;
                apCtx.lineWidth = 1 * apDpr;
                apCtx.beginPath();
                apCtx.moveTo(45 * apDpr, y);
                apCtx.lineTo(w - 15 * apDpr, y);
                apCtx.stroke();

                apCtx.fillStyle = textColor;
                apCtx.font = `${10 * apDpr}px sans-serif`;
                apCtx.fillText(`${mv} mV`, 5 * apDpr, y + 3 * apDpr);
            });

            const titleEl = document.getElementById('ap-graph-title');
            const descEl = document.getElementById('ap-graph-desc');
            const channelsEl = document.getElementById('ap-ion-channels');

            if (nodeType === 'sa' || nodeType === 'av') {
                // POTENCIAL DE ACCIÓN DE CÉLULAS MARCAPASO (NODO SA / AV)
                if (titleEl) titleEl.textContent = 'Potencial de Acción: Célula Marcapaso Nodal (Nodo SA)';
                if (descEl) descEl.textContent = 'Exhibe automatismo rítmico. Fase 4 inestable con despolarización diastólica espontánea impulsada por la corriente "funny" (If) de Na+ acoplada al reloj de Ca2+. La Fase 0 es un ascenso LENTO mediado exclusivamente por la apertura de canales de Ca2+ tipo L (insensible a canales rápidos de Na+). Fases 1 y 2 están ausentes.';
                if (channelsEl) channelsEl.innerHTML = `
                    <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/30">Fase 4: If (HCN Na+)</span>
                    <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-400/30">Fase 0 Lenta: Ca2+ tipo L</span>
                    <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-400/30">Fase 3: Salida K+</span>
                    <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-400/30">Reloj Ca2+: NCX</span>
                `;

                // Trazar curva nodal
                apCtx.beginPath();
                apCtx.strokeStyle = '#eab308';
                apCtx.lineWidth = 3.5 * apDpr;

                const startX = 55 * apDpr;
                const plotW = w - 75 * apDpr;

                for (let xNorm = 0; xNorm <= 1; xNorm += 0.01) {
                    let mv = -60;
                    if (xNorm < 0.40) {
                        // Fase 4: Despolarización diastólica de -60 a -40 mV (umbral)
                        mv = -60 + 20 * (xNorm / 0.40);
                    } else if (xNorm < 0.65) {
                        // Fase 0: Ascenso lento de -40 a +10 mV
                        const f = (xNorm - 0.40) / 0.25;
                        mv = -40 + 50 * Math.sin(f * Math.PI * 0.5);
                    } else {
                        // Fase 3: Repolarización de +10 a -60 mV
                        const f = (xNorm - 0.65) / 0.35;
                        mv = 10 - 70 * (0.5 - 0.5 * Math.cos(f * Math.PI));
                    }
                    const px = startX + xNorm * plotW;
                    const py = getYVolt(mv);
                    if (xNorm === 0) apCtx.moveTo(px, py); else apCtx.lineTo(px, py);
                }
                apCtx.stroke();

                // Puntos clave de anotación
                apCtx.fillStyle = '#10b981';
                const f0X = startX + 0.52 * plotW;
                const f0Y = getYVolt(-10);
                apCtx.beginPath();
                apCtx.arc(f0X, f0Y, 4 * apDpr, 0, Math.PI * 2);
                apCtx.fill();
                apCtx.fillText('Fase 0: Ca2+ Lento', f0X + 8 * apDpr, f0Y - 5 * apDpr);

            } else {
                // POTENCIAL DE ACCIÓN DE CARDIOMIOCITO CONTRÁCTIL VENTRICULAR
                if (titleEl) titleEl.textContent = 'Potencial de Acción: Cardiomiocito Contráctil Ventricular';
                if (descEl) descEl.textContent = 'Célula de trabajo contráctil. Fase 4 profundamente polarizada y estable en -90 mV garantizada por canales rectificadores de entrada IK1. La Fase 0 es un ASCENSO SÚBITO VERTICAL originado por un alud de entrada masiva de Na+ por canales rápidos Nav. Fase 1: muesca inicial por Ito de K+. Fase 2 (Meseta): balance de entrada sostenida de Ca2+ tipo L y salida de K+. Fase 3: repolarización por canales de K+ rectificadores tardíos.';
                if (channelsEl) channelsEl.innerHTML = `
                    <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-400/30">Fase 0 Rápida: Alud Na+ (Nav)</span>
                    <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/30">Fase 1: Muesca Ito (K+)</span>
                    <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-400/30">Fase 2 Meseta: Ca2+ L / K+</span>
                    <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-400/30">Fase 3: Rectificadores K+</span>
                    <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/20 text-slate-700 dark:text-slate-300 border border-slate-400/30">Fase 4: IK1 (-90 mV)</span>
                `;

                // Trazar curva ventricular
                apCtx.beginPath();
                apCtx.strokeStyle = '#06b6d4';
                apCtx.lineWidth = 3.5 * apDpr;

                const startX = 55 * apDpr;
                const plotW = w - 75 * apDpr;

                for (let xNorm = 0; xNorm <= 1; xNorm += 0.005) {
                    let mv = -90;
                    if (xNorm < 0.15) {
                        // Fase 4 reposo estable en -90 mV
                        mv = -90;
                    } else if (xNorm < 0.18) {
                        // Fase 0 ascenso súbito casi vertical a +25 mV
                        const f = (xNorm - 0.15) / 0.03;
                        mv = -90 + 115 * f;
                    } else if (xNorm < 0.23) {
                        // Fase 1 muesca temprana a +5 mV
                        const f = (xNorm - 0.18) / 0.05;
                        mv = 25 - 20 * f;
                    } else if (xNorm < 0.60) {
                        // Fase 2 meseta isoeléctrica alrededor de 0 mV a -5 mV
                        const f = (xNorm - 0.23) / 0.37;
                        mv = 5 - 10 * f;
                    } else if (xNorm < 0.82) {
                        // Fase 3 repolarización final acelerada a -90 mV
                        const f = (xNorm - 0.60) / 0.22;
                        mv = -5 - 85 * (0.5 - 0.5 * Math.cos(f * Math.PI));
                    } else {
                        // Fase 4
                        mv = -90;
                    }
                    const px = startX + xNorm * plotW;
                    const py = getYVolt(mv);
                    if (xNorm === 0) apCtx.moveTo(px, py); else apCtx.lineTo(px, py);
                }
                apCtx.stroke();

                // Anotación pico Fase 0 Na+
                apCtx.fillStyle = '#ef4444';
                const f0X = startX + 0.17 * plotW;
                const f0Y = getYVolt(20);
                apCtx.beginPath();
                apCtx.arc(f0X, f0Y, 4 * apDpr, 0, Math.PI * 2);
                apCtx.fill();
                apCtx.fillText('Fase 0: Na+ Súbito', f0X + 8 * apDpr, f0Y + 4 * apDpr);
            }
        }

        // Render inicial del potencial de acción
        renderActionPotentialGraph('sa');
    }

    // --------------------------------------------------------------------------
    // 2. NAVEGADOR DE LA NEFRONA Y REGULACIÓN HEMODINÁMICA (SRAA / ENaC)
    // --------------------------------------------------------------------------
    function initNephronNavigator() {
        const nephronContainer = document.getElementById('nephron-3d-canvas-container');
        if (!nephronContainer) return;

        let scene, camera, renderer, controls;
        let nephronGroup, glomerulusMesh, pctMesh, loopMesh, maculaMesh, dctMesh;

        // Estado Hemodinámico Interactivo
        const hemoState = {
            pam: 95,          // Presión Arterial Media (mmHg)
            maculaNaCl: 50,   // % de carga salina en Mácula Densa
            reninActive: false,
            aldosteroneLevel: 50, // 0 a 100%
            enacPreservation: 50  // % de canales ENaC activos
        };

        if (typeof THREE !== 'undefined') {
            const width = nephronContainer.clientWidth || 400;
            const height = nephronContainer.clientHeight || 420;

            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
            camera.position.set(0, 0, 11);

            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            nephronContainer.appendChild(renderer.domElement);

            if (typeof THREE.OrbitControls !== 'undefined') {
                controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
                controls.dampingFactor = 0.08;
                controls.minDistance = 4;
                controls.maxDistance = 16;
            }

            const ambLight = new THREE.AmbientLight(0xffffff, 0.9);
            scene.add(ambLight);

            const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
            dirLight.position.set(6, 10, 6);
            scene.add(dirLight);

            nephronGroup = new THREE.Group();

            // Materiales de los segmentos tubulares
            const glomMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2, metalness: 0.2 });
            const bowmanMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.45, roughness: 0.1 });
            const pctMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
            const loopThinMat = new THREE.MeshStandardMaterial({ color: 0x60a5fa, roughness: 0.3 });
            const loopThickMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.3 });
            const maculaMat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.8 });
            const dctMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.4 });
            const ccdMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.4 });

            // 1. Corpúsculo Renal (Cápsula de Bowman + Ovillo Glomerular)
            const bowmanGeom = new THREE.SphereGeometry(0.9, 24, 24);
            const bowmanMesh = new THREE.Mesh(bowmanGeom, bowmanMat);
            bowmanMesh.position.set(-2.8, 2.5, 0);
            nephronGroup.add(bowmanMesh);

            const glomGeom = new THREE.SphereGeometry(0.65, 20, 20);
            glomerulusMesh = new THREE.Mesh(glomGeom, glomMat);
            glomerulusMesh.position.copy(bowmanMesh.position);
            nephronGroup.add(glomerulusMesh);

            // Arteriola aferente y eferente
            const artGeom = new THREE.CylinderGeometry(0.12, 0.12, 1.2, 12);
            const afferent = new THREE.Mesh(artGeom, glomMat);
            afferent.position.set(-2.4, 3.4, 0.2);
            afferent.rotation.z = -0.4;
            nephronGroup.add(afferent);

            const efferent = new THREE.Mesh(artGeom, glomMat);
            efferent.position.set(-3.2, 3.4, -0.2);
            efferent.rotation.z = 0.4;
            nephronGroup.add(efferent);

            // 2. Túbulo Contorneado Proximal (TCP - Serpentina dorada)
            const pctCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-2.8, 1.6, 0),
                new THREE.Vector3(-2.2, 1.2, 0.5),
                new THREE.Vector3(-1.8, 1.8, 0.2),
                new THREE.Vector3(-1.4, 1.0, -0.4),
                new THREE.Vector3(-1.2, 0.2, 0)
            ]);
            const pctGeom = new THREE.TubeGeometry(pctCurve, 32, 0.22, 16, false);
            pctMesh = new THREE.Mesh(pctGeom, pctMat);
            nephronGroup.add(pctMesh);

            // 3. Asa de Henle (U profunda: descendente delgada + ascendente gruesa TAL)
            const loopCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-1.2, 0.2, 0),
                new THREE.Vector3(-1.1, -1.8, 0.2),
                new THREE.Vector3(-1.0, -3.4, 0), // Horquilla medular profunda
                new THREE.Vector3(-0.6, -3.5, 0),
                new THREE.Vector3(-0.4, -1.8, -0.2),
                new THREE.Vector3(-0.3, 0.5, 0),
                new THREE.Vector3(-1.5, 2.8, 0.3) // Retorna hasta la mácula densa junto a arteriolas
            ]);
            const loopGeom = new THREE.TubeGeometry(loopCurve, 48, 0.18, 16, false);
            loopMesh = new THREE.Mesh(loopGeom, loopThinMat);
            nephronGroup.add(loopMesh);

            // 4. Mácula Densa (Entre las arteriolas yuxtaglomerulares)
            const maculaGeom = new THREE.SphereGeometry(0.3, 16, 16);
            maculaMesh = new THREE.Mesh(maculaGeom, maculaMat);
            maculaMesh.position.set(-2.0, 3.1, 0.1);
            nephronGroup.add(maculaMesh);

            // 5. Túbulo Contorneado Distal (TCD) y Colector (CCD)
            const dctCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-1.5, 2.8, 0.3),
                new THREE.Vector3(-0.5, 2.4, 0.5),
                new THREE.Vector3(0.5, 2.6, 0),
                new THREE.Vector3(1.4, 2.2, -0.2)
            ]);
            const dctGeom = new THREE.TubeGeometry(dctCurve, 24, 0.22, 16, false);
            dctMesh = new THREE.Mesh(dctGeom, dctMat);
            nephronGroup.add(dctMesh);

            // Conducto Colector Cortical/Medular
            const ccdCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(1.4, 3.2, -0.2),
                new THREE.Vector3(1.4, 0, -0.2),
                new THREE.Vector3(1.4, -3.6, -0.2)
            ]);
            const ccdGeom = new THREE.TubeGeometry(ccdCurve, 24, 0.28, 16, false);
            const ccdMesh = new THREE.Mesh(ccdGeom, ccdMat);
            nephronGroup.add(ccdMesh);

            nephronGroup.position.set(0.6, 0.2, 0);
            scene.add(nephronGroup);

            // Bucle de renderizado de la Nefrona
            function animateNephron() {
                requestAnimationFrame(animateNephron);
                if (controls) controls.update();
                if (nephronGroup) nephronGroup.rotation.y += 0.002;
                if (renderer && scene && camera) renderer.render(scene, camera);
            }
            animateNephron();

            window.onResizeNephron3D = () => {
                if (!nephronContainer || !renderer || !camera) return;
                const w = nephronContainer.clientWidth || 400;
                const h = nephronContainer.clientHeight || 420;
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
            };
            window.addEventListener('resize', window.onResizeNephron3D);
        }

        // 2.2 Botones de Vistas Anatómicas de la Nefrona
        window.focusNephronSegment = function (segment) {
            if (!camera || !controls) return;
            if (segment === 'all') {
                camera.position.set(0, 0, 11);
                controls.target.set(0, 0, 0);
            } else if (segment === 'glomerulus') {
                camera.position.set(-2.5, 2.5, 4.5);
                controls.target.set(-2.5, 2.5, 0);
            } else if (segment === 'loop') {
                camera.position.set(-0.8, -2.5, 5);
                controls.target.set(-0.8, -2.5, 0);
            } else if (segment === 'macula') {
                camera.position.set(-1.8, 3.1, 3.5);
                controls.target.set(-2.0, 3.1, 0);
            } else if (segment === 'distal') {
                camera.position.set(1.5, 1.0, 5);
                controls.target.set(1.4, 1.0, 0);
            }
        };

        // 2.3 Simulación Dinámica del Eje SRAA y Canales ENaC
        function updateSRAASimulation() {
            const pamVal = hemoState.pam;
            const naclVal = hemoState.maculaNaCl;

            // La Renina se activa fuertemente cuando la PAM < 85 mmHg o el NaCl en mácula es bajo (<40%)
            const reninTrigger = (pamVal < 85) || (naclVal < 40);
            hemoState.reninActive = reninTrigger;

            // Nivel de Aldosterona inducida
            let aldoLevel = 20; // basal
            if (reninTrigger) {
                aldoLevel = Math.min(100, Math.round(20 + (85 - Math.min(85, pamVal)) * 1.8 + (50 - Math.min(50, naclVal)) * 0.8));
            } else if (pamVal > 120) {
                aldoLevel = 10; // supresión por hipervolemia / ANP
            }
            hemoState.aldosteroneLevel = aldoLevel;

            // Preservación de Canales ENaC por acción de SGK1
            // A mayor aldosterona -> mayor transcripción de SGK1 -> inhibe Nedd4-2 -> preserva canales ENaC apicales
            hemoState.enacPreservation = Math.round(30 + (aldoLevel * 0.65));

            // Actualizar interfaz UI
            const pamDisplay = document.getElementById('val-pam');
            const naclDisplay = document.getElementById('val-nacl');
            const aldoDisplay = document.getElementById('val-aldo');
            const enacDisplay = document.getElementById('val-enac');
            const naReabsDisplay = document.getElementById('val-na-reabs');
            const kExcrDisplay = document.getElementById('val-k-excr');

            if (pamDisplay) pamDisplay.textContent = `${pamVal} mmHg`;
            if (naclDisplay) naclDisplay.textContent = `${naclVal}%`;
            if (aldoDisplay) aldoDisplay.textContent = `${aldoLevel}%`;
            if (enacDisplay) enacDisplay.textContent = `${hemoState.enacPreservation}%`;

            // Tasa de reabsorción de Na+ y excreción de K+
            const naRate = (25 + (hemoState.enacPreservation * 0.75)).toFixed(1);
            const kRate = (10 + (hemoState.enacPreservation * 0.45)).toFixed(1);
            if (naReabsDisplay) naReabsDisplay.textContent = `${naRate} mmol/min`;
            if (kExcrDisplay) kExcrDisplay.textContent = `${kRate} mmol/min`;

            // Actualizar píldoras de la cascada SRAA
            const sraaRenin = document.getElementById('sraa-renin');
            const sraaAng1 = document.getElementById('sraa-ang1');
            const sraaAng2 = document.getElementById('sraa-ang2');
            const sraaAldo = document.getElementById('sraa-aldo');
            const sraaEnac = document.getElementById('sraa-enac');

            const sraaElements = [sraaRenin, sraaAng1, sraaAng2, sraaAldo, sraaEnac];
            if (reninTrigger) {
                sraaElements.forEach((el, index) => {
                    if (el) {
                        setTimeout(() => el.classList.add('sraa-active'), index * 150);
                    }
                });
            } else {
                sraaElements.forEach(el => {
                    if (el) el.classList.remove('sraa-active');
                });
            }

            // Actualizar micro-diagrama de canales ENaC apicales
            renderENaCCellDiagram();
        }

        // Renderizado SVG/Canvas de la célula principal y canales ENaC
        function renderENaCCellDiagram() {
            const container = document.getElementById('enac-cell-graphic-container');
            if (!container) return;

            const enacCount = Math.max(2, Math.round(hemoState.enacPreservation / 15));
            let enacPills = '';
            for (let i = 0; i < enacCount; i++) {
                enacPills += `
                    <div class="flex flex-col items-center justify-center p-2 rounded-xl bg-amber-400/20 border border-amber-500 shadow-sm animate-pulse">
                        <span class="material-symbols-outlined text-amber-500 text-lg">view_stream</span>
                        <span class="text-[10px] font-black text-amber-700 dark:text-amber-300">ENaC</span>
                        <span class="text-[9px] font-bold text-blue-600 dark:text-blue-400">Na⁺ ⬇</span>
                    </div>
                `;
            }

            container.innerHTML = `
                <div class="relative w-full p-4 rounded-2xl bg-white/40 dark:bg-slate-800/50 border border-white/60 dark:border-white/10">
                    <div class="flex justify-between items-center mb-3">
                        <div class="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Célula Principal (Túbulo Distal & Colector)</div>
                        <div class="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                            SGK1: ${hemoState.aldosteroneLevel > 40 ? 'Activo (Inhibe Nedd4-2)' : 'Basal'}
                        </div>
                    </div>
                    
                    <!-- Membrana Apical (Luminal) -->
                    <div class="mb-2 p-2 rounded-xl bg-blue-500/10 border-b-2 border-blue-400 text-center">
                        <span class="text-[11px] font-bold text-blue-700 dark:text-blue-300">LUMEN TUBULAR (Orina) - Potencial Transepitelial Negativo</span>
                    </div>

                    <!-- Canales Apicales ENaC y ROMK -->
                    <div class="grid grid-cols-4 sm:grid-cols-6 gap-2 my-3">
                        ${enacPills}
                        <div class="flex flex-col items-center justify-center p-2 rounded-xl bg-purple-400/20 border border-purple-500 shadow-sm">
                            <span class="material-symbols-outlined text-purple-500 text-lg">vertical_align_top</span>
                            <span class="text-[10px] font-black text-purple-700 dark:text-purple-300">ROMK</span>
                            <span class="text-[9px] font-bold text-purple-600 dark:text-purple-400">K⁺ ⬆ Excr</span>
                        </div>
                    </div>

                    <!-- Citoplasma y Efecto Bioquímico -->
                    <div class="text-[11px] text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-white/30">
                        <strong>Mecanismo Molecular:</strong> La Aldosterona se une a los receptores citosólicos MR estimulando la transcripción de <strong>SGK1</strong>. Esta quinasa fosforila a la ubiquitina-ligasa Nedd4-2, impidiendo la endocitosis y degradación lisosómica de los canales <strong>ENaC</strong>, preservando su densidad apical y maximizando la reabsorción de sodio.
                    </div>
                </div>
            `;
        }

        // Sliders Listeners
        const sliderPam = document.getElementById('slider-pam');
        const sliderNacl = document.getElementById('slider-nacl');

        if (sliderPam) {
            sliderPam.addEventListener('input', (e) => {
                hemoState.pam = parseInt(e.target.value) || 95;
                updateSRAASimulation();
            });
        }

        if (sliderNacl) {
            sliderNacl.addEventListener('input', (e) => {
                hemoState.maculaNaCl = parseInt(e.target.value) || 50;
                updateSRAASimulation();
            });
        }

        updateSRAASimulation();
    }

    // --------------------------------------------------------------------------
    // 3. MINI-JUEGO 1: LABORATORIO DE DIGESTIÓN (DRAG & DROP)
    // --------------------------------------------------------------------------
    function initDigestionGame() {
        const gameContainer = document.getElementById('digestion-game-container');
        if (!gameContainer) return;

        // Niveles / Misiones del Laboratorio
        const missions = [
            {
                id: 1,
                title: 'Misión 1: Cascada Proteolítica y Absorción Peptídica',
                objective: '1° Activa el tripsinógeno con la enzima del borde en cepillo. 2° Escinde las proteínas a dipéptidos. 3° Absórbelos por el transportador apical acoplado a protones.',
                steps: [
                    {
                        prompt: 'Arrastra la enzima maestra del borde en cepillo para activar el Tripsinógeno en Tripsina:',
                        correctId: 'enterocinasa',
                        targetLabel: 'Tripsinógeno pancreático inactivo',
                        successMsg: '¡Excelente! La Enterocinasa (Enteropeptidasa) escinde el hexapéptido terminal del tripsinógeno, liberando Tripsina activa.'
                    },
                    {
                        prompt: 'Arrastra la Tripsina sobre el bolo proteico para generar dipéptidos:',
                        correctId: 'tripsina',
                        targetLabel: 'Proteínas / Polipéptidos luminales',
                        successMsg: '¡Digestión lograda! La tripsina y endopeptidasas hidrolizan las cadenas polipeptídicas produciendo oligopéptidos y dipéptidos.'
                    },
                    {
                        prompt: 'Arrastra el dipéptido hacia su transportador apical específico:',
                        correctId: 'dipeptido',
                        targetLabel: 'Membrana apical del enterocito',
                        successMsg: '¡Absorción exitosa! El transportador PepT1 aprovecha el gradiente electroquímico entrante de H+ para captar dipéptidos con máxima eficiencia energética.'
                    }
                ],
                enzymes: [
                    { id: 'enterocinasa', name: 'Enterocinasa', icon: 'auto_fix_high', color: 'bg-emerald-500' },
                    { id: 'tripsina', name: 'Tripsina Activa', icon: 'content_cut', color: 'bg-indigo-500' },
                    { id: 'dipeptido', name: 'Dipéptido', icon: 'grain', color: 'bg-purple-500' },
                    { id: 'pept1', name: 'PepT1 (H⁺)', icon: 'door_front', color: 'bg-blue-500' },
                    { id: 'amilasa', name: 'Amilasa', icon: 'science', color: 'bg-amber-500' }
                ]
            },
            {
                id: 2,
                title: 'Misión 2: Asimilación de Glúcidos en el Ribete en Cepillo',
                objective: 'Hidroliza el almidón y transporta la glucosa libre contra gradiente.',
                steps: [
                    {
                        prompt: 'Arrastra la enzima pancreática para degradar el almidón a maltosa:',
                        correctId: 'amilasa',
                        targetLabel: 'Almidón luminal',
                        successMsg: '¡Exacto! La amilasa pancreática escinde enlaces alfa-1,4 produciendo maltosa, maltotriosa y dextrinas límite.'
                    },
                    {
                        prompt: 'Arrastra la disacaridasa del borde en cepillo para liberar glucosa pura:',
                        correctId: 'maltasa',
                        targetLabel: 'Maltosa luminal',
                        successMsg: '¡Perfecto! Las disacaridasas apicales (maltasa, sacarasa) finalizan la hidrólisis liberando glucosa y galactosa.'
                    },
                    {
                        prompt: 'Arrastra la glucosa hacia el cotransportador activo secundario dependiente de 2 Na+:',
                        correctId: 'glucosa',
                        targetLabel: 'Membrana apical enterocitaria',
                        successMsg: '¡Completado! El cotransportador SGLT-1 utiliza la energía del gradiente electroquímico de 2 iones Na+ para ingresar 1 molécula de glucosa al enterocito.'
                    }
                ],
                enzymes: [
                    { id: 'amilasa', name: 'Amilasa Pancreática', icon: 'science', color: 'bg-amber-500' },
                    { id: 'maltasa', name: 'Maltasa Apical', icon: 'grain', color: 'bg-emerald-500' },
                    { id: 'glucosa', name: 'D-Glucosa', icon: 'bubble_chart', color: 'bg-blue-500' },
                    { id: 'sglt1', name: 'SGLT-1 (2 Na⁺)', icon: 'door_front', color: 'bg-indigo-500' },
                    { id: 'lipasa', name: 'Lipasa', icon: 'opacity', color: 'bg-rose-500' }
                ]
            }
        ];

        let currentMissionIndex = 0;
        let currentStepIndex = 0;
        let selectedElementId = null;

        function loadMission() {
            const mission = missions[currentMissionIndex];
            const step = mission.steps[currentStepIndex];

            const titleEl = document.getElementById('digest-mission-title');
            const promptEl = document.getElementById('digest-step-prompt');
            const targetEl = document.getElementById('digest-drop-target');
            const feedbackEl = document.getElementById('digest-feedback');
            const enzymesBank = document.getElementById('digest-enzymes-bank');

            if (titleEl) titleEl.textContent = mission.title;
            if (promptEl) promptEl.textContent = step.prompt;
            if (targetEl) {
                targetEl.innerHTML = `
                    <span class="material-symbols-outlined text-4xl text-blue-500 mb-2">move_to_inbox</span>
                    <span class="font-bold text-slate-800 dark:text-slate-100">${step.targetLabel}</span>
                    <span class="text-xs text-slate-500 mt-1">Arrastra aquí o toca la molécula y luego este casillero</span>
                `;
                targetEl.className = 'digest-drop-zone p-6 rounded-3xl bg-white/30 dark:bg-slate-800/40 flex flex-col items-center justify-center text-center min-h-[160px] cursor-pointer shadow-inner';
            }
            if (feedbackEl) {
                feedbackEl.classList.add('hidden');
                feedbackEl.textContent = '';
            }

            // Renderizar banco de moléculas/enzimas
            if (enzymesBank) {
                enzymesBank.innerHTML = '';
                mission.enzymes.forEach(enz => {
                    const pill = document.createElement('div');
                    pill.className = `digest-source-pill p-3.5 px-5 rounded-2xl ${enz.color} text-white font-bold flex items-center gap-2 shadow-md hover:scale-105 active:scale-95`;
                    pill.setAttribute('draggable', 'true');
                    pill.setAttribute('data-enz-id', enz.id);
                    pill.innerHTML = `
                        <span class="material-symbols-outlined text-xl">${enz.icon}</span>
                        <span>${enz.name}</span>
                    `;

                    // Drag & Drop HTML5
                    pill.addEventListener('dragstart', (e) => {
                        e.dataTransfer.setData('text/plain', enz.id);
                        pill.classList.add('is-dragging');
                        selectedElementId = enz.id;
                    });
                    pill.addEventListener('dragend', () => {
                        pill.classList.remove('is-dragging');
                    });

                    // Clic para selección accesible en móviles
                    pill.addEventListener('click', () => {
                        document.querySelectorAll('.digest-source-pill').forEach(p => p.classList.remove('ring-4', 'ring-blue-400'));
                        pill.classList.add('ring-4', 'ring-blue-400');
                        selectedElementId = enz.id;
                    });

                    enzymesBank.appendChild(pill);
                });
            }

            // Configurar Zona de Caída (Drop Zone)
            if (targetEl) {
                targetEl.ondragover = (e) => {
                    e.preventDefault();
                    targetEl.classList.add('drag-over');
                };
                targetEl.ondragleave = () => {
                    targetEl.classList.remove('drag-over');
                };
                targetEl.ondrop = (e) => {
                    e.preventDefault();
                    targetEl.classList.remove('drag-over');
                    const droppedId = e.dataTransfer.getData('text/plain') || selectedElementId;
                    checkDropAction(droppedId);
                };
                targetEl.onclick = () => {
                    if (selectedElementId) {
                        checkDropAction(selectedElementId);
                    }
                };
            }
        }

        function checkDropAction(droppedId) {
            const mission = missions[currentMissionIndex];
            const step = mission.steps[currentStepIndex];
            const feedbackEl = document.getElementById('digest-feedback');
            const targetEl = document.getElementById('digest-drop-target');

            if (droppedId === step.correctId) {
                // Correcto
                if (targetEl) targetEl.classList.add('drop-success');
                if (feedbackEl) {
                    feedbackEl.className = 'mt-4 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold text-sm';
                    feedbackEl.textContent = step.successMsg;
                    feedbackEl.classList.remove('hidden');
                }

                currentStepIndex++;
                selectedElementId = null;

                setTimeout(() => {
                    if (currentStepIndex >= mission.steps.length) {
                        // Fin de la misión
                        currentStepIndex = 0;
                        currentMissionIndex = (currentMissionIndex + 1) % missions.length;
                        alert('¡Misión Completada con Éxito! Has dominado la biofísica enzimática del borde en cepillo.');
                    }
                    loadMission();
                }, 1800);

            } else {
                // Incorrecto
                if (feedbackEl) {
                    feedbackEl.className = 'mt-4 p-4 rounded-2xl bg-rose-500/15 border border-rose-500 text-rose-800 dark:text-rose-300 font-semibold text-sm animate-shake';
                    feedbackEl.textContent = 'Enzima o sustrato incorrecto para este paso fisiológico. Revisa el orden cronológico del tratado.';
                    feedbackEl.classList.remove('hidden');
                }
            }
        }

        loadMission();
    }

    // --------------------------------------------------------------------------
    // 4. MINI-JUEGO 2: BALANZA DEL EQUILIBRIO ÁCIDO-BASE (HENDERSON-HASSELBALCH)
    // --------------------------------------------------------------------------
    function initAcidBaseGame() {
        const sliderPco2 = document.getElementById('ab-slider-pco2');
        const sliderHco3 = document.getElementById('ab-slider-hco3');
        if (!sliderPco2 || !sliderHco3) return;

        // Escenarios clínicos de compensación homeostática
        const scenarios = [
            {
                name: 'Caso 1: Acidosis Respiratoria Aguda (EPOC / Depresión Narcótica)',
                initialPco2: 68,
                initialHco3: 24,
                targetHco3Min: 32,
                targetHco3Max: 36,
                explanation: 'La hipoventilación retiene CO2 (PCO2 68 mmHg). Para compensar y normalizar el pH a ~7.35, el riñón debe retener masivamente HCO3- y sintetizar nuevo búfer con excreción de NH4+ hasta alcanzar ~34 mEq/L.'
            },
            {
                name: 'Caso 2: Alcalosis Respiratoria (Crisis de Ansiedad / Hiperventilación)',
                initialPco2: 22,
                initialHco3: 24,
                targetHco3Min: 16,
                targetHco3Max: 19,
                explanation: 'El lavado masivo de CO2 (PCO2 22 mmHg) eleva el pH. La respuesta renal consiste en suspender la acidez titulable y excretar bicarbonato libre en la orina hasta ~18 mEq/L.'
            },
            {
                name: 'Caso 3: Acidosis Metabólica (Cetoacidosis Diabética / Diarrea Severa)',
                initialPco2: 40,
                initialHco3: 13,
                targetPco2Min: 22,
                targetPco2Max: 26,
                explanation: 'El consumo sistémico de bases desploma el HCO3- a 13 mEq/L. Los centros bulbares y quimiorreceptores activan el patrón de Kussmaul (hiperventilación) expulsando CO2 hasta ~24 mmHg.'
            },
            {
                name: 'Caso 4: Alcalosis Metabólica (Vómitos Incoercibles de HCl)',
                initialPco2: 40,
                initialHco3: 38,
                targetPco2Min: 48,
                targetPco2Max: 54,
                explanation: 'La pérdida de protones gástricos genera sobrecarga de base (HCO3- 38 mEq/L). La compensación respiratoria refleja induce hipoventilación para acumular CO2 hasta ~50 mmHg.'
            }
        ];

        let currentScenarioIndex = 0;

        // Cálculo de pH por la ecuación de Henderson-Hasselbalch
        // pH = 6.10 + log10([HCO3-] / (0.03 * PCO2))
        function calculatePH(pco2, hco3) {
            const ratio = hco3 / (0.03 * pco2);
            if (ratio <= 0) return 6.80;
            const ph = 6.10 + Math.log10(ratio);
            return Math.max(6.80, Math.min(7.80, ph));
        }

        function updateAcidBaseDisplay() {
            const pco2 = parseFloat(sliderPco2.value);
            const hco3 = parseFloat(sliderHco3.value);
            const ph = calculatePH(pco2, hco3);

            const phValEl = document.getElementById('ab-val-ph');
            const pco2ValEl = document.getElementById('ab-val-pco2');
            const hco3ValEl = document.getElementById('ab-val-hco3');
            const statusEl = document.getElementById('ab-status-badge');
            const needleEl = document.getElementById('ab-needle');

            if (pco2ValEl) pco2ValEl.textContent = `${pco2} mmHg`;
            if (hco3ValEl) hco3ValEl.textContent = `${hco3} mEq/L`;
            if (phValEl) phValEl.textContent = ph.toFixed(2);

            // Ángulo de la aguja: de -70° (pH 6.80) a +70° (pH 7.80)
            const angle = ((ph - 6.80) / (7.80 - 6.80)) * 140 - 70;
            if (needleEl) {
                needleEl.style.transform = `rotate(${angle}deg)`;
            }

            // Diagnóstico del Estado Homeostático
            if (statusEl) {
                if (ph < 7.35) {
                    statusEl.className = 'px-4 py-1.5 rounded-full font-bold text-xs bg-rose-500/20 text-rose-600 border border-rose-500';
                    statusEl.textContent = ph < 7.20 ? 'Acidosis Severa (Peligro Vital)' : 'Acidemia / Acidosis';
                } else if (ph > 7.45) {
                    statusEl.className = 'px-4 py-1.5 rounded-full font-bold text-xs bg-purple-500/20 text-purple-600 border border-purple-500';
                    statusEl.textContent = ph > 7.60 ? 'Alcalosis Severa (Tetania / Convulsiones)' : 'Alcalemia / Alcalosis';
                } else {
                    statusEl.className = 'px-4 py-1.5 rounded-full font-bold text-xs bg-emerald-500/20 text-emerald-600 border border-emerald-500 shadow-sm animate-pulse';
                    statusEl.textContent = 'Homeostasis Estable (pH Fisiológico 7.35 - 7.45)';
                }
            }
        }

        sliderPco2.addEventListener('input', updateAcidBaseDisplay);
        sliderHco3.addEventListener('input', updateAcidBaseDisplay);

        // Selector de Desafíos Clínicos
        window.loadAcidBaseScenario = function (idx) {
            currentScenarioIndex = idx;
            const sc = scenarios[idx];
            sliderPco2.value = sc.initialPco2;
            sliderHco3.value = sc.initialHco3;
            updateAcidBaseDisplay();

            const scTitleEl = document.getElementById('ab-scenario-title');
            const scDescEl = document.getElementById('ab-scenario-desc');
            const scFeedbackEl = document.getElementById('ab-scenario-feedback');

            if (scTitleEl) scTitleEl.textContent = sc.name;
            if (scDescEl) scDescEl.textContent = `Ajusta los reguladores pulmonar (PCO2) y renal (HCO3-) para devolver el pH a la zona segura (7.35 - 7.45).`;
            if (scFeedbackEl) scFeedbackEl.classList.add('hidden');
        };

        window.checkAcidBaseCompensation = function () {
            const pco2 = parseFloat(sliderPco2.value);
            const hco3 = parseFloat(sliderHco3.value);
            const ph = calculatePH(pco2, hco3);
            const sc = scenarios[currentScenarioIndex];
            const scFeedbackEl = document.getElementById('ab-scenario-feedback');

            if (!scFeedbackEl) return;
            scFeedbackEl.classList.remove('hidden');

            if (ph >= 7.35 && ph <= 7.45) {
                scFeedbackEl.className = 'mt-4 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold text-sm';
                scFeedbackEl.innerHTML = `¡Compensación Exitosa! pH alcanzado: ${ph.toFixed(2)}.<br><span class="font-normal mt-1 block">${sc.explanation}</span>`;
            } else {
                scFeedbackEl.className = 'mt-4 p-4 rounded-2xl bg-amber-500/20 border border-amber-500 text-amber-800 dark:text-amber-300 font-bold text-sm';
                scFeedbackEl.innerHTML = `El pH actual es ${ph.toFixed(2)} (fuera del rango normal 7.35 - 7.45). Sigue ajustando el parámetro compensador opuesto.`;
            }
        };

        loadAcidBaseScenario(0);
    }

    // --------------------------------------------------------------------------
    // 5. FLASHCARDS CON ANIMACIONES 3D FLUIDAS Y AUDIO-CARD
    // --------------------------------------------------------------------------
    function initFlashcardsAndAudio() {
        // APPLE IPHONE MULTITASKING / APP SWITCHER STACK CONTROLLER
        const deck = document.getElementById('apple-multitask-deck'); // 1. Subimos la declaración del deck
    
        // 2. Cambiamos 'document' por 'deck' para aislar solo las tarjetas de fisiología
        const cardContainers = deck ? deck.querySelectorAll('.apple-card-container') : []; 
        
        const prevBtn = document.getElementById('apple-stack-prev');
        const nextBtn = document.getElementById('apple-stack-next');
        const flipActiveBtn = document.getElementById('apple-stack-flip-active');
        const counterEl = document.getElementById('apple-stack-counter');
        const dockContainer = document.getElementById('apple-stack-dock');

        if (cardContainers.length && deck) {
            let currentIndex = 0;
            const totalCards = cardContainers.length;

            // Construir puntos / pildoras del Dock inferior
            if (dockContainer) {
                dockContainer.innerHTML = '';
                for (let i = 0; i < totalCards; i++) {
                    const dot = document.createElement('div');
                    dot.className = `apple-dock-pill ${i === 0 ? 'active' : ''}`;
                    dot.setAttribute('data-index', i);
                    dot.setAttribute('title', `Tarjeta ${i + 1}`);
                    dot.addEventListener('click', (e) => {
                        e.stopPropagation();
                        goToCard(i);
                    });
                    dockContainer.appendChild(dot);
                }
            }

            function updateCardStack() {
                const isMobile = window.innerWidth < 768;
                const spacingX = isMobile ? 120 : 190;
                const baseZ = -70;

                cardContainers.forEach((card, idx) => {
                    const offset = idx - currentIndex;
                    const absOffset = Math.abs(offset);

                    let tx = 0;
                    let tz = 0;
                    let ry = 0;
                    let scale = 1;
                    let opacity = 1;
                    let zIndex = 30 - absOffset;
                    let blurPx = 0;

                    if (offset === 0) {
                        // Tarjeta Activa al Frente
                        tx = 0;
                        tz = 0;
                        ry = 0;
                        scale = 1;
                        opacity = 1;
                        zIndex = 35;
                        blurPx = 0;
                        card.style.pointerEvents = 'auto';
                    } else if (offset > 0) {
                        // Tarjetas apiladas a la Derecha
                        if (offset === 1) {
                            tx = spacingX;
                            tz = baseZ;
                            ry = -9;
                            scale = 0.90;
                            opacity = 0.88;
                        } else if (offset === 2) {
                            tx = spacingX * 1.75;
                            tz = baseZ * 2;
                            ry = -14;
                            scale = 0.80;
                            opacity = 0.60;
                            blurPx = 0.5;
                        } else {
                            tx = spacingX * 1.75 + (offset - 2) * (isMobile ? 35 : 55);
                            tz = baseZ * 2 + (offset - 2) * -50;
                            ry = -18;
                            scale = Math.max(0.65, 0.80 - (offset - 2) * 0.05);
                            opacity = Math.max(0, 0.35 - (offset - 3) * 0.12);
                            blurPx = 1.5;
                        }
                        card.style.pointerEvents = 'auto';
                    } else {
                        // Tarjetas apiladas a la Izquierda
                        const leftOffset = Math.abs(offset);
                        if (leftOffset === 1) {
                            tx = -spacingX;
                            tz = baseZ;
                            ry = 9;
                            scale = 0.90;
                            opacity = 0.88;
                        } else if (leftOffset === 2) {
                            tx = -spacingX * 1.75;
                            tz = baseZ * 2;
                            ry = 14;
                            scale = 0.80;
                            opacity = 0.60;
                            blurPx = 0.5;
                        } else {
                            tx = -spacingX * 1.75 - (leftOffset - 2) * (isMobile ? 35 : 55);
                            tz = baseZ * 2 + (leftOffset - 2) * -50;
                            ry = 18;
                            scale = Math.max(0.65, 0.80 - (leftOffset - 2) * 0.05);
                            opacity = Math.max(0, 0.35 - (leftOffset - 3) * 0.12);
                            blurPx = 1.5;
                        }
                        card.style.pointerEvents = 'auto';
                    }

                    card.style.transform = `translateX(${tx}px) translateZ(${tz}px) scale(${scale}) rotateY(${ry}deg)`;
                    card.style.opacity = opacity;
                    card.style.zIndex = zIndex;
                    card.style.filter = blurPx > 0 ? `blur(${blurPx}px)` : 'none';
                });

                // Actualizar contador y docks
                if (counterEl) {
                    counterEl.textContent = `${currentIndex + 1} de ${totalCards}`;
                }

                const dots = document.querySelectorAll('.apple-dock-pill');
                dots.forEach((dot, idx) => {
                    if (idx === currentIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }

            function goToCard(idx) {
                if (idx < 0) idx = 0;
                if (idx >= totalCards) idx = totalCards - 1;
                currentIndex = idx;
                updateCardStack();
            }

            function flipCard(cardEl) {
                if (!cardEl) return;
                const inner = cardEl.querySelector('.apple-card-inner');
                if (inner) {
                    inner.classList.toggle('is-flipped');
                }
            }

            // Clic en tarjetas
            cardContainers.forEach((card, idx) => {
                card.addEventListener('click', (e) => {
                    if (e.target.closest('.apple-flip-pill') || e.target.closest('.flip-trigger')) {
                        flipCard(card);
                        return;
                    }

                    if (idx === currentIndex) {
                        // Al hacer clic en la frontal activa, gira 180°
                        flipCard(card);
                    } else {
                        // Al hacer clic en una tarjeta desplazada, pasa al frente
                        goToCard(idx);
                    }
                });
            });

            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    goToCard(currentIndex - 1);
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    goToCard(currentIndex + 1);
                });
            }

            if (flipActiveBtn) {
                flipActiveBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    flipCard(cardContainers[currentIndex]);
                });
            }

            // Soporte de navegación por teclado (flechas)
            window.addEventListener('keydown', (e) => {
                const flashcardsTab = document.getElementById('tab-flashcards');
                if (!flashcardsTab || flashcardsTab.classList.contains('hidden')) return;

                if (e.key === 'ArrowLeft') {
                    goToCard(currentIndex - 1);
                } else if (e.key === 'ArrowRight') {
                    goToCard(currentIndex + 1);
                } else if (e.key === ' ' || e.key === 'Enter') {
                    flipCard(cardContainers[currentIndex]);
                }
            });

            // Gestos táctiles de deslizamiento (Swipe) estilo iOS
            let startX = 0;
            let isDragging = false;

            deck.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
            }, { passive: true });

            deck.addEventListener('touchend', (e) => {
                if (!isDragging) return;
                const endX = e.changedTouches[0].clientX;
                const diffX = endX - startX;
                if (diffX > 40) {
                    goToCard(currentIndex - 1);
                } else if (diffX < -40) {
                    goToCard(currentIndex + 1);
                }
                isDragging = false;
            }, { passive: true });

            deck.addEventListener('mousedown', (e) => {
                startX = e.clientX;
                isDragging = true;
            });

            window.addEventListener('mouseup', (e) => {
                if (!isDragging) return;
                const diffX = e.clientX - startX;
                if (diffX > 45) {
                    goToCard(currentIndex - 1);
                } else if (diffX < -45) {
                    goToCard(currentIndex + 1);
                }
                isDragging = false;
            });

            window.addEventListener('resize', updateCardStack);
            updateCardStack();
        }

        // AUDIO-CARD CONCEPTUAL (Diseño idéntico a audio-lottie-card)
        const lottieContainerFisio = document.getElementById('lottie-sound-wave-fisio');
        const audioCardFisio = document.getElementById('audio-lottie-card-fisio');

        if (lottieContainerFisio && audioCardFisio && typeof lottie !== 'undefined') {
            const soundWaveAnimFisio = lottie.loadAnimation({
                container: lottieContainerFisio,
                renderer: 'svg',
                loop: true,
                autoplay: false,
                path: 'ayuda_inteligente.json'
            });

            let isPlayingFisio = false;
            const cardTextFisio = audioCardFisio.querySelector('span');
            let speechUtterance = null;

            // Narración fisiológica con Web Speech API
            const narrativeText = "Bienvenido a la cápsula de Fisiología Médica. La homeostasis corporal integra gradientes electroquímicos, el ciclo cardíaco coordinado con el diagrama de Wiggers, el eje renina angiotensina aldosterona en la nefrona y la balanza de Henderson Hasselbalch para sostener el pH sanguíneo estable.";

            audioCardFisio.addEventListener('click', () => {
                if (isPlayingFisio) {
                    if (window.speechSynthesis) window.speechSynthesis.cancel();
                    soundWaveAnimFisio.pause();
                    document.body.classList.remove('is-speaking');
                    audioCardFisio.classList.remove('is-playing-audio');
                    if (cardTextFisio) cardTextFisio.textContent = "Presiona para escucharme";
                    isPlayingFisio = false;
                } else {
                    soundWaveAnimFisio.play();
                    document.body.classList.add('is-speaking');
                    audioCardFisio.classList.add('is-playing-audio');
                    if (cardTextFisio) cardTextFisio.textContent = "Escuchando cápsula...";
                    isPlayingFisio = true;

                    if ('speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                        speechUtterance = new SpeechSynthesisUtterance(narrativeText);
                        speechUtterance.lang = 'es-ES';
                        speechUtterance.rate = 1.0;
                        speechUtterance.pitch = 1.0;

                        speechUtterance.onend = () => {
                            soundWaveAnimFisio.stop();
                            document.body.classList.remove('is-speaking');
                            audioCardFisio.classList.remove('is-playing-audio');
                            if (cardTextFisio) cardTextFisio.textContent = "Presiona para escucharme";
                            isPlayingFisio = false;
                        };

                        speechUtterance.onerror = () => {
                            soundWaveAnimFisio.stop();
                            document.body.classList.remove('is-speaking');
                            audioCardFisio.classList.remove('is-playing-audio');
                            if (cardTextFisio) cardTextFisio.textContent = "Presiona para escucharme";
                            isPlayingFisio = false;
                        };

                        window.speechSynthesis.speak(speechUtterance);
                    } else {
                        // Fallback temporizado si el navegador no tiene síntesis
                        setTimeout(() => {
                            soundWaveAnimFisio.stop();
                            document.body.classList.remove('is-speaking');
                            audioCardFisio.classList.remove('is-playing-audio');
                            if (cardTextFisio) cardTextFisio.textContent = "Presiona para escucharme";
                            isPlayingFisio = false;
                        }, 9000);
                    }
                }
            });
        }
    }

    // --------------------------------------------------------------------------
    // 6. CASOS CLÍNICOS DE RESOLUCIÓN SECUENCIAL (PANEL DE DIAGNÓSTICO)
    // --------------------------------------------------------------------------
    function initClinicalCases() {
        const cases = [
            {
                id: 'caso-b12',
                title: 'Caso Clínico 1: Síndrome Malabsortivo y Anemia Megaloblástica',
                patientHistory: 'Hombre de 58 años intervenido hace 3 años de gastrectomía total. Acude por astenia severa, parestesias simétricas en guante y calcetín en extremidades inferiores (afectación de cordones posteriores), glositis dolorosa con lengua depapilada. En el laboratorio: Hemoglobina 8.2 g/dL, VCM 118 fL (macrocitosis), reticulocitos bajos, frotis con neutrófilos polisegmentados y niveles séricos de cobalamina profundamente disminuidos.',
                steps: [
                    {
                        stepNumber: 1,
                        question: 'Paso 1: ¿Cuál es la estirpe celular de la mucosa gástrica cuya ausencia o destrucción inmunológica origina este cuadro clínico?',
                        options: [
                            { text: 'A) Células Principales (zimógenas)', correct: false, explanation: 'Las células principales secretan pepsinógeno gástrico, no factor intrínseco.' },
                            { text: 'B) Células Parietales u Oxínticas', correct: true, explanation: '¡Correcto! Las células parietales u oxínticas del cuerpo gástrico producen ácido clorhídrico y la glucoproteína imprescindible: el Factor Intrínseco (FI).' },
                            { text: 'C) Células G del antro gástrico', correct: false, explanation: 'Las células G producen gastrina, que modula la secreción ácida pero no une cobalamina.' },
                            { text: 'D) Células Enterocromafines (ECL)', correct: false, explanation: 'Las células ECL liberan histamina para receptores H2.' }
                        ]
                    },
                    {
                        stepNumber: 2,
                        question: 'Paso 2: En condiciones normales, ¿cuál es la interacción molecular obligatoria que permite a la Vitamina B12 resistir el tránsito gástrico y duodenal?',
                        options: [
                            { text: 'A) Se une a la albúmina sérica en la saliva', correct: false, explanation: 'La albúmina no participa en el tránsito luminal digestivo.' },
                            { text: 'B) En el estómago se une preferentemente a la proteína R (haptocorrina); en el duodeno, las proteasas pancreáticas degradan la proteína R permitiendo que la B12 se ensamble firmemente con el Factor Intrínseco', correct: true, explanation: '¡Exacto! La alta acidez favorece la unión con la proteína R salival/gástrica. En el duodeno alcalino, la tripsina escinde la proteína R y la B12 pasa al Factor Intrínseco (FI).' },
                            { text: 'C) La B12 viaja libre sin proteínas protectoras', correct: false, explanation: 'La B12 libre sería destruida por el medio ácido y las proteasas luminales.' },
                            { text: 'D) Se esterifica con sales biliares en micelas', correct: false, explanation: 'Las micelas son exclusivas de la digestión y absorción de lípidos.' }
                        ]
                    },
                    {
                        stepNumber: 3,
                        question: 'Paso 3: Ante la carencia absoluta de Factor Intrínseco, ¿dónde y mediante qué complejo de membrana queda bloqueada la endocitosis del nutriente?',
                        options: [
                            { text: 'A) Cotransportador SGLT-1 en el yeyuno proximal', correct: false, explanation: 'SGLT-1 es transportador de glucosa y galactosa.' },
                            { text: 'B) Receptor GLUT5 en el borde en cepillo duodenal', correct: false, explanation: 'GLUT5 transporta fructosa por difusión facilitada.' },
                            { text: 'C) Endocitosis apical por el complejo CUBAM (cubilina + amnionless) en el Íleon Terminal', correct: true, explanation: '¡Completamente acertado! El dímero de cubilina y amnionless (CUBAM) en el íleon terminal reconoce selectivamente el complejo tridimensional B12-FI. Sin FI, no ocurre endocitosis mediada por receptor.' },
                            { text: 'D) Transportador de sales biliares ASBT en el colon', correct: false, explanation: 'ASBT reabsorbe sales biliares en la circulación enterohepática, no B12.' }
                        ]
                    },
                    {
                        stepNumber: 4,
                        question: 'Paso 4: Basado en el bloqueo del transporte mediado por receptor CUBAM, ¿cuál es la terapéutica fisiológica correctiva adecuada?',
                        options: [
                            { text: 'A) Ingesta oral de comprimidos multivitamínicos estándar a bajas dosis', correct: false, explanation: 'Las dosis orales fisiológicas requieren el eje FI-CUBAM y se perderán en las heces.' },
                            { text: 'B) Vitamina B12 parenteral intramuscular o dosis orales masivas pasivas (>1000 µg/día) independientes del receptor', correct: true, explanation: '¡Diagnóstico y Conducta Perfecta! La administración intramuscular evita el tubo digestivo por completo. Alternativamente, dosis masivas orales logran un 1% de absorción pasiva paracelular independiente de FI.' },
                            { text: 'C) Dieta rica en proteínas sin suplementos', correct: false, explanation: 'Sin células parietales ni FI, no se asimilará la cobalamina de la dieta.' }
                        ]
                    }
                ]
            },
            {
                id: 'caso-11bhsd2',
                title: 'Caso Clínico 2: Síndrome de Exceso Aparente de Mineralocorticoides',
                patientHistory: 'Adolescente de 15 años con hipertensión severa (170/110 mmHg), hipopotasemia severa (K+ 2.4 mEq/L) y alcalosis metabólica. El estudio hormonal reporta aldosterona plasmática indetectable y renina suprimida. Se descarta estenosis renal y feocromocitoma.',
                steps: [
                    {
                        stepNumber: 1,
                        question: 'Paso 1: ¿Por qué una alteración enzimática puede provocar activación mineralocorticoide masiva sin aldosterona circulante?',
                        options: [
                            { text: 'A) Los receptores mineralocorticoides (MR) tienen una afinidad molecular idéntica tanto por la aldosterona como por el cortisol', correct: true, explanation: '¡Correcto! El receptor MR tiene idéntica afinidad por aldosterona y cortisol, y el cortisol circula en concentraciones 100 a 1000 veces mayores.' },
                            { text: 'B) El cortisol bloquea permanentemente a los canales ENaC', correct: false, explanation: 'Al contrario, el cortisol activaría la reabsorción de sodio si estimula el receptor MR.' }
                        ]
                    },
                    {
                        stepNumber: 2,
                        question: 'Paso 2: ¿Cuál es la enzima protectora pre-receptora que normalmente inactiva el cortisol en la célula principal renal?',
                        options: [
                            { text: 'A) 11β-hidroxiesteroide deshidrogenasa tipo 2 (11β-HSD2)', correct: true, explanation: '¡Excelente! La 11β-HSD2 oxida ávidamente el cortisol a cortisona inactiva, asegurando que solo la aldosterona active el receptor MR. Su mutación o inhibición por regaliz causa el síndrome.' },
                            { text: 'B) 21-hidroxilasa (CYP21A2)', correct: false, explanation: 'La 21-hidroxilasa actúa en la esteroidogénesis adrenal, no como filtro en el túbulo renal.' }
                        ]
                    }
                ]
            }
        ];

        let activeCaseIndex = 0;
        let activeStepIndex = 0;

        function loadCaseStep() {
            const currentCase = cases[activeCaseIndex];
            const step = currentCase.steps[activeStepIndex];

            const titleEl = document.getElementById('case-title');
            const historyEl = document.getElementById('case-history');
            const questionEl = document.getElementById('case-question');
            const optionsContainer = document.getElementById('case-options-container');
            const feedbackEl = document.getElementById('case-feedback');
            const nextBtn = document.getElementById('case-next-btn');
            const progressContainer = document.getElementById('case-step-progress');

            if (titleEl) titleEl.textContent = currentCase.title;
            if (historyEl) historyEl.textContent = currentCase.patientHistory;
            if (questionEl) questionEl.textContent = step.question;
            if (feedbackEl) {
                feedbackEl.classList.add('hidden');
                feedbackEl.textContent = '';
            }
            if (nextBtn) nextBtn.classList.add('hidden');

            // Actualizar indicadores de pasos
            if (progressContainer) {
                progressContainer.innerHTML = '';
                currentCase.steps.forEach((s, idx) => {
                    const bullet = document.createElement('div');
                    bullet.className = `case-step-bullet ${idx < activeStepIndex ? 'completed' : (idx === activeStepIndex ? 'active' : 'pending')}`;
                    bullet.textContent = idx + 1;
                    progressContainer.appendChild(bullet);
                });
            }

            // Opciones de respuesta
            if (optionsContainer) {
                optionsContainer.innerHTML = '';
                step.options.forEach((opt, optIdx) => {
                    const btn = document.createElement('button');
                    btn.className = 'diag-option-btn w-full p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 text-left font-medium text-slate-800 dark:text-slate-100 flex items-start gap-3 shadow-sm';
                    btn.innerHTML = `
                        <span class="material-symbols-outlined text-purple-600 mt-0.5 text-lg">help</span>
                        <span>${opt.text}</span>
                    `;

                    btn.addEventListener('click', () => {
                        // Deshabilitar botones para evitar clics múltiples
                        optionsContainer.querySelectorAll('button').forEach(b => b.disabled = true);

                        if (opt.correct) {
                            btn.classList.add('opt-correct');
                            btn.querySelector('.material-symbols-outlined').textContent = 'check_circle';
                            feedbackEl.className = 'mt-4 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold text-sm';
                            feedbackEl.innerHTML = opt.explanation;
                            feedbackEl.classList.remove('hidden');

                            if (nextBtn) {
                                nextBtn.classList.remove('hidden');
                                nextBtn.textContent = (activeStepIndex + 1 < currentCase.steps.length) ? 'Avanzar al Siguiente Paso' : '¡Caso Resuelto con Éxito!';
                            }
                        } else {
                            btn.classList.add('opt-wrong');
                            btn.querySelector('.material-symbols-outlined').textContent = 'cancel';
                            feedbackEl.className = 'mt-4 p-4 rounded-2xl bg-rose-500/15 border border-rose-500 text-rose-800 dark:text-rose-300 font-semibold text-sm';
                            feedbackEl.innerHTML = `<strong>Respuesta incorrecta:</strong> ${opt.explanation}`;
                            feedbackEl.classList.remove('hidden');

                            // Permitir reintentar
                            setTimeout(() => {
                                optionsContainer.querySelectorAll('button').forEach(b => b.disabled = false);
                            }, 1200);
                        }
                    });

                    optionsContainer.appendChild(btn);
                });
            }
        }

        const nextBtn = document.getElementById('case-next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const currentCase = cases[activeCaseIndex];
                if (activeStepIndex + 1 < currentCase.steps.length) {
                    activeStepIndex++;
                    loadCaseStep();
                } else {
                    // Pasar al siguiente caso clínico
                    activeCaseIndex = (activeCaseIndex + 1) % cases.length;
                    activeStepIndex = 0;
                    alert('¡Has completado con maestría la resolución del caso clínico!');
                    loadCaseStep();
                }
            });
        }

        window.selectClinicalCase = function (caseIdx) {
            activeCaseIndex = caseIdx;
            activeStepIndex = 0;
            loadCaseStep();
        };

        loadCaseStep();
    }

    // --------------------------------------------------------------------------
    // INICIALIZACIÓN GLOBAL CUANDO EL DOM ESTÉ LISTO
    // --------------------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', () => {
        initFisioTabs();
        initCardiacSimulator();
        initNephronNavigator();
        initDigestionGame();
        initAcidBaseGame();
        initFlashcardsAndAudio();
        initClinicalCases();
    });

})();
