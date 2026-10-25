
(function () {
    'use strict';

    // --------------------------------------------------------------------------
    // 1. PESTAÑAS PRINCIPALES (BENTO-TABS)
    // --------------------------------------------------------------------------
    function initPsicoTabs() {
        const tabBtns = document.querySelectorAll('.psico-tab-btn');
        const tabPanels = document.querySelectorAll('.psico-tab-panel');

        if (!tabBtns.length) return;

        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = btn.getAttribute('data-psico-tab');

                tabBtns.forEach(b => {
                    b.classList.remove('active');
                    b.classList.remove('bg-[var(--background-color)]');
                });
                btn.classList.add('active');

                tabPanels.forEach(p => {
                    p.classList.add('hidden');
                    p.classList.remove('block');
                });

                const targetPanel = document.getElementById(targetId);
                if (targetPanel) {
                    targetPanel.classList.remove('hidden');
                    targetPanel.classList.add('block');
                }

                // Si se entra a flashcards o minijuegos, disparar resize/refresco
                if (targetId === 'tab-psico-flashcards' && typeof updatePsicoStack === 'function') {
                    updatePsicoStack();
                }
            });
        });
    }

    // --------------------------------------------------------------------------
    // 2. APUNTES: ACORDEÓN Y MODELO TCT vs TRI
    // --------------------------------------------------------------------------
    function initPsicoNotes() {
        const accordions = document.querySelectorAll('.psico-accordion-header');
        accordions.forEach(header => {
            header.addEventListener('click', () => {
                const item = header.closest('.psico-accordion-item');
                if (!item) return;
                const wasActive = item.classList.contains('active');
                
                // Opción: cerrar otros o permitir múltiples. Permitir múltiples para lectura cómoda
                item.classList.toggle('active', !wasActive);
            });
        });

        // Simulador comparativo de Curva de Información / Error SEM
        const sliderTheta = document.getElementById('slider-psico-theta');
        const valTheta = document.getElementById('val-psico-theta');
        const tctSemVal = document.getElementById('tct-sem-val');
        const triInfoVal = document.getElementById('tri-info-val');
        const triErrorVal = document.getElementById('tri-error-val');
        const triIndicator = document.getElementById('tri-dynamic-indicator');

        if (sliderTheta && valTheta) {
            sliderTheta.addEventListener('input', (e) => {
                const theta = parseFloat(e.target.value);
                valTheta.textContent = theta.toFixed(1);

                // En TCT, el SEM es constante para cualquier nivel de habilidad
                if (tctSemVal) tctSemVal.textContent = '± 3.82 (Estático)';

                // En TRI, la información depende de la distancia al parámetro b (dificultad ~ 0)
                // Función campana de información I(theta) = a^2 * P * Q
                const diff = theta - 0.0; // item centrado en b=0
                const p = 1.0 / (1.0 + Math.exp(-1.5 * diff));
                const q = 1.0 - p;
                const info = (2.25 * p * q).toFixed(2);
                const localSem = (1.0 / Math.sqrt(Math.max(0.1, 2.25 * p * q))).toFixed(2);

                if (triInfoVal) triInfoVal.textContent = `${info} nits`;
                if (triErrorVal) triErrorVal.textContent = `± ${localSem} (Local)`;

                if (triIndicator) {
                    const pct = Math.min(100, Math.max(10, (info / 0.56) * 100));
                    triIndicator.style.width = `${pct}%`;
                    if (pct > 75) {
                        triIndicator.className = 'h-2.5 rounded-full bg-emerald-500 transition-all';
                    } else if (pct > 40) {
                        triIndicator.className = 'h-2.5 rounded-full bg-amber-500 transition-all';
                    } else {
                        triIndicator.className = 'h-2.5 rounded-full bg-rose-500 transition-all';
                    }
                }
            });
        }
    }

    // --------------------------------------------------------------------------
    // 3. FLASHCARDS 3D APILADAS (APPLE MULTITASKING DECK)
    // --------------------------------------------------------------------------
    let updatePsicoStack = null;

    function initPsicoFlashcards() {
        const deck = document.getElementById('psico-multitask-deck');
        if (!deck) return;

        const cardContainers = deck.querySelectorAll('.apple-card-container');
        const prevBtn = document.getElementById('psico-stack-prev');
        const nextBtn = document.getElementById('psico-stack-next');
        const counterEl = document.getElementById('psico-stack-counter');
        const dockContainer = document.getElementById('psico-stack-dock');

        if (!cardContainers.length) return;

        let currentIndex = 0;
        const totalCards = cardContainers.length;

        // Construir píldoras del Dock inferior
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

        updatePsicoStack = function () {
            const isMobile = window.innerWidth < 768;
            const spacingX = isMobile ? 120 : 190;
            const baseZ = -70;

            cardContainers.forEach((card, idx) => {
                const offset = idx - currentIndex;
                const absOffset = Math.abs(offset);

                let tx = 0, tz = 0, ry = 0, scale = 1, opacity = 1, zIndex = 30 - absOffset, blurPx = 0;

                if (offset === 0) {
                    tx = 0; tz = 0; ry = 0; scale = 1; opacity = 1; zIndex = 35; blurPx = 0;
                    card.style.pointerEvents = 'auto';
                } else if (offset > 0) {
                    if (offset === 1) {
                        tx = spacingX; tz = baseZ; ry = -9; scale = 0.90; opacity = 0.88;
                    } else if (offset === 2) {
                        tx = spacingX * 1.75; tz = baseZ * 2; ry = -14; scale = 0.80; opacity = 0.60; blurPx = 0.5;
                    } else {
                        tx = spacingX * 1.75 + (offset - 2) * (isMobile ? 35 : 55);
                        tz = baseZ * 2 + (offset - 2) * -50; ry = -18;
                        scale = Math.max(0.65, 0.80 - (offset - 2) * 0.05);
                        opacity = Math.max(0, 0.35 - (offset - 3) * 0.12);
                        blurPx = 1.5;
                    }
                    card.style.pointerEvents = 'auto';
                } else {
                    const leftOffset = Math.abs(offset);
                    if (leftOffset === 1) {
                        tx = -spacingX; tz = baseZ; ry = 9; scale = 0.90; opacity = 0.88;
                    } else if (leftOffset === 2) {
                        tx = -spacingX * 1.75; tz = baseZ * 2; ry = 14; scale = 0.80; opacity = 0.60; blurPx = 0.5;
                    } else {
                        tx = -spacingX * 1.75 - (leftOffset - 2) * (isMobile ? 35 : 55);
                        tz = baseZ * 2 + (leftOffset - 2) * -50; ry = 18;
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

            if (counterEl) {
                counterEl.textContent = `${currentIndex + 1} de ${totalCards}`;
            }

            const dots = dockContainer ? dockContainer.querySelectorAll('.apple-dock-pill') : [];
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });
        };

        function goToCard(idx) {
            if (idx < 0) idx = 0;
            if (idx >= totalCards) idx = totalCards - 1;
            currentIndex = idx;
            updatePsicoStack();
        }

        function flipCard(cardEl) {
            if (!cardEl) return;
            const inner = cardEl.querySelector('.apple-card-inner');
            if (inner) {
                inner.classList.toggle('is-flipped');
            }
        }

        // Eventos en tarjetas
        cardContainers.forEach((card, idx) => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.apple-flip-pill') || e.target.closest('.flip-trigger')) {
                    flipCard(card);
                    return;
                }
                if (idx === currentIndex) {
                    flipCard(card);
                } else {
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

        // Swipe Gestures
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
            if (diffX > 40) goToCard(currentIndex - 1);
            else if (diffX < -40) goToCard(currentIndex + 1);
            isDragging = false;
        }, { passive: true });

        deck.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            isDragging = true;
        });

        window.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            const diffX = e.clientX - startX;
            if (diffX > 45) goToCard(currentIndex - 1);
            else if (diffX < -45) goToCard(currentIndex + 1);
            isDragging = false;
        });

        window.addEventListener('resize', updatePsicoStack);
        updatePsicoStack();
    }

    // --------------------------------------------------------------------------
    // 4. AUDIO-CARD: REPRODUCTOR DE NOTA DE VOZ (38 SEGUNDOS)
    // --------------------------------------------------------------------------
    function initPsicoAudio() {
        const audioCard = document.getElementById('audio-lottie-card-psico');
        const lottieContainer = document.getElementById('lottie-sound-wave-psico');
        const playBtn = document.getElementById('psico-audio-play-btn');
        const playIcon = document.getElementById('psico-audio-play-icon');
        const timeDisplay = document.getElementById('psico-audio-time');
        const progressBar = document.getElementById('psico-audio-progress');
        const speedBtn = document.getElementById('psico-audio-speed');
        const transcriptToggle = document.getElementById('psico-transcript-toggle');
        const transcriptText = document.getElementById('psico-transcript-text');

        let isPlaying = false;
        let currentTime = 0;
        const totalDuration = 38; // Duración exacta de lectura del texto según guion
        let playbackRate = 1.0;
        let timerInterval = null;
        let speechUtterance = null;

        const narrativeText = "Imagina enfrentarte a un paciente con pérdida de memoria o impulsividad severa. La lesión en su cerebro es estructural, pero sus procesos cognitivos son invisibles. Aquí es donde la psicometría clínica y la neurociencia cambian las reglas del juego. A través de instrumentos calibrados milimétricamente como el WAIS-IV o el NEUROPSI, logramos diseccionar funciones latentes, aislar el error estadístico con fórmulas logísticas avanzadas y medir con exactitud qué área del lóbulo frontal ha fallado. La medición psicológica no es encasillar mentes; es traducir el caos del sufrimiento humano a datos objetivos y fiables para estructurar la rehabilitación perfecta y transformar la intervención clínica.";

        // Cargar Lottie si está disponible
        let lottieAnim = null;
        if (lottieContainer && typeof lottie !== 'undefined') {
            try {
                lottieAnim = lottie.loadAnimation({
                    container: lottieContainer,
                    renderer: 'svg',
                    loop: true,
                    autoplay: false,
                    path: 'ayuda_inteligente.json'
                });
            } catch (err) {
                console.warn('Lottie no cargó animación de ayuda inteligente', err);
            }
        }

        function formatTime(seconds) {
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }

        function stopPlayback() {
            isPlaying = false;
            if (timerInterval) clearInterval(timerInterval);
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            if (lottieAnim) lottieAnim.pause();
            if (playIcon) playIcon.textContent = 'play_arrow';
            if (audioCard) audioCard.classList.remove('psico-audio-playing');
        }

        function startPlayback() {
            isPlaying = true;
            if (playIcon) playIcon.textContent = 'pause';
            if (lottieAnim) lottieAnim.play();
            if (audioCard) audioCard.classList.add('psico-audio-playing');

            // Web Speech API
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                speechUtterance = new SpeechSynthesisUtterance(narrativeText);
                speechUtterance.lang = 'es-MX';
                speechUtterance.rate = playbackRate;
                speechUtterance.pitch = 1.0;

                speechUtterance.onend = () => {
                    currentTime = 0;
                    if (timeDisplay) timeDisplay.textContent = `00:00 / ${formatTime(totalDuration)}`;
                    if (progressBar) progressBar.style.width = '0%';
                    stopPlayback();
                };

                speechUtterance.onerror = () => {
                    stopPlayback();
                };

                window.speechSynthesis.speak(speechUtterance);
            }

            // Temporizador sincronizado para la barra de 38 segundos
            const intervalStepMs = 250;
            if (timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                currentTime += (intervalStepMs / 1000) * playbackRate;
                if (currentTime >= totalDuration) {
                    currentTime = 0;
                    if (timeDisplay) timeDisplay.textContent = `00:00 / ${formatTime(totalDuration)}`;
                    if (progressBar) progressBar.style.width = '0%';
                    stopPlayback();
                    return;
                }
                const progressPct = (currentTime / totalDuration) * 100;
                if (progressBar) progressBar.style.width = `${progressPct}%`;
                if (timeDisplay) timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(totalDuration)}`;
            }, intervalStepMs);
        }

        function togglePlay() {
            if (isPlaying) stopPlayback();
            else startPlayback();
        }

        if (playBtn) playBtn.addEventListener('click', togglePlay);
        if (audioCard) {
            audioCard.addEventListener('click', (e) => {
                if (e.target.closest('#psico-audio-speed') || e.target.closest('#psico-transcript-toggle')) return;
                togglePlay();
            });
        }

        if (speedBtn) {
            speedBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (playbackRate === 1.0) playbackRate = 1.25;
                else if (playbackRate === 1.25) playbackRate = 1.5;
                else playbackRate = 1.0;

                speedBtn.textContent = `${playbackRate}x`;
                if (isPlaying) {
                    stopPlayback();
                    startPlayback();
                }
            });
        }

        if (transcriptToggle && transcriptText) {
            transcriptToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                transcriptText.classList.toggle('hidden');
            });
        }
    }

    // --------------------------------------------------------------------------
    // 5. CASO CLÍNICO: PACIENTE DE 68 AÑOS CON SOSPECHA DE DEMENCIA Y ESCOLARIDAD NULA
    // --------------------------------------------------------------------------
    function initPsicoClinicalCase() {
        const optionBtns = document.querySelectorAll('.psico-case-option');
        const feedbackContainer = document.getElementById('psico-case-feedback');
        const resetBtn = document.getElementById('psico-case-reset');

        if (!optionBtns.length) return;

        const detailedJustification = {
            D: {
                title: "¡Respuesta Correcta! NEUROPSI: Atención y Memoria",
                badgeClass: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500",
                icon: "check_circle",
                iconColor: "text-emerald-500",
                text: `
                    <div class="space-y-3 text-xs md:text-sm leading-relaxed">
                        <p class="font-bold text-emerald-800 dark:text-emerald-300">
                            Razonamiento y Evidencia Científica (Gold Standard):
                        </p>
                        <p>
                            El motivo principal de consulta alerta directamente sobre fallas de origen orgánico-funcional afectando el <strong>lóbulo temporal medial, hipocampo y redes atencionales corticales</strong>, en un sujeto de grupo etario vulnerable a las demencias.
                        </p>
                        <div class="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 font-medium text-emerald-900 dark:text-emerald-200">
                            <strong>Fortaleza Metodológica de los Baremos:</strong> La batería <strong>NEUROPSI</strong> ha sido desarrollada, validada y estandarizada íntegramente en México por la <em>Dra. Feggy Ostrosky</em>. Cuenta con puntos de corte rigurosos estratificados por edad y, de manera fundamental, <strong>por escolaridad nula (analfabetismo)</strong>. Esto previene categorizar como "demencia" o "deterioro cognitivo" lo que en realidad es producto de deprivación educativa, garantizando validez diagnóstica y evitando la iatrogenia cultural.
                        </div>
                        <p class="text-xs text-[var(--color-text-inactive)]">
                            <strong>¿Por qué descartar las otras alternativas?</strong><br>
                            • <strong>WAIS-IV:</strong> Mide el CIT y memoria de trabajo pero es una prueba de ejecución máxima extenuante; carece de la sensibilidad topográfica para focalizar redes de evocación libre/con claves indispensables para el tamizaje demencial precoz.<br>
                            • <strong>MMPI-2:</strong> Instrumento de personalidad con criterio empírico de ejecución típica para psicopatología mayor.<br>
                            • <strong>BDI-II:</strong> Escala de severidad depresiva; si bien después se usará para descartar una "pseudodemencia depresiva", la prioridad de primera línea es la batería focalizada de atención y memoria.
                        </p>
                    </div>
                `
            },
            WAIS: {
                title: "Opción Incorrecta: WAIS-IV",
                badgeClass: "bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500",
                icon: "cancel",
                iconColor: "text-rose-500",
                text: `
                    <p class="text-xs md:text-sm leading-relaxed">
                        El <strong>WAIS-IV</strong> es el estándar de oro para medir la inteligencia general (CIT), pero es una prueba de <strong>ejecución máxima</strong> sumamente extensa y fatigante para un adulto mayor con fallas atencionales severas. Además, sus reactivos tienen una fuerte carga de aprendizaje formal y no ofrece el mapeo de evocación retardada con claves que distingue a la demencia tipo Alzheimer en personas con escolaridad nula. <strong>La opción de primera línea es el NEUROPSI.</strong>
                    </p>
                `
            },
            BDIII: {
                title: "Opción Incorrecta: BDI-II",
                badgeClass: "bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500",
                icon: "cancel",
                iconColor: "text-rose-500",
                text: `
                    <p class="text-xs md:text-sm leading-relaxed">
                        El <strong>BDI-II</strong> evalúa la severidad de síntomas depresivos mediante autoinforme. Aunque en geriatría es fundamental descartar más adelante una <em>pseudodemencia depresiva</em>, la consulta actual exige documentar de inmediato el estado neurocognitivo orgánico con un instrumento con baremo analfabeta: el <strong>NEUROPSI</strong>.
                    </p>
                `
            },
            MMPI: {
                title: "Opción Incorrecta: MMPI-2",
                badgeClass: "bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500",
                icon: "cancel",
                iconColor: "text-rose-500",
                text: `
                    <p class="text-xs md:text-sm leading-relaxed">
                        El <strong>MMPI-2</strong> es una prueba de ejecución típica para evaluar rasgos de personalidad y psicopatología (567 reactivos verdadero/falso). Requiere un nivel de lectoescritura mínimo (secundaria) y no mide dominios mnésicos o atencionales. Es inaplicable en este caso. <strong>La respuesta correcta es el NEUROPSI.</strong>
                    </p>
                `
            }
        };

        optionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedKey = btn.getAttribute('data-case-option');

                optionBtns.forEach(b => {
                    b.classList.remove('border-emerald-500', 'bg-emerald-500/10', 'border-rose-500', 'bg-rose-500/10');
                });

                const justif = detailedJustification[selectedKey];
                if (!justif || !feedbackContainer) return;

                if (selectedKey === 'D') {
                    btn.classList.add('border-emerald-500', 'bg-emerald-500/10');
                    if (typeof window.triggerGameEffect === 'function') {
                        window.triggerGameEffect('win');
                    }
                } else {
                    btn.classList.add('border-rose-500', 'bg-rose-500/10');
                }

                feedbackContainer.innerHTML = `
                    <div class="feedback-fade-in p-5 md:p-6 rounded-3xl border ${justif.badgeClass} bg-[var(--background-navigation)]">
                        <div class="flex items-center gap-2 mb-3">
                            <span class="material-symbols-outlined text-2xl ${justif.iconColor}">${justif.icon}</span>
                            <h4 class="font-black text-base md:text-lg text-[var(--black-color)]">${justif.title}</h4>
                        </div>
                        ${justif.text}
                    </div>
                `;
                feedbackContainer.classList.remove('hidden');

                if (resetBtn) resetBtn.classList.remove('hidden');
            });
        });

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                optionBtns.forEach(b => {
                    b.classList.remove('border-emerald-500', 'bg-emerald-500/10', 'border-rose-500', 'bg-rose-500/10');
                });
                if (feedbackContainer) {
                    feedbackContainer.innerHTML = '';
                    feedbackContainer.classList.add('hidden');
                }
                resetBtn.classList.add('hidden');
            });
        }
    }

    // --------------------------------------------------------------------------
    // 6. MINIJUEGO 1: "EL SEMÁFORO CLÍNICO"
    // --------------------------------------------------------------------------
    function initGameSemaforo() {
        const quoteEl = document.getElementById('semaforo-patient-quote');
        const roundCounter = document.getElementById('semaforo-round-counter');
        const scoreEl = document.getElementById('semaforo-score');
        const optionsContainer = document.getElementById('semaforo-options-container');
        const actionDecisionContainer = document.getElementById('semaforo-action-decision');
        const feedbackEl = document.getElementById('semaforo-step-feedback');
        const lightGreen = document.getElementById('sem-light-green');
        const lightYellow = document.getElementById('sem-light-yellow');
        const lightRed = document.getElementById('sem-light-red');
        const restartBtn = document.getElementById('semaforo-restart-btn');
        const winModal = document.getElementById('semaforo-win-modal');

        if (!quoteEl || !optionsContainer) return;

        const vignettes = [
            {
                quote: "«Doctor, llevo tres semanas sin poder dormir, siento que el pecho se me cierra y creo que algo malo va a pasar en cualquier momento.»",
                diagnosisHint: "Crisis de Ansiedad / Activación Simpática Aguda",
                interventions: [
                    {
                        type: 'green',
                        title: 'Intervención Empática & Técnica (Luz Verde)',
                        text: '«Comprendo lo abrumador que es sentir esa presión en el pecho y el insomnio. Evaluemos estos síntomas con calma en un espacio protegido y diseñemos juntos una pauta de contención inmediata.»',
                        action: 'Contención Emocional y prueba psicométrica de ansiedad (IDARE)'
                    },
                    {
                        type: 'yellow',
                        title: 'Intervención Intrusiva (Luz Amarilla)',
                        text: '«¿Por qué tardó tres semanas en venir? Debe tener algún conflicto no resuelto en su infancia que le causó este colapso.»',
                        action: 'Juicio prematuro / Pregunta intrusiva'
                    },
                    {
                        type: 'red',
                        title: 'Intervención Invalidante (Luz Roja)',
                        text: '«No exagere, a todos se nos cierra el pecho por estrés hoy en día. Tómese un té de manzanilla y trate de distraerse.»',
                        action: 'Minimización del sufrimiento clínico'
                    }
                ]
            },
            {
                quote: "«Siento que en mi trabajo me están vigilando los correos electrónicos y que mis compañeros conspiran en secreto para destruirme.»",
                diagnosisHint: "Sintomatología Paranoide / Sospecha Psicopatológica",
                interventions: [
                    {
                        type: 'green',
                        title: 'Intervención Empática & Técnica (Luz Verde)',
                        text: '«Percibo la enorme angustia y estado de alerta con el que estás viviendo esta situación laboral. Vamos a explorar detalladamente tus vivencias para entender qué está ocurriendo y proteger tu bienestar.»',
                        action: 'Evaluación estructurada con escalas de validez (MMPI-2) y derivación psiquiátrica'
                    },
                    {
                        type: 'yellow',
                        title: 'Intervención Intrusiva (Luz Amarilla)',
                        text: '«¿Tiene pruebas tangibles de los hackers? Cuénteme todos los nombres de sus compañeros sospechosos ahora mismo.»',
                        action: 'Alimentar la suspicacia sin encuadre evaluativo'
                    },
                    {
                        type: 'red',
                        title: 'Intervención Invalidante (Luz Roja)',
                        text: '«Usted está delirando, nadie pierde su tiempo en espiarlo a usted. No se haga ideas absurdas en la cabeza.»',
                        action: 'Confrontación directa agresiva'
                    }
                ]
            },
            {
                quote: "«No le encuentro ningún sentido a levantarme por las mañanas. Siento un vacío total y que soy un estorbo para mis seres queridos.»",
                diagnosisHint: "Ideación Depresiva Severa / Posible Riesgo Suicida",
                interventions: [
                    {
                        type: 'green',
                        title: 'Intervención Empática & Técnica (Luz Verde)',
                        text: '«Valoro mucho que me compartas este dolor tan hondo; sentirse una carga es una señal del sufrimiento depresivo. Vamos a revisar juntos cómo te has sentido en las últimas dos semanas para activar un protocolo de apoyo integral.»',
                        action: 'Aplicación urgente del BDI-II, evaluación de riesgo suicida y red de apoyo'
                    },
                    {
                        type: 'yellow',
                        title: 'Intervención Intrusiva (Luz Amarilla)',
                        text: '«¿Se piensa quitar la vida hoy al salir del consultorio? Respóndame sin rodeos.»',
                        action: 'Abordaje alarmista desprovisto de contención'
                    },
                    {
                        type: 'red',
                        title: 'Intervención Invalidante (Luz Roja)',
                        text: '«Mire a su alrededor, usted tiene techo y comida. Hay gente en peores condiciones que no se queja.»',
                        action: 'Invalidación moralista culpigena'
                    }
                ]
            }
        ];

        let currentVignetteIdx = 0;
        let score = 0;

        function resetLights() {
            if (lightGreen) lightGreen.className = 'semaforo-light w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/40 shadow-inner';
            if (lightYellow) lightYellow.className = 'semaforo-light w-8 h-8 rounded-full bg-amber-950 border border-amber-500/40 shadow-inner';
            if (lightRed) lightRed.className = 'semaforo-light w-8 h-8 rounded-full bg-rose-950 border border-rose-500/40 shadow-inner';
        }

        function renderVignette() {
            resetLights();
            const vig = vignettes[currentVignetteIdx];
            if (roundCounter) roundCounter.textContent = `Caso ${currentVignetteIdx + 1} de ${vignettes.length}`;
            if (scoreEl) scoreEl.textContent = `${score} pts`;
            if (quoteEl) quoteEl.textContent = vig.quote;
            if (feedbackEl) {
                feedbackEl.innerHTML = '';
                feedbackEl.classList.add('hidden');
            }

            optionsContainer.innerHTML = '';
            
            // Mezclar opciones para dinamismo
            const shuffled = [...vig.interventions].sort(() => Math.random() - 0.5);

            shuffled.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'w-full p-4 rounded-2xl bg-[var(--background-navigation)] border border-[var(--border-navigation)] text-left hover:scale-[1.01] active:scale-[0.99] transition-all flex flex-col gap-1.5 shadow-sm';
                
                let tagColor = 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
                if (opt.type === 'green') tagColor = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
                else if (opt.type === 'yellow') tagColor = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
                else if (opt.type === 'red') tagColor = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';

                btn.innerHTML = `
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${tagColor}">
                            Opción de Intervención
                        </span>
                        <span class="material-symbols-outlined text-sm text-[var(--color-text-inactive)]">touch_app</span>
                    </div>
                    <p class="text-xs md:text-sm font-semibold text-[var(--black-color)] leading-snug">${opt.text}</p>
                `;

                btn.addEventListener('click', () => {
                    handleOptionClick(opt, btn);
                });

                optionsContainer.appendChild(btn);
            });
        }

        function handleOptionClick(opt, btnEl) {
            resetLights();
            const allBtns = optionsContainer.querySelectorAll('button');
            allBtns.forEach(b => b.disabled = true);

            if (opt.type === 'green') {
                if (lightGreen) lightGreen.classList.add('active-green');
                btnEl.classList.add('border-emerald-500', 'bg-emerald-500/20');
                score += 100;
                if (scoreEl) scoreEl.textContent = `${score} pts`;

                if (feedbackEl) {
                    feedbackEl.innerHTML = `
                        <div class="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs md:text-sm feedback-fade-in flex flex-col gap-1">
                            <span class="font-black flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                                <span class="material-symbols-outlined text-lg">check_circle</span>
                                ¡Intervención Óptima! (Luz Verde Empática & Técnica)
                            </span>
                            <p><strong>Decisión Terapéutica Recomendada:</strong> ${opt.action}.</p>
                        </div>
                    `;
                    feedbackEl.classList.remove('hidden');
                }

                setTimeout(() => {
                    currentVignetteIdx++;
                    if (currentVignetteIdx < vignettes.length) {
                        renderVignette();
                    } else {
                        // Victoria del Minijuego 1
                        handleSemaforoWin();
                    }
                }, 1600);

            } else if (opt.type === 'yellow') {
                if (lightYellow) lightYellow.classList.add('active-yellow');
                btnEl.classList.add('border-amber-500', 'bg-amber-500/20');
                if (feedbackEl) {
                    feedbackEl.innerHTML = `
                        <div class="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs md:text-sm feedback-fade-in">
                            <span class="font-black flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                                <span class="material-symbols-outlined text-lg">warning</span>
                                Atención: Intervención Intrusiva (Luz Amarilla)
                            </span>
                            <p class="mt-1">Indagar prematuramente sin antes contener la angustia rompe el rapport terapéutico.</p>
                        </div>
                    `;
                    feedbackEl.classList.remove('hidden');
                }
                setTimeout(() => {
                    allBtns.forEach(b => b.disabled = false);
                }, 1200);

            } else {
                if (lightRed) lightRed.classList.add('active-red');
                btnEl.classList.add('border-rose-500', 'bg-rose-500/20');
                if (feedbackEl) {
                    feedbackEl.innerHTML = `
                        <div class="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-800 dark:text-rose-200 text-xs md:text-sm feedback-fade-in">
                            <span class="font-black flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                                <span class="material-symbols-outlined text-lg">dangerous</span>
                                Error Clínico: Respuesta Invalidante (Luz Roja)
                            </span>
                            <p class="mt-1">Minimizar la experiencia subjetiva del paciente aumenta el riesgo de deserción y iatrogenia.</p>
                        </div>
                    `;
                    feedbackEl.classList.remove('hidden');
                }
                setTimeout(() => {
                    allBtns.forEach(b => b.disabled = false);
                }, 1200);
            }
        }

        function handleSemaforoWin() {
            // Desbloquear Medalla oficial en el contenedor del header
            if (typeof window.unlockMedal === 'function') {
                window.unlockMedal('SinPapeles', 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiQ5ZNlqDhV_emF_nTiHMnUM1R7D6qjroGZ_PMhdnyjNLVMwOfv9XW4RadX6ztSLDLKKCeMqwnNRYrTArod7WhRDqZ9Ifpl3vCVg-K_TR7QtUU2rqzfa6LBunY-Ydsp5cfnpe9uCg_jrcgFEHMj__NcXqHjW2XmVlRqB7QHx0jRED_lYQwIQWLf5NaxvLo/s1024/1792864030819.png');
            }
            if (typeof window.triggerGameEffect === 'function') {
                window.triggerGameEffect('win');
            }

            if (winModal) {
                winModal.classList.remove('hidden');
                winModal.classList.add('flex');
            }
        }

        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                if (winModal) {
                    winModal.classList.add('hidden');
                    winModal.classList.remove('flex');
                }
                currentVignetteIdx = 0;
                score = 0;
                renderVignette();
            });
        }

        renderVignette();
    }

    // --------------------------------------------------------------------------
    // 7. MINIJUEGO 2: "MATCH PSICOMÉTRICO" (CONEXIÓN RÁPIDA DE PAREJAS EN 30S)
    // --------------------------------------------------------------------------
    function initGameMatch() {
        const gridContainer = document.getElementById('match-cards-grid');
        const timerBar = document.getElementById('match-timer-bar');
        const timerText = document.getElementById('match-timer-text');
        const pairsCountEl = document.getElementById('match-pairs-count');
        const startBtn = document.getElementById('match-start-btn');
        const winModal = document.getElementById('match-win-modal');
        const loseModal = document.getElementById('match-lose-modal');
        const restartWinBtn = document.getElementById('match-restart-win-btn');
        const restartLoseBtn = document.getElementById('match-restart-lose-btn');

        if (!gridContainer) return;

        const pairsData = [
            {
                id: 'p1',
                construct: 'Evaluar inteligencia y CIT en adultos (16 a 90 años)',
                instrument: 'WAIS-IV'
            },
            {
                id: 'p2',
                construct: 'Detectar demencia ajustado a escolaridad nula (analfabeta)',
                instrument: 'NEUROPSI'
            },
            {
                id: 'p3',
                construct: 'Control inhibitorio, toma de riesgos y funciones ejecutivas',
                instrument: 'BANFE-2'
            },
            {
                id: 'p4',
                construct: 'Cuantificar severidad de síntomas depresivos (21 reactivos)',
                instrument: 'BDI-II'
            },
            {
                id: 'p5',
                construct: 'Personalidad clínica con escalas de validez paramétrica (L, F, K)',
                instrument: 'MMPI-2'
            },
            {
                id: 'p6',
                construct: 'Diferenciar ansiedad transitoria reactiva de la constitucional',
                instrument: 'IDARE'
            }
        ];

        let timerSeconds = 30;
        let timerInterval = null;
        let selectedCard = null;
        let matchedPairs = 0;
        let isGameRunning = false;

        function startMatchGame() {
            if (timerInterval) clearInterval(timerInterval);
            timerSeconds = 30;
            matchedPairs = 0;
            selectedCard = null;
            isGameRunning = true;

            if (pairsCountEl) pairsCountEl.textContent = `0 / ${pairsData.length}`;
            if (timerText) timerText.textContent = `30s`;
            if (timerBar) {
                timerBar.style.width = '100%';
                timerBar.className = 'timer-progress-bar h-2.5 rounded-full bg-blue-500 transition-all';
            }

            if (winModal) { winModal.classList.add('hidden'); winModal.classList.remove('flex'); }
            if (loseModal) { loseModal.classList.add('hidden'); loseModal.classList.remove('flex'); }

            renderMatchCards();

            timerInterval = setInterval(() => {
                timerSeconds--;
                if (timerText) timerText.textContent = `${timerSeconds}s`;
                if (timerBar) {
                    const pct = (timerSeconds / 30) * 100;
                    timerBar.style.width = `${pct}%`;
                    if (timerSeconds <= 10) {
                        timerBar.className = 'timer-progress-bar h-2.5 rounded-full bg-rose-500 animate-pulse';
                    }
                }

                if (timerSeconds <= 0) {
                    clearInterval(timerInterval);
                    isGameRunning = false;
                    if (matchedPairs < pairsData.length) {
                        handleMatchLose();
                    }
                }
            }, 1000);
        }

        function renderMatchCards() {
            gridContainer.innerHTML = '';
            
            // Crear cartas individuales para constructos e instrumentos
            const cardItems = [];
            pairsData.forEach(p => {
                cardItems.push({
                    type: 'construct',
                    pairId: p.id,
                    text: p.construct,
                    label: 'Constructo'
                });
                cardItems.push({
                    type: 'instrument',
                    pairId: p.id,
                    text: p.instrument,
                    label: 'Instrumento'
                });
            });

            // Barajar aleatoriamente
            cardItems.sort(() => Math.random() - 0.5);

            cardItems.forEach(item => {
                const cardEl = document.createElement('div');
                cardEl.className = 'match-card p-3 md:p-4 rounded-2xl bg-[var(--background-navigation)] border border-[var(--border-navigation)] flex flex-col justify-between shadow-sm min-h-[90px]';
                cardEl.dataset.pairId = item.pairId;
                cardEl.dataset.type = item.type;

                const isInst = item.type === 'instrument';
                const pillColor = isInst 
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' 
                    : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';

                cardEl.innerHTML = `
                    <span class="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border w-fit ${pillColor}">
                        ${item.label}
                    </span>
                    <p class="font-bold text-xs md:text-sm text-[var(--black-color)] leading-snug my-1">
                        ${item.text}
                    </p>
                    <div class="text-[9px] text-[var(--color-text-inactive)] text-right font-mono">Toca para unir</div>
                `;

                cardEl.addEventListener('click', () => {
                    if (!isGameRunning) return;
                    handleCardSelect(cardEl, item);
                });

                gridContainer.appendChild(cardEl);
            });
        }

        function handleCardSelect(cardEl, item) {
            if (cardEl.classList.contains('matched')) return;

            // Si ya está seleccionada, deseleccionar
            if (selectedCard && selectedCard.el === cardEl) {
                cardEl.classList.remove('selected');
                selectedCard = null;
                return;
            }

            // Primera selección
            if (!selectedCard) {
                selectedCard = { el: cardEl, item: item };
                cardEl.classList.add('selected');
                return;
            }

            // Segunda selección
            const first = selectedCard;
            cardEl.classList.add('selected');

            // Comprobar si son del mismo tipo (no se pueden unir dos instrumentos o dos constructos)
            if (first.item.type === item.type) {
                first.el.classList.remove('selected');
                selectedCard = { el: cardEl, item: item };
                return;
            }

            // Comprobar acierto
            if (first.item.pairId === item.pairId) {
                // ¡Acierto!
                first.el.classList.remove('selected');
                cardEl.classList.remove('selected');
                first.el.classList.add('matched');
                cardEl.classList.add('matched');

                matchedPairs++;
                if (pairsCountEl) pairsCountEl.textContent = `${matchedPairs} / ${pairsData.length}`;
                selectedCard = null;

                if (matchedPairs === pairsData.length) {
                    clearInterval(timerInterval);
                    isGameRunning = false;
                    setTimeout(handleMatchWin, 400);
                }
            } else {
                // Fallo: agitar
                first.el.classList.add('error-shake');
                cardEl.classList.add('error-shake');

                setTimeout(() => {
                    first.el.classList.remove('selected', 'error-shake');
                    cardEl.classList.remove('selected', 'error-shake');
                    selectedCard = null;
                }, 450);
            }
        }

        function handleMatchWin() {
            // Desbloquear Medalla oficial en el contenedor del header
            if (typeof window.unlockMedal === 'function') {
                window.unlockMedal('FacPsico', 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgjjTw_nxVZWO1spwxDTefPZSJGFQrkgdFfBPP0407MYKYpy9XchT52XpI_FcCgoBQIpcWuS_MpILyjEdj1MuMmPLWjHaxApk_kSgrf8HNYwBsHeDFZ3ZzkUif9NXkBZnMuuTEzNKhkDSjPnHCazPZwrAGh3P5I0SBfn3_Xla9Rbbx7NM6Bf1Uel6FKJzA/s2048/1792862620266.png');
            }
            if (typeof window.triggerGameEffect === 'function') {
                window.triggerGameEffect('win');
            }

            if (winModal) {
                winModal.classList.remove('hidden');
                winModal.classList.add('flex');
            }
        }

        function handleMatchLose() {
            if (typeof window.triggerGameEffect === 'function') {
                window.triggerGameEffect('lose');
            }
            if (loseModal) {
                loseModal.classList.remove('hidden');
                loseModal.classList.add('flex');
            }
        }

        if (startBtn) startBtn.addEventListener('click', startMatchGame);
        if (restartWinBtn) restartWinBtn.addEventListener('click', startMatchGame);
        if (restartLoseBtn) restartLoseBtn.addEventListener('click', startMatchGame);

        // Iniciar tablero preparado
        renderMatchCards();
    }

    // --------------------------------------------------------------------------
    // 8. BOOTSTRAP Y API GLOBAL COMPATIBLE CON LAZY_LOADER.JS
    // --------------------------------------------------------------------------
    let isPsicoInitialized = false;
    function initAllPsicologia() {
        if (isPsicoInitialized) return; 
        isPsicoInitialized = true;
        initPsicoTabs();
        initPsicoNotes();
        initPsicoFlashcards();
        initPsicoAudio();
        initPsicoClinicalCase();
        initGameSemaforo();
        initGameMatch();
    }

    window.__manualInitPsicologia = initAllPsicologia;
    window.initPsicologia = initAllPsicologia;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAllPsicologia);
    } else {
        initAllPsicologia();
    }

})();
