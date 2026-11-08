/**
 * ============================================================
 * SCRIPT BIENESTAR & REGULACIÓN EMOCIONAL
 * Salud Activa Lab - Apuntes Uni
 * ============================================================
 */
(function () {
    'use strict';

    // Claves de Almacenamiento Local (Local Storage)
    const STORAGE_KEYS = {
        VAULT_SETTINGS: 'saludactiva_bienestar_vault_settings',
        VAULT_DATE: 'saludactiva_bienestar_vault_date',
        VAULT_THOUGHTS: 'saludactiva_bienestar_vault_thoughts',
        TASKS_DATE: 'saludactiva_bienestar_tasks_date',
        TASKS: 'saludactiva_bienestar_tasks',
        ANCHORS: 'saludactiva_bienestar_anchors',
        ACTIVE_MSG: 'saludactiva_bienestar_active_msg'
    };

    // Tareas Predeterminadas de Autocuidado
    const DEFAULT_TASKS = [
        {
            id: 'task-1',
            title: 'Caminar 15 min al aire libre',
            category: 'Movimiento & Oxigenación',
            icon: 'directions_walk',
            color: 'emerald',
            state: 'pending', // 'pending' | 'in_progress' | 'completed'
            initialEnergy: null,
            finalEnergy: null
        },
        {
            id: 'task-2',
            title: 'Comida a tiempo y sin pantallas',
            category: 'Nutrición Consciente',
            icon: 'restaurant',
            color: 'blue',
            state: 'pending',
            initialEnergy: null,
            finalEnergy: null
        },
        {
            id: 'task-3',
            title: 'Movilidad o estiramiento corporal',
            category: 'Alivio Somático',
            icon: 'fitness_center',
            color: 'purple',
            state: 'pending',
            initialEnergy: null,
            finalEnergy: null
        },
        {
            id: 'task-4',
            title: 'Hidratación consciente (500 ml)',
            category: 'Vitalidad Celular',
            icon: 'water_drop',
            color: 'teal',
            state: 'pending',
            initialEnergy: null,
            finalEnergy: null
        }
    ];

    // Contactos Anclas Predeterminadas
    const DEFAULT_ANCHORS = [
        {
            id: 'anchor-1',
            name: 'Andrea Gómez',
            relationship: 'Amiga de confianza',
            phone: '5215512345678',
            email: 'andrea.amiga@ejemplo.com'
        },
        {
            id: 'anchor-2',
            name: 'Carlos Ruiz',
            relationship: 'Familiar / Hermano',
            phone: '5215598765432',
            email: ''
        },
        {
            id: 'anchor-3',
            name: 'Dra. Elena Vázquez',
            relationship: 'Terapeuta / Psicóloga',
            phone: '5215543218765',
            email: 'contacto.elena@salud.org'
        }
    ];

    // ============================================================
    // ESTADO LOCAL DE LA SESIÓN
    // ============================================================
    let isVaultTestUnlocked = false;
    let selectedVaultTag = 'Catastrofismo';
    let currentTaskForSlider = null;
    let sliderEvaluationMode = 'initial'; // 'initial' o 'final'

    // ============================================================
    // UTILIDADES DE FECHA Y PERSISTENCIA
    // ============================================================
    function getTodayString() {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    function checkDailyRenewal() {
        const today = getTodayString();
        const savedVaultDate = localStorage.getItem(STORAGE_KEYS.VAULT_DATE);
        const savedTasksDate = localStorage.getItem(STORAGE_KEYS.TASKS_DATE);

        // Renovación diaria de la Bóveda
        if (savedVaultDate !== today) {
            localStorage.setItem(STORAGE_KEYS.VAULT_DATE, today);
            // Iniciar lista vacía para el nuevo día (dejando el día limpio y organizado)
            localStorage.setItem(STORAGE_KEYS.VAULT_THOUGHTS, JSON.stringify([]));
        }

        // Renovación diaria de las Tareas de Activación
        if (savedTasksDate !== today) {
            localStorage.setItem(STORAGE_KEYS.TASKS_DATE, today);
            // Reiniciar estado de las tareas a 'pending' para el nuevo día
            const currentTasks = getStoredTasks();
            const resetTasks = currentTasks.map(t => ({
                ...t,
                state: 'pending',
                initialEnergy: null,
                finalEnergy: null
            }));
            localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(resetTasks));
        }
    }

    function getStoredTasks() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.TASKS);
            return data ? JSON.parse(data) : DEFAULT_TASKS;
        } catch (e) {
            return DEFAULT_TASKS;
        }
    }

    function saveStoredTasks(tasks) {
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    }

    function getStoredThoughts() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.VAULT_THOUGHTS);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    function saveStoredThoughts(thoughts) {
        localStorage.setItem(STORAGE_KEYS.VAULT_THOUGHTS, JSON.stringify(thoughts));
    }

    function getStoredAnchors() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.ANCHORS);
            return data ? JSON.parse(data) : DEFAULT_ANCHORS;
        } catch (e) {
            return DEFAULT_ANCHORS;
        }
    }

    function saveStoredAnchors(anchors) {
        localStorage.setItem(STORAGE_KEYS.ANCHORS, JSON.stringify(anchors));
    }

    function getVaultSettings() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.VAULT_SETTINGS);
            return data ? JSON.parse(data) : { startTime: '19:00', endTime: '19:30' };
        } catch (e) {
            return { startTime: '19:00', endTime: '19:30' };
        }
    }

    function saveVaultSettings(settings) {
        localStorage.setItem(STORAGE_KEYS.VAULT_SETTINGS, JSON.stringify(settings));
    }

    // ============================================================
    // 1. ANCLAJE SENSORIAL (TÉCNICA 5-4-3-2-1)
    // ============================================================
    const GROUNDING_STEPS = [
        {
            num: 5,
            title: '5 Cosas que veas',
            instruction: 'Detén tu mente y observa con atención tu entorno. Toca la pantalla 5 veces conforme vayas reconociendo 5 objetos reales.',
            icon: 'visibility',
            color: '#10b981',
            badgeClass: 'bg-emerald-500'
        },
        {
            num: 4,
            title: '4 Cosas que sientas físicamente',
            instruction: 'Nota sensaciones táctiles reales (la ropa sobre tu piel, el suelo bajo tus pies, la temperatura). Toca la pantalla 4 veces.',
            icon: 'touch_app',
            color: '#14b8a6',
            badgeClass: 'bg-teal-500'
        },
        {
            num: 3,
            title: '3 Cosas que escuches',
            instruction: 'Cierra levemente los ojos y escucha los sonidos cercanos o lejanos. Toca la pantalla 3 veces por cada sonido identificado.',
            icon: 'hearing',
            color: '#6366f1',
            badgeClass: 'bg-indigo-500'
        },
        {
            num: 2,
            title: '2 Cosas que puedas oler',
            instruction: 'Inhala suavemente y busca 2 aromas presentes en el aire o en tu piel. Toca la pantalla 2 veces.',
            icon: 'air',
            color: '#a855f7',
            badgeClass: 'bg-purple-500'
        },
        {
            num: 1,
            title: '1 Cosa que puedas saborear',
            instruction: 'Nota el sabor en tu boca o repite en tu mente: "Estoy a salvo aquí y ahora". Toca la pantalla 1 vez para concluir.',
            icon: 'restaurant',
            color: '#f59e0b',
            badgeClass: 'bg-amber-500'
        }
    ];

    let currentGroundingStepIndex = 0;
    let currentGroundingTouches = 0;

    function openGroundingModal() {
        const modal = document.getElementById('grounding-modal');
        if (!modal) return;

        currentGroundingStepIndex = 0;
        currentGroundingTouches = 0;
        renderGroundingStep();

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeGroundingModal() {
        const modal = document.getElementById('grounding-modal');
        if (!modal) return;

        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function renderGroundingStep() {
        const step = GROUNDING_STEPS[currentGroundingStepIndex];
        if (!step) {
            renderGroundingCompletion();
            return;
        }

        const iconEl = document.getElementById('grounding-step-icon');
        const titleEl = document.getElementById('grounding-step-title');
        const instructionEl = document.getElementById('grounding-step-instruction');
        const touchesCountEl = document.getElementById('grounding-touches-count');
        const progressCircle = document.getElementById('grounding-progress-circle');
        const haloEl = document.getElementById('grounding-halo');
        const stepperDots = document.getElementById('grounding-stepper-dots');

        if (iconEl) {
            iconEl.textContent = step.icon;
            iconEl.style.color = step.color;
        }
        if (titleEl) titleEl.textContent = step.title;
        if (instructionEl) instructionEl.textContent = step.instruction;
        if (touchesCountEl) touchesCountEl.textContent = `${currentGroundingTouches} / ${step.num}`;
        if (haloEl) haloEl.style.backgroundColor = step.color;

        // Anillo SVG circular
        if (progressCircle) {
            const circumference = 314.159;
            const progressRatio = currentGroundingTouches / step.num;
            const offset = circumference - (circumference * progressRatio);
            progressCircle.style.strokeDashoffset = offset;
            progressCircle.style.stroke = step.color;
        }

        // Actualizar stepper dots superiores
        if (stepperDots) {
            const dots = stepperDots.querySelectorAll('.step-dot');
            dots.forEach((dot, idx) => {
                if (idx === currentGroundingStepIndex) {
                    dot.className = `step-dot px-3 py-1 rounded-full text-xs font-black text-white shadow-md transition-all ${step.badgeClass} scale-110`;
                } else if (idx < currentGroundingStepIndex) {
                    dot.className = 'step-dot px-3 py-1 rounded-full text-xs font-black bg-emerald-500/40 text-white/90';
                } else {
                    dot.className = 'step-dot px-3 py-1 rounded-full text-xs font-black bg-white/10 text-white/50';
                }
            });
        }
    }

    function handleGroundingTap(e) {
        // Evitar que el clic en el botón cerrar dispare el toque
        if (e.target.closest('#btn-close-grounding')) return;

        const step = GROUNDING_STEPS[currentGroundingStepIndex];
        if (!step) return;

        // Vibración háptica en móvil
        if (navigator.vibrate) {
            navigator.vibrate(35);
        }

        // Generar partícula / onda expansiva táctil
        createGroundingRipple(e.clientX, e.clientY, step.color);

        currentGroundingTouches++;
        renderGroundingStep();

        // Si se completan los toques del paso actual
        if (currentGroundingTouches >= step.num) {
            setTimeout(() => {
                currentGroundingStepIndex++;
                currentGroundingTouches = 0;
                renderGroundingStep();
            }, 300);
        }
    }

    function createGroundingRipple(x, y, color) {
        const ripple = document.createElement('div');
        ripple.className = 'grounding-ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.borderColor = color || '#10b981';
        ripple.style.boxShadow = `0 0 25px ${color || '#10b981'}, inset 0 0 15px ${color || '#10b981'}`;
        document.body.appendChild(ripple);

        setTimeout(() => {
            if (ripple && ripple.parentNode) ripple.parentNode.removeChild(ripple);
        }, 800);
    }

    function renderGroundingCompletion() {
        const modalContent = document.querySelector('#grounding-modal > div:last-child');
        if (!modalContent) return;

        modalContent.innerHTML = `
            <div class="space-y-6 text-center py-4">
                <div class="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-bounce">
                    <span class="material-symbols-outlined text-5xl">task_alt</span>
                </div>
                <div class="space-y-2">
                    <h3 class="text-3xl font-black text-white">¡Aterrizaje Completado!</h3>
                    <p class="text-emerald-100 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                        Has reconectado con tu cuerpo y con la realidad presente. Tu corteza prefrontal ha retomado el control sobre la respuesta de alarma.
                    </p>
                </div>
                <div class="p-4 rounded-2xl bg-white/10 backdrop-blur-md text-xs text-white/90 border border-white/15">
                    "La tormenta está afuera, pero tu respiración y tu calma están aquí dentro."
                </div>
                <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button id="btn-restart-grounding" class="px-6 py-3 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors">
                        Repetir Ejercicio
                    </button>
                    <button id="btn-finish-grounding" class="px-8 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-lg transition-transform hover:scale-105">
                        Volver a Mi Espacio
                    </button>
                </div>
            </div>
        `;

        const btnRestart = document.getElementById('btn-restart-grounding');
        const btnFinish = document.getElementById('btn-finish-grounding');

        if (btnRestart) {
            btnRestart.addEventListener('click', () => {
                location.reload(); // Re-render limpio si es necesario o reiniciar
            });
        }
        if (btnFinish) {
            btnFinish.addEventListener('click', closeGroundingModal);
        }
    }

    // ============================================================
    // 2. REESTRUCTURACIÓN COGNITIVA Y DISTANCIAMIENTO (LA BÓVEDA)
    // ============================================================
    function isVaultOpenNow() {
        if (isVaultTestUnlocked) return true;

        const settings = getVaultSettings();
        const now = new Date();
        const curMins = now.getHours() * 60 + now.getMinutes();

        const [sH, sM] = settings.startTime.split(':').map(Number);
        const [eH, eM] = settings.endTime.split(':').map(Number);
        const startMins = sH * 60 + sM;
        const endMins = eH * 60 + eM;

        return (curMins >= startMins && curMins <= endMins);
    }

    function updateVaultStatusUI() {
        const isOpen = isVaultOpenNow();
        const settings = getVaultSettings();

        const statusIndicatorDot = document.getElementById('vault-status-indicator-dot');
        const statusText = document.getElementById('vault-status-text');
        const dial = document.getElementById('vault-dial-element');
        const lockIcon = document.getElementById('vault-lock-icon');
        const subtext = document.getElementById('vault-status-subtext');
        const timeDisplayBtn = document.getElementById('vault-time-display-btn');
        const testUnlockBtn = document.getElementById('btn-toggle-test-unlock');

        if (timeDisplayBtn) {
            timeDisplayBtn.textContent = `${settings.startTime} - ${settings.endTime}`;
        }

        if (isOpen) {
            if (statusIndicatorDot) {
                statusIndicatorDot.className = 'w-3 h-3 rounded-full bg-emerald-500 animate-ping';
            }
            if (statusText) {
                statusText.className = 'text-xs font-black uppercase tracking-wider text-emerald-400';
                statusText.textContent = 'Bóveda Desbloqueada';
            }
            if (dial) dial.classList.add('unlocked');
            if (lockIcon) {
                lockIcon.textContent = 'lock_open';
                lockIcon.className = 'material-symbols-outlined text-4xl text-emerald-400';
            }
            if (subtext) {
                subtext.innerHTML = `¡Es tu hora de preocupación! (${settings.startTime} - ${settings.endTime}). Revisa tus notas con distancia cognitiva o descártalas.`;
            }
            if (testUnlockBtn) {
                testUnlockBtn.innerHTML = `<span class="material-symbols-outlined text-sm">lock</span> <span>Cerrar simulación</span>`;
            }
        } else {
            if (statusIndicatorDot) {
                statusIndicatorDot.className = 'w-3 h-3 rounded-full bg-rose-500 animate-ping';
            }
            if (statusText) {
                statusText.className = 'text-xs font-black uppercase tracking-wider text-rose-400';
                statusText.textContent = 'Bóveda Sellada';
            }
            if (dial) dial.classList.remove('unlocked');
            if (lockIcon) {
                lockIcon.textContent = 'lock';
                lockIcon.className = 'material-symbols-outlined text-4xl text-slate-300';
            }
            if (subtext) {
                subtext.innerHTML = `Desbloqueo programado: <strong>${settings.startTime} a ${settings.endTime}</strong>. Fuera de ese rango, tu mente tiene permiso de descansar.`;
            }
            if (testUnlockBtn) {
                testUnlockBtn.innerHTML = `<span class="material-symbols-outlined text-sm">science</span> <span>Simular hora activa</span>`;
            }
        }

        renderVaultThoughtsList();
    }

    function renderVaultThoughtsList() {
        const thoughts = getStoredThoughts();
        const listEl = document.getElementById('vault-thoughts-list');
        const countTextEl = document.getElementById('vault-thoughts-count-text');
        const dateTextEl = document.getElementById('vault-current-date-text');
        const isOpen = isVaultOpenNow();

        if (countTextEl) {
            countTextEl.textContent = `${thoughts.length} Pensamiento${thoughts.length === 1 ? '' : 's'} ${isOpen ? 'Disponibles' : 'Sellados'}`;
        }
        if (dateTextEl) {
            dateTextEl.textContent = getTodayString();
        }

        if (!listEl) return;

        if (thoughts.length === 0) {
            listEl.innerHTML = `
                <div class="p-4 rounded-2xl bg-white/5 border border-white/10 text-center text-xs text-slate-400">
                    No hay pensamientos registrados para hoy. Tu mente está despejada.
                </div>
            `;
            return;
        }

        listEl.innerHTML = thoughts.map(t => {
            if (isOpen) {
                // Modo Abierto: legible, con botón para descartar / romper
                return `
                    <div class="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 text-xs flex items-center justify-between gap-3 transition-all hover:bg-slate-750">
                        <div class="space-y-1 overflow-hidden">
                            <div class="flex items-center gap-2">
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/30 text-indigo-300">${t.tag}</span>
                                <span class="text-[10px] text-slate-400 font-mono">${t.time}</span>
                            </div>
                            <p class="text-slate-100 font-medium text-xs break-words">${t.text}</p>
                        </div>
                        <button onclick="window.__discardVaultThought('${t.id}')" class="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 text-[11px] font-bold shrink-0 flex items-center gap-1 transition-colors" title="Descartar pensamiento">
                            <span class="material-symbols-outlined text-sm">delete</span>
                            <span class="hidden sm:inline">Descartar</span>
                        </button>
                    </div>
                `;
            } else {
                // Modo Sellado: enmascarado con blur
                return `
                    <div class="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs flex items-center justify-between gap-2 select-none">
                        <div class="flex items-center gap-2.5">
                            <span class="material-symbols-outlined text-slate-400 text-sm">lock</span>
                            <span class="text-[10px] text-slate-400 font-mono">${t.time}</span>
                            <span class="thought-locked-blur text-slate-200">Pensamiento intrusivo protegido en bóveda</span>
                        </div>
                        <span class="text-[10px] font-bold text-slate-500">Sellado</span>
                    </div>
                `;
            }
        }).join('');
    }

    window.__discardVaultThought = function (thoughtId) {
        const thoughts = getStoredThoughts();
        const filtered = thoughts.filter(t => t.id !== thoughtId);
        saveStoredThoughts(filtered);
        renderVaultThoughtsList();
    };

    function handleSaveThought() {
        const input = document.getElementById('vault-input-text');
        const formCard = document.getElementById('card-thought-form');
        if (!input) return;

        const text = input.value.trim();
        if (!text) {
            input.focus();
            input.classList.add('ring-2', 'ring-rose-500');
            setTimeout(() => input.classList.remove('ring-2', 'ring-rose-500'), 1000);
            return;
        }

        // Animación visual de compresión hacia la bóveda
        if (formCard) {
            formCard.classList.add('anim-vault-absorb');
        }

        // Sonido háptico
        if (navigator.vibrate) navigator.vibrate([40, 30, 60]);

        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const newThought = {
            id: 'thought_' + Date.now(),
            text: text,
            tag: selectedVaultTag,
            time: timeStr,
            date: getTodayString()
        };

        const thoughts = getStoredThoughts();
        thoughts.unshift(newThought);
        saveStoredThoughts(thoughts);

        setTimeout(() => {
            input.value = '';
            if (formCard) formCard.classList.remove('anim-vault-absorb');
            updateVaultStatusUI();
        }, 850);
    }

    // ============================================================
    // 3. ACTIVACIÓN CONDUCTUAL (SLIDER & MICRO-GRÁFICO)
    // ============================================================
    function renderBehavioralTasks() {
        const tasks = getStoredTasks();
        const container = document.getElementById('behavioral-tasks-container');
        if (!container) return;

        let completedCount = 0;
        let totalGain = 0;
        let completedWithGains = 0;

        container.innerHTML = tasks.map(task => {
            if (task.state === 'completed') {
                completedCount++;
                const gain = (task.finalEnergy || 0) - (task.initialEnergy || 0);
                totalGain += gain;
                completedWithGains++;

                // Micro-gráfico SVG dinámico
                const svgWidth = 140;
                const svgHeight = 44;
                const y1 = svgHeight - ((task.initialEnergy || 5) / 10 * (svgHeight - 14) + 7);
                const y2 = svgHeight - ((task.finalEnergy || 8) / 10 * (svgHeight - 14) + 7);

                return `
                    <div class="bienestar-card p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-l-4 border-l-emerald-500">
                        <div class="flex items-center gap-3.5 w-full md:w-auto">
                            <span class="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                <span class="material-symbols-outlined text-2xl">${task.icon}</span>
                            </span>
                            <div>
                                <div class="flex items-center gap-2">
                                    <h4 class="text-sm md:text-base font-bold text-[var(--text-glasseffect)] line-through opacity-75">${task.title}</h4>
                                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">Completada</span>
                                </div>
                                <span class="text-xs text-[var(--text-glasseffect)]">${task.category}</span>
                            </div>
                        </div>

                        <!-- Micro-gráfico SVG y Validación de Ánimo -->
                        <div class="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                            <div class="flex items-center gap-3 bg-white/50 dark:bg-slate-800/50 px-3.5 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                                <div class="text-left">
                                    <span class="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Ánimo</span>
                                    <span class="text-xs font-black text-[var(--text-glasseffect)]">${task.initialEnergy} ➜ ${task.finalEnergy}</span>
                                </div>
                                <!-- Gráfico SVG -->
                                <svg width="${svgWidth}" height="${svgHeight}" class="overflow-visible">
                                    <defs>
                                        <linearGradient id="grad_${task.id}" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stop-color="#ef4444" />
                                            <stop offset="50%" stop-color="#f59e0b" />
                                            <stop offset="100%" stop-color="#10b981" />
                                        </linearGradient>
                                    </defs>
                                    <line x1="15" y1="${y1}" x2="${svgWidth - 15}" y2="${y2}" stroke="url(#grad_${task.id})" stroke-width="3" stroke-linecap="round" class="micro-chart-line"/>
                                    <circle cx="15" cy="${y1}" r="4" fill="#ef4444" class="micro-chart-point"/>
                                    <circle cx="${svgWidth - 15}" cy="${y2}" r="5" fill="#10b981" class="micro-chart-point"/>
                                </svg>
                                <span class="px-2 py-0.5 rounded-full text-[11px] font-black ${gain >= 0 ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'}">
                                    ${gain >= 0 ? '+' : ''}${gain} pts
                                </span>
                            </div>

                            <button onclick="window.__resetBehavioralTask('${task.id}')" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" title="Reiniciar tarea">
                                <span class="material-symbols-outlined text-lg">restart_alt</span>
                            </button>
                        </div>
                    </div>
                `;
            } else if (task.state === 'in_progress') {
                return `
                    <div class="bienestar-card p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-l-4 border-l-amber-500 bg-amber-500/5">
                        <div class="flex items-center gap-3.5 w-full md:w-auto">
                            <span class="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 animate-pulse">
                                <span class="material-symbols-outlined text-2xl">${task.icon}</span>
                            </span>
                            <div>
                                <div class="flex items-center gap-2">
                                    <h4 class="text-sm md:text-base font-bold text-[var(--text-glasseffect)]">${task.title}</h4>
                                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">En Progreso</span>
                                </div>
                                <span class="text-xs text-[var(--text-glasseffect)]">Ánimo inicial registrado: <b>${task.initialEnergy}/10</b></span>
                            </div>
                        </div>

                        <button onclick="window.__completeBehavioralTask('${task.id}')" class="w-full md:w-auto px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                            <span class="material-symbols-outlined text-lg">check_circle</span>
                            <span>Terminar y Validar Ánimo</span>
                        </button>
                    </div>
                `;
            } else {
                return `
                    <div class="bienestar-card p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div class="flex items-center gap-3.5 w-full md:w-auto">
                            <span class="w-11 h-11 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                                <span class="material-symbols-outlined text-2xl">${task.icon}</span>
                            </span>
                            <div>
                                <h4 class="text-sm md:text-base font-bold text-[var(--text-glasseffect)]">${task.title}</h4>
                                <span class="text-xs text-[var(--text-glasseffect)]">${task.category}</span>
                            </div>
                        </div>

                        <button onclick="window.__startBehavioralTask('${task.id}')" class="w-full md:w-auto px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                            <span class="material-symbols-outlined text-lg">play_arrow</span>
                            <span>Iniciar Tarea</span>
                        </button>
                    </div>
                `;
            }
        }).join('');

        // Actualizar estadísticas de cabecera
        const statCompleted = document.getElementById('stat-tasks-completed');
        const statGain = document.getElementById('stat-energy-gain');

        if (statCompleted) statCompleted.textContent = `${completedCount} / ${tasks.length}`;
        if (statGain) {
            const avg = completedWithGains > 0 ? (totalGain / completedWithGains).toFixed(1) : '0';
            statGain.textContent = `${Number(avg) >= 0 ? '+' : ''}${avg} pts`;
        }
    }

    window.__startBehavioralTask = function (taskId) {
        const tasks = getStoredTasks();
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        currentTaskForSlider = task;
        sliderEvaluationMode = 'initial';
        openEnergySliderModal('¿Cómo está tu energía/ánimo antes de iniciar?', task.title);
    };

    window.__completeBehavioralTask = function (taskId) {
        const tasks = getStoredTasks();
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        currentTaskForSlider = task;
        sliderEvaluationMode = 'final';
        openEnergySliderModal('¿Cómo sientes tu ánimo después de actuar?', task.title);
    };

    window.__resetBehavioralTask = function (taskId) {
        const tasks = getStoredTasks();
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        task.state = 'pending';
        task.initialEnergy = null;
        task.finalEnergy = null;
        saveStoredTasks(tasks);
        renderBehavioralTasks();
    };

    function openEnergySliderModal(title, taskName) {
        const modal = document.getElementById('modal-energy-slider');
        const titleEl = document.getElementById('slider-modal-title');
        const taskNameEl = document.getElementById('slider-modal-task-name');
        const rangeInput = document.getElementById('energy-range-input');

        if (!modal) return;

        if (titleEl) titleEl.textContent = title;
        if (taskNameEl) taskNameEl.textContent = `Tarea: ${taskName}`;
        if (rangeInput) {
            rangeInput.value = (sliderEvaluationMode === 'initial') ? 4 : 7;
            updateSliderValueUI(rangeInput.value);
        }

        modal.classList.remove('hidden');
        requestAnimationFrame(() => {
            modal.classList.remove('opacity-0');
            modal.classList.add('opacity-100');
        });
    }

    function closeEnergySliderModal() {
        const modal = document.getElementById('modal-energy-slider');
        if (!modal) return;

        modal.classList.add('opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 250);
    }

    function updateSliderValueUI(val) {
        const display = document.getElementById('slider-value-display');
        const emoji = document.getElementById('slider-emoji-preview');
        const label = document.getElementById('slider-feeling-label');

        const num = Number(val);
        if (display) display.textContent = `${num} / 10`;

        let emojiChar = '😐';
        let labelText = 'Energía moderada';

        if (num <= 2) {
            emojiChar = '😫';
            labelText = 'Agotado/a / Sin fuerzas';
        } else if (num <= 4) {
            emojiChar = '😕';
            labelText = 'Ánimo bajo / Con pesadez';
        } else if (num <= 6) {
            emojiChar = '😐';
            labelText = 'Energía neutra / En equilibrio';
        } else if (num <= 8) {
            emojiChar = '🙂';
            labelText = 'Buen ánimo / Motivación activa';
        } else {
            emojiChar = '🤩';
            labelText = 'Vitalidad plena / Gran energía';
        }

        if (emoji) emoji.textContent = emojiChar;
        if (label) label.textContent = labelText;
    }

    function handleConfirmEnergySlider() {
        if (!currentTaskForSlider) return;

        const rangeInput = document.getElementById('energy-range-input');
        const val = Number(rangeInput ? rangeInput.value : 5);

        const tasks = getStoredTasks();
        const task = tasks.find(t => t.id === currentTaskForSlider.id);
        if (!task) return;

        if (sliderEvaluationMode === 'initial') {
            task.initialEnergy = val;
            task.state = 'in_progress';
        } else {
            task.finalEnergy = val;
            task.state = 'completed';
        }

        saveStoredTasks(tasks);
        closeEnergySliderModal();
        renderBehavioralTasks();
    }

    // ============================================================
    // 4. RELAJACIÓN MUSCULAR PROGRESIVA (JACOBSON)
    // ============================================================
    const JACOBSON_ZONES = [
        {
            id: 'feet',
            name: 'Pies',
            badge: 'Zona 1/8: Pies y Dedos',
            tensionTitle: 'Pies y Dedos de los Pies',
            tensionInstruction: 'Curva los dedos de los pies hacia abajo con fuerza y tensa las plantas como si agarraras el suelo. Mantén la tensión firme.',
            relaxationTitle: 'Pies y Dedos de los Pies',
            relaxationInstruction: 'Suelta de golpe. Deja caer los pies completamente sueltos hacia afuera y siente la calidez del flujo sanguíneo.'
        },
        {
            id: 'calves',
            name: 'Pantorrillas',
            badge: 'Zona 2/8: Pantorrillas y Gemelos',
            tensionTitle: 'Pantorrillas y Gemelos',
            tensionInstruction: 'Apunta los dedos de los pies hacia tu cabeza y tensa con firmeza ambos gemelos sintiendo la tirantez muscular.',
            relaxationInstruction: 'Suelta toda la tensión. Siente cómo los músculos se ablandan y reposan pesados sobre el soporte.'
        },
        {
            id: 'thighs',
            name: 'Muslos',
            badge: 'Zona 3/8: Muslos y Glúteos',
            tensionTitle: 'Muslos y Glúteos',
            tensionInstruction: 'Presiona los muslos hacia abajo y aprieta los glúteos contra el asiento con intensidad sin despegarte.',
            relaxationInstruction: 'Relaja por completo. Deja que tus piernas se hundan con pesadez agradable y suelta toda rigidez.'
        },
        {
            id: 'abdomen',
            name: 'Abdomen',
            badge: 'Zona 4/8: Abdomen y Core',
            tensionTitle: 'Abdomen y Zona Lumbar',
            tensionInstruction: 'Mete y aprieta el abdomen con fuerza, contrayendo la pared abdominal como un escudo protector.',
            relaxationInstruction: 'Suelta el abdomen totalmente. Deja que el vientre se expanda suave con cada respiración natural.'
        },
        {
            id: 'chest',
            name: 'Pecho',
            badge: 'Zona 5/8: Pecho y Espalda',
            tensionTitle: 'Pecho, Pectorales y Espalda',
            tensionInstruction: 'Inhala hondo, junta los omóplatos hacia atrás y tensa la musculatura dorsal y pectoral.',
            relaxationInstruction: 'Exhala largo y suelta la espalda. Siente la amplitud, ligereza y desahogo en tu caja torácica.'
        },
        {
            id: 'arms',
            name: 'Brazos',
            badge: 'Zona 6/8: Manos y Brazos',
            tensionTitle: 'Manos, Puños y Brazos',
            tensionInstruction: 'Cierra los puños con fuerza y flexiona los bíceps apretando los antebrazos contra tu pecho.',
            relaxationInstruction: 'Abre las manos y suelta los brazos a los lados. Nota un placentero hormigueo de descanso en las palmas.'
        },
        {
            id: 'shoulders',
            name: 'Hombros',
            badge: 'Zona 7/8: Hombros y Cuello',
            tensionTitle: 'Hombros, Trapecios y Cuello',
            tensionInstruction: 'Eleva los hombros hasta casi tocar las orejas y tensa el cuello con fuerza controlada.',
            relaxationInstruction: 'Baja los hombros de golpe. Siente el alivio inmediato y cómo desaparece toda la carga acumulada.'
        },
        {
            id: 'face',
            name: 'Rostro',
            badge: 'Zona 8/8: Rostro y Mandíbula',
            tensionTitle: 'Frente, Ojos y Mandíbula',
            tensionInstruction: 'Arruga la frente, aprieta los párpados fuertemente y junta los dientes con firmeza sin lastimarte.',
            relaxationInstruction: 'Suelta la mandíbula, deja la boca entreabierta y la frente lisa. Permite que toda tu expresión descanse.'
        }
    ];

    let jacobsonActiveZoneIndex = 0;
    let jacobsonCurrentPhase = 'tension'; // 'tension' | 'relaxation' | 'completed'
    let jacobsonSecondsLeft = 5;
    let jacobsonIsRunning = false;
    let jacobsonInterval = null;
    let jacobsonSoundEnabled = true;
    let jacobsonTimingMode = 'standard'; // 'standard' (5s/30s) o 'fast' (4s/8s)
    let jacobsonAudioCtx = null;

    function getJacobsonPhaseDuration(phase) {
        if (jacobsonTimingMode === 'fast') {
            return (phase === 'tension') ? 4 : 8;
        }
        return (phase === 'tension') ? 5 : 30;
    }

    function playJacobsonChime(type) {
        if (!jacobsonSoundEnabled) return;
        try {
            const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtxClass) return;
            if (!jacobsonAudioCtx) jacobsonAudioCtx = new AudioCtxClass();
            if (jacobsonAudioCtx.state === 'suspended') jacobsonAudioCtx.resume();

            const now = jacobsonAudioCtx.currentTime;
            const osc = jacobsonAudioCtx.createOscillator();
            const gain = jacobsonAudioCtx.createGain();
            osc.connect(gain);
            gain.connect(jacobsonAudioCtx.destination);

            if (type === 'tension') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(330, now);
                osc.frequency.exponentialRampToValueAtTime(440, now + 0.16);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
                osc.start(now);
                osc.stop(now + 0.25);
            } else if (type === 'relaxation') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(528, now);
                osc.frequency.exponentialRampToValueAtTime(396, now + 0.35);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
                osc.start(now);
                osc.stop(now + 0.5);
            }
        } catch (e) {
            // Audio no disponible o silenciado
        }
    }

    function renderJacobsonStepper() {
        const stepperContainer = document.getElementById('jacobson-zones-stepper');
        if (!stepperContainer) return;

        stepperContainer.innerHTML = JACOBSON_ZONES.map((zone, idx) => {
            let statusClass = 'bg-slate-200/60 dark:bg-slate-800/60 text-slate-500 border border-transparent';
            if (idx === jacobsonActiveZoneIndex) {
                statusClass = 'active bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border-2 border-cyan-500 font-black';
            } else if (idx < jacobsonActiveZoneIndex) {
                statusClass = 'completed bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 font-bold';
            }
            return `
                <button onclick="window.__selectJacobsonZone(${idx})" class="jacobson-step-pill py-1.5 px-1 rounded-xl text-[10px] text-center truncate ${statusClass}" title="${zone.badge}">
                    ${idx + 1}
                </button>
            `;
        }).join('');
    }

    function updateJacobsonUI() {
        const zone = JACOBSON_ZONES[jacobsonActiveZoneIndex];
        if (!zone) {
            renderJacobsonCompletionUI();
            return;
        }

        const isTension = (jacobsonCurrentPhase === 'tension');
        const phaseDuration = getJacobsonPhaseDuration(jacobsonCurrentPhase);

        // Elementos UI
        const badgeIcon = document.getElementById('jacobson-phase-badge-icon');
        const zoneBadge = document.getElementById('jacobson-zone-badge');
        const phaseIndicatorText = document.getElementById('jacobson-phase-indicator-text');
        const timerRing = document.getElementById('jacobson-timer-ring');
        const secondsText = document.getElementById('jacobson-seconds-text');
        const actionPill = document.getElementById('jacobson-action-pill');
        const actionDot = document.getElementById('jacobson-action-dot');
        const actionTitle = document.getElementById('jacobson-action-title');
        const zoneTitle = document.getElementById('jacobson-zone-title');
        const instructionText = document.getElementById('jacobson-instruction-text');
        const stepCounter = document.getElementById('jacobson-step-counter');
        const playIcon = document.getElementById('jacobson-play-icon');
        const playText = document.getElementById('jacobson-play-text');
        const bodyGlow = document.getElementById('jacobson-body-glow');

        if (zoneBadge) zoneBadge.textContent = zone.badge;
        if (zoneTitle) zoneTitle.textContent = isTension ? zone.tensionTitle : zone.relaxationTitle;
        if (instructionText) instructionText.textContent = isTension ? zone.tensionInstruction : zone.relaxationInstruction;
        if (stepCounter) stepCounter.textContent = `Zona ${jacobsonActiveZoneIndex + 1} de ${JACOBSON_ZONES.length}`;
        if (secondsText) secondsText.textContent = jacobsonSecondsLeft;

        // Círculo SVG animado
        if (timerRing) {
            const circumference = 314.159;
            const progressRatio = Math.max(0, jacobsonSecondsLeft / phaseDuration);
            const offset = circumference - (circumference * progressRatio);
            timerRing.style.strokeDashoffset = offset;

            if (isTension) {
                timerRing.setAttribute('class', 'transition-all duration-300 text-orange-500');
            } else {
                timerRing.setAttribute('class', 'transition-all duration-300 text-emerald-500');
            }
        }

        // Colores y Estados
        if (isTension) {
            if (badgeIcon) badgeIcon.className = 'w-8 h-8 rounded-full bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0';
            if (phaseIndicatorText) {
                phaseIndicatorText.className = 'text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider';
                phaseIndicatorText.textContent = `Fase de Tensión (${getJacobsonPhaseDuration('tension')}s)`;
            }
            if (actionPill) actionPill.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider transition-colors duration-500 bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30';
            if (actionDot) actionDot.className = 'w-2 h-2 rounded-full bg-orange-500 animate-ping';
            if (actionTitle) actionTitle.textContent = 'Tensa con fuerza';
            if (bodyGlow) bodyGlow.className = 'absolute w-48 h-48 rounded-full blur-3xl opacity-30 transition-all duration-700 pointer-events-none bg-orange-500';
        } else {
            if (badgeIcon) badgeIcon.className = 'w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0';
            if (phaseIndicatorText) {
                phaseIndicatorText.className = 'text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider';
                phaseIndicatorText.textContent = `Fase de Relajación (${getJacobsonPhaseDuration('relaxation')}s)`;
            }
            if (actionPill) actionPill.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider transition-colors duration-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30';
            if (actionDot) actionDot.className = 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse';
            if (actionTitle) actionTitle.textContent = 'Suelta y relaja';
            if (bodyGlow) bodyGlow.className = 'absolute w-48 h-48 rounded-full blur-3xl opacity-30 transition-all duration-700 pointer-events-none bg-emerald-500';
        }

        // Play/Pause botón
        if (playIcon) playIcon.textContent = jacobsonIsRunning ? 'pause' : 'play_arrow';
        if (playText) playText.textContent = jacobsonIsRunning ? 'Pausar' : 'Continuar';

        // Actualizar partes del mapa corporal SVG
        updateJacobsonBodyMap();
        renderJacobsonStepper();
    }

    function updateJacobsonBodyMap() {
        const svg = document.getElementById('jacobson-body-svg');
        if (!svg) return;

        const allParts = svg.querySelectorAll('.jacobson-body-part');
        const activeZone = JACOBSON_ZONES[jacobsonActiveZoneIndex];

        allParts.forEach(part => {
            part.classList.remove('tension', 'relaxation', 'completed');
            const zoneId = part.getAttribute('data-zone-id');
            const zoneIdx = JACOBSON_ZONES.findIndex(z => z.id === zoneId);

            if (activeZone && zoneId === activeZone.id) {
                if (jacobsonCurrentPhase === 'tension') {
                    part.classList.add('tension');
                } else {
                    part.classList.add('relaxation');
                }
            } else if (zoneIdx !== -1 && zoneIdx < jacobsonActiveZoneIndex) {
                part.classList.add('completed');
            }
        });
    }

    function tickJacobson() {
        jacobsonSecondsLeft--;

        if (jacobsonSecondsLeft <= 0) {
            if (jacobsonCurrentPhase === 'tension') {
                // Pasar a relajación
                jacobsonCurrentPhase = 'relaxation';
                jacobsonSecondsLeft = getJacobsonPhaseDuration('relaxation');
                playJacobsonChime('relaxation');
                if (navigator.vibrate) navigator.vibrate([60, 40, 80]);
            } else if (jacobsonCurrentPhase === 'relaxation') {
                // Pasar a la siguiente zona
                jacobsonActiveZoneIndex++;
                if (jacobsonActiveZoneIndex < JACOBSON_ZONES.length) {
                    jacobsonCurrentPhase = 'tension';
                    jacobsonSecondsLeft = getJacobsonPhaseDuration('tension');
                    playJacobsonChime('tension');
                    if (navigator.vibrate) navigator.vibrate(50);
                } else {
                    // Protocolo completo
                    jacobsonCurrentPhase = 'completed';
                    pauseJacobson();
                    renderJacobsonCompletionUI();
                    return;
                }
            }
        }

        updateJacobsonUI();
    }

    function startJacobson() {
        if (jacobsonIsRunning) return;
        jacobsonIsRunning = true;
        if (jacobsonCurrentPhase === 'completed') {
            resetJacobson();
            jacobsonIsRunning = true;
        }
        clearInterval(jacobsonInterval);
        jacobsonInterval = setInterval(tickJacobson, 1000);
        playJacobsonChime(jacobsonCurrentPhase);
        updateJacobsonUI();
    }

    function pauseJacobson() {
        jacobsonIsRunning = false;
        clearInterval(jacobsonInterval);
        updateJacobsonUI();
    }

    function resetJacobson() {
        pauseJacobson();
        jacobsonActiveZoneIndex = 0;
        jacobsonCurrentPhase = 'tension';
        jacobsonSecondsLeft = getJacobsonPhaseDuration('tension');
        updateJacobsonUI();
    }

    function skipJacobsonNext() {
        pauseJacobson();
        if (jacobsonActiveZoneIndex < JACOBSON_ZONES.length - 1) {
            jacobsonActiveZoneIndex++;
        }
        jacobsonCurrentPhase = 'tension';
        jacobsonSecondsLeft = getJacobsonPhaseDuration('tension');
        updateJacobsonUI();
    }

    function skipJacobsonPrev() {
        pauseJacobson();
        if (jacobsonActiveZoneIndex > 0) {
            jacobsonActiveZoneIndex--;
        }
        jacobsonCurrentPhase = 'tension';
        jacobsonSecondsLeft = getJacobsonPhaseDuration('tension');
        updateJacobsonUI();
    }

    function selectJacobsonZone(index) {
        if (index < 0 || index >= JACOBSON_ZONES.length) return;
        pauseJacobson();
        jacobsonActiveZoneIndex = index;
        jacobsonCurrentPhase = 'tension';
        jacobsonSecondsLeft = getJacobsonPhaseDuration('tension');
        updateJacobsonUI();
    }

    window.__selectJacobsonZone = selectJacobsonZone;
    window.__pauseJacobson = pauseJacobson;

    function renderJacobsonCompletionUI() {
        const svg = document.getElementById('jacobson-body-svg');
        if (svg) {
            svg.querySelectorAll('.jacobson-body-part').forEach(p => {
                p.classList.remove('tension');
                p.classList.add('relaxation');
            });
        }

        const zoneTitle = document.getElementById('jacobson-zone-title');
        const instructionText = document.getElementById('jacobson-instruction-text');
        const actionTitle = document.getElementById('jacobson-action-title');
        const actionPill = document.getElementById('jacobson-action-pill');
        const secondsText = document.getElementById('jacobson-seconds-text');

        if (actionTitle) actionTitle.textContent = 'Cuerpo Plenamente Relajado';
        if (actionPill) actionPill.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40';
        if (zoneTitle) zoneTitle.textContent = '¡Ciclo de Jacobson Completado!';
        if (instructionText) {
            instructionText.textContent = 'Has liberado la tensión de los 8 grupos musculares principales. Permanece inmóvil un par de minutos, disfrutando la profunda calma física y mental alcanzada.';
        }
        if (secondsText) secondsText.textContent = '✓';

        renderJacobsonStepper();
    }

    // ============================================================
    // 5. CONSOLIDACIÓN DE REDES DE APOYO (CONEXIÓN RÁPIDA)
    // ============================================================
    function renderAnchorsGrid() {
        const anchors = getStoredAnchors();
        const container = document.getElementById('anchors-grid-container');
        if (!container) return;

        if (anchors.length === 0) {
            container.innerHTML = `
                <div class="col-span-full bienestar-card p-6 text-center text-xs text-[var(--text-glasseffect)]">
                    No has registrado anclas aún. Agrega a tus personas de confianza para tenerlas a un solo toque.
                </div>
            `;
            return;
        }

        const activeMsgInput = document.getElementById('active-support-message-input');
        const activeMessage = activeMsgInput ? activeMsgInput.value : 'No me siento muy bien, ¿tienes 5 minutos para hablar?';

        container.innerHTML = anchors.map(anchor => {
            const cleanPhone = anchor.phone.replace(/[^0-9]/g, '');
            const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(activeMessage)}`;
            const mailUrl = anchor.email ? `mailto:${anchor.email}?subject=${encodeURIComponent('Necesito hablar')}&body=${encodeURIComponent(activeMessage)}` : null;
            const telUrl = `tel:${cleanPhone}`;

            return `
                <div class="anchor-contact-card p-5 flex flex-col justify-between space-y-4 shadow-sm">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-black text-base flex items-center justify-center shadow-md">
                                ${anchor.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h4 class="text-sm font-bold text-[var(--text-glasseffect)]">${anchor.name}</h4>
                                <span class="text-xs text-purple-600 dark:text-purple-400 font-medium">${anchor.relationship}</span>
                            </div>
                        </div>

                        <button onclick="window.__deleteAnchorContact('${anchor.id}')" class="text-slate-400 hover:text-rose-500 transition-colors p-1" title="Eliminar ancla">
                            <span class="material-symbols-outlined text-base">close</span>
                        </button>
                    </div>

                    <div class="space-y-1 text-xs text-[var(--text-glasseffect)] font-mono">
                        <div class="flex items-center gap-1.5"><span class="material-symbols-outlined text-sm">phone</span> ${anchor.phone}</div>
                        ${anchor.email ? `<div class="flex items-center gap-1.5 truncate"><span class="material-symbols-outlined text-sm">mail</span> ${anchor.email}</div>` : ''}
                    </div>

                    <!-- Botones de Conexión Rápida con API de Mensajería -->
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                        <!-- WhatsApp -->
                        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-action py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-transform cursor-pointer" title="Enviar WhatsApp con mensaje de apoyo">
                            <i class="ri-whatsapp-fill text-base"></i>
                            <span>WhatsApp</span>
                        </a>

                        <!-- Llamada Directa -->
                        <a href="${telUrl}" class="btn-call-action py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-transform cursor-pointer" title="Llamar directamente">
                            <span class="material-symbols-outlined text-base">call</span>
                            <span>Llamar</span>
                        </a>

                        <!-- Correo Electrónico (si existe) -->
                        ${anchor.email ? `
                            <a href="${mailUrl}" class="col-span-2 sm:col-span-1 py-2 px-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600 text-xs font-bold flex items-center justify-center gap-1 transition-transform cursor-pointer" title="Enviar Correo">
                                <span class="material-symbols-outlined text-base">mail</span>
                                <span>Correo</span>
                            </a>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    window.__deleteAnchorContact = function (id) {
        const anchors = getStoredAnchors();
        const filtered = anchors.filter(a => a.id !== id);
        saveStoredAnchors(filtered);
        renderAnchorsGrid();
    };

    // ============================================================
    // INICIALIZACIÓN Y ENLACE DE EVENTOS
    // ============================================================
    function setupEventListeners() {
        // 1. Anclaje Sensorial
        const btnOpenHero = document.getElementById('btn-open-grounding-hero');
        const btnStartModal = document.getElementById('btn-start-grounding-modal');
        const btnCloseGrounding = document.getElementById('btn-close-grounding');
        const groundingModal = document.getElementById('grounding-modal');

        if (btnOpenHero) btnOpenHero.addEventListener('click', openGroundingModal);
        if (btnStartModal) btnStartModal.addEventListener('click', openGroundingModal);
        if (btnCloseGrounding) btnCloseGrounding.addEventListener('click', closeGroundingModal);
        if (groundingModal) groundingModal.addEventListener('click', handleGroundingTap);

        // 2. La Bóveda
        const btnSaveThought = document.getElementById('btn-save-thought');
        const btnOpenVaultConfig = document.getElementById('btn-open-vault-config');
        const btnCloseVaultConfig = document.getElementById('btn-close-vault-config');
        const modalVaultConfig = document.getElementById('modal-vault-config');
        const btnSaveVaultTime = document.getElementById('btn-save-vault-time');
        const btnToggleTestUnlock = document.getElementById('btn-toggle-test-unlock');
        const btnClearTodayVault = document.getElementById('btn-clear-today-vault');

        if (btnSaveThought) btnSaveThought.addEventListener('click', handleSaveThought);

        // Etiquetas emocionales
        document.querySelectorAll('.vault-tag-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                document.querySelectorAll('.vault-tag-pill').forEach(p => {
                    p.classList.remove('active', 'bg-indigo-500', 'text-white');
                    p.classList.add('bg-slate-200', 'dark:bg-slate-700', 'text-slate-600', 'dark:text-slate-300');
                });
                pill.classList.add('active', 'bg-indigo-500', 'text-white');
                pill.classList.remove('bg-slate-200', 'dark:bg-slate-700', 'text-slate-600', 'dark:text-slate-300');
                selectedVaultTag = pill.getAttribute('data-tag') || 'Catastrofismo';
            });
        });

        if (btnOpenVaultConfig && modalVaultConfig) {
            btnOpenVaultConfig.addEventListener('click', () => {
                const settings = getVaultSettings();
                const startInput = document.getElementById('vault-time-start');
                const endInput = document.getElementById('vault-time-end');
                if (startInput) startInput.value = settings.startTime;
                if (endInput) endInput.value = settings.endTime;

                modalVaultConfig.classList.remove('hidden');
                requestAnimationFrame(() => {
                    modalVaultConfig.classList.remove('opacity-0');
                    modalVaultConfig.classList.add('opacity-100');
                });
            });
        }

        if (btnCloseVaultConfig && modalVaultConfig) {
            btnCloseVaultConfig.addEventListener('click', () => {
                modalVaultConfig.classList.add('opacity-0');
                setTimeout(() => modalVaultConfig.classList.add('hidden'), 250);
            });
        }

        if (btnSaveVaultTime && modalVaultConfig) {
            btnSaveVaultTime.addEventListener('click', () => {
                const startInput = document.getElementById('vault-time-start');
                const endInput = document.getElementById('vault-time-end');
                saveVaultSettings({
                    startTime: startInput ? startInput.value : '19:00',
                    endTime: endInput ? endInput.value : '19:30'
                });
                modalVaultConfig.classList.add('opacity-0');
                setTimeout(() => modalVaultConfig.classList.add('hidden'), 250);
                updateVaultStatusUI();
            });
        }

        if (btnToggleTestUnlock) {
            btnToggleTestUnlock.addEventListener('click', () => {
                isVaultTestUnlocked = !isVaultTestUnlocked;
                updateVaultStatusUI();
            });
        }

        if (btnClearTodayVault) {
            btnClearTodayVault.addEventListener('click', () => {
                if (confirm('¿Deseas vaciar los pensamientos registrados hoy?')) {
                    saveStoredThoughts([]);
                    renderVaultThoughtsList();
                }
            });
        }

        // 3. Activación Conductual
        const rangeInput = document.getElementById('energy-range-input');
        if (rangeInput) {
            rangeInput.addEventListener('input', (e) => {
                updateSliderValueUI(e.target.value);
            });
        }

        const btnCancelSlider = document.getElementById('btn-cancel-energy-slider');
        const btnConfirmSlider = document.getElementById('btn-confirm-energy-slider');
        if (btnCancelSlider) btnCancelSlider.addEventListener('click', closeEnergySliderModal);
        if (btnConfirmSlider) btnConfirmSlider.addEventListener('click', handleConfirmEnergySlider);

        // Añadir nueva tarea personalizada
        const btnAddCustomTask = document.getElementById('btn-add-custom-task');
        if (btnAddCustomTask) {
            btnAddCustomTask.addEventListener('click', () => {
                const title = prompt('Ingresa el nombre de tu tarea de autocuidado:');
                if (title && title.trim()) {
                    const tasks = getStoredTasks();
                    tasks.push({
                        id: 'custom_task_' + Date.now(),
                        title: title.trim(),
                        category: 'Autocuidado Personal',
                        icon: 'star',
                        color: 'amber',
                        state: 'pending',
                        initialEnergy: null,
                        finalEnergy: null
                    });
                    saveStoredTasks(tasks);
                    renderBehavioralTasks();
                }
            });
        }

        // 4. Relajación Muscular Progresiva (Jacobson)
        const btnJacobsonPlay = document.getElementById('btn-jacobson-play');
        const btnJacobsonReset = document.getElementById('btn-jacobson-reset');
        const btnJacobsonNext = document.getElementById('btn-jacobson-next');
        const btnJacobsonPrev = document.getElementById('btn-jacobson-prev');
        const btnJacobsonModeStd = document.getElementById('jacobson-mode-standard');
        const btnJacobsonModeFast = document.getElementById('jacobson-mode-fast');
        const btnJacobsonSound = document.getElementById('jacobson-sound-toggle');

        if (btnJacobsonPlay) {
            btnJacobsonPlay.addEventListener('click', () => {
                if (jacobsonIsRunning) pauseJacobson(); else startJacobson();
            });
        }
        if (btnJacobsonReset) btnJacobsonReset.addEventListener('click', resetJacobson);
        if (btnJacobsonNext) btnJacobsonNext.addEventListener('click', skipJacobsonNext);
        if (btnJacobsonPrev) btnJacobsonPrev.addEventListener('click', skipJacobsonPrev);

        if (btnJacobsonModeStd && btnJacobsonModeFast) {
            btnJacobsonModeStd.addEventListener('click', () => {
                jacobsonTimingMode = 'standard';
                btnJacobsonModeStd.className = 'jacobson-mode-btn active px-3 py-1.5 rounded-full text-xs font-bold bg-cyan-500 text-white shadow-sm transition-all';
                btnJacobsonModeFast.className = 'jacobson-mode-btn px-3 py-1.5 rounded-full text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all';
                resetJacobson();
            });

            btnJacobsonModeFast.addEventListener('click', () => {
                jacobsonTimingMode = 'fast';
                btnJacobsonModeFast.className = 'jacobson-mode-btn active px-3 py-1.5 rounded-full text-xs font-bold bg-cyan-500 text-white shadow-sm transition-all';
                btnJacobsonModeStd.className = 'jacobson-mode-btn px-3 py-1.5 rounded-full text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all';
                resetJacobson();
            });
        }

        if (btnJacobsonSound) {
            btnJacobsonSound.addEventListener('click', () => {
                jacobsonSoundEnabled = !jacobsonSoundEnabled;
                const icon = document.getElementById('jacobson-sound-icon');
                if (icon) {
                    icon.textContent = jacobsonSoundEnabled ? 'volume_up' : 'volume_off';
                }
            });
        }

        // Clic interactivo en partes del cuerpo SVG
        document.querySelectorAll('.jacobson-body-part').forEach(part => {
            part.addEventListener('click', () => {
                const zoneId = part.getAttribute('data-zone-id');
                const idx = JACOBSON_ZONES.findIndex(z => z.id === zoneId);
                if (idx !== -1) {
                    selectJacobsonZone(idx);
                }
            });
        });

        // 5. Redes de Apoyo
        document.querySelectorAll('.support-msg-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                document.querySelectorAll('.support-msg-pill').forEach(p => p.classList.remove('selected'));
                pill.classList.add('selected');

                const msg = pill.getAttribute('data-msg');
                const activeInput = document.getElementById('active-support-message-input');
                if (activeInput && msg) {
                    activeInput.value = msg;
                    renderAnchorsGrid();
                }
            });
        });

        const activeMsgInput = document.getElementById('active-support-message-input');
        if (activeMsgInput) {
            activeMsgInput.addEventListener('input', () => {
                renderAnchorsGrid();
            });
        }

        // Modal de Nueva Ancla
        const btnAddAnchorModal = document.getElementById('btn-add-anchor-modal');
        const btnCloseAnchorModal = document.getElementById('btn-close-anchor-modal');
        const modalAddAnchor = document.getElementById('modal-add-anchor');
        const formNewAnchor = document.getElementById('form-new-anchor');

        if (btnAddAnchorModal && modalAddAnchor) {
            btnAddAnchorModal.addEventListener('click', () => {
                modalAddAnchor.classList.remove('hidden');
                requestAnimationFrame(() => {
                    modalAddAnchor.classList.remove('opacity-0');
                    modalAddAnchor.classList.add('opacity-100');
                });
            });
        }

        if (btnCloseAnchorModal && modalAddAnchor) {
            btnCloseAnchorModal.addEventListener('click', () => {
                modalAddAnchor.classList.add('opacity-0');
                setTimeout(() => modalAddAnchor.classList.add('hidden'), 250);
            });
        }

        if (formNewAnchor && modalAddAnchor) {
            formNewAnchor.addEventListener('submit', (e) => {
                e.preventDefault();
                const nameInput = document.getElementById('anchor-name-input');
                const relSelect = document.getElementById('anchor-relationship-select');
                const phoneInput = document.getElementById('anchor-phone-input');
                const emailInput = document.getElementById('anchor-email-input');

                const newAnchor = {
                    id: 'anchor_' + Date.now(),
                    name: nameInput ? nameInput.value.trim() : 'Contacto',
                    relationship: relSelect ? relSelect.value : 'Amigo/a',
                    phone: phoneInput ? phoneInput.value.trim() : '',
                    email: emailInput ? emailInput.value.trim() : ''
                };

                const anchors = getStoredAnchors();
                anchors.push(newAnchor);
                saveStoredAnchors(anchors);

                formNewAnchor.reset();
                modalAddAnchor.classList.add('opacity-0');
                setTimeout(() => modalAddAnchor.classList.add('hidden'), 250);

                renderAnchorsGrid();
            });
        }
    }

    // ============================================================
    // 0. INTERFAZ Y CHATBOT ASISTENTE VENUS
    // ============================================================
    let venusToastTimeout = null;

    function showVenusToast(message) {
        const toast = document.getElementById('venus-free-chat-toast');
        const toastText = document.getElementById('venus-toast-text');
        if (!toast) return;

        if (toastText && message) {
            toastText.textContent = message;
        }

        if (venusToastTimeout) {
            clearTimeout(venusToastTimeout);
        }

        toast.classList.remove('hidden');
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, 10px)';
        toast.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translate(-50%, 0)';
        });

        venusToastTimeout = setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translate(-50%, 10px)';
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 300);
        }, 3500);
    }

    function scrollVenusChatToBottom() {
        const scrollArea = document.getElementById('venus-chat-scroll-area');
        if (scrollArea) {
            scrollArea.scrollTo({
                top: scrollArea.scrollHeight,
                behavior: 'smooth'
            });
        }
    }

    function addVenusUserMessage(text) {
        const container = document.getElementById('venus-messages-container');
        if (!container) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = 'flex justify-end venus-message-enter';
        msgDiv.innerHTML = `
            <div class="venus-msg-bubble-user max-w-[85%] md:max-w-[70%] p-3.5 md:p-4 px-5 text-xs md:text-sm font-medium shadow-md leading-relaxed">
                ${escapeHtml(text)}
            </div>
        `;
        container.appendChild(msgDiv);
        scrollVenusChatToBottom();
    }

    function showVenusTypingIndicator() {
        const container = document.getElementById('venus-messages-container');
        if (!container) return;

        const typingDiv = document.createElement('div');
        typingDiv.id = 'venus-typing-indicator-row';
        typingDiv.className = 'flex items-start gap-3 venus-message-enter';
        typingDiv.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-500 flex items-center justify-center shrink-0 mt-1 shadow-sm overflow-hidden">
                <img src="venus_robot.png" alt="Venus" class="w-6 h-6 object-contain">
            </div>
            <div class="venus-msg-bubble-bot p-2 px-4 shadow-md">
                <div class="venus-typing-indicator">
                    <span class="venus-typing-dot"></span>
                    <span class="venus-typing-dot"></span>
                    <span class="venus-typing-dot"></span>
                </div>
            </div>
        `;
        container.appendChild(typingDiv);
        scrollVenusChatToBottom();
    }

    function removeVenusTypingIndicator() {
        const indicator = document.getElementById('venus-typing-indicator-row');
        if (indicator) {
            indicator.remove();
        }
    }

    function addVenusBotMessage(htmlContent) {
        const container = document.getElementById('venus-messages-container');
        if (!container) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = 'flex items-start gap-3 venus-message-enter';
        msgDiv.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-500 flex items-center justify-center shrink-0 mt-1 shadow-sm overflow-hidden">
                <img src="venus_robot.png" alt="Venus" class="w-6 h-6 object-contain">
            </div>
            <div class="venus-msg-bubble-bot max-w-[90%] md:max-w-[80%] p-4 md:p-5 text-xs md:text-sm text-slate-800 dark:text-slate-100 shadow-md space-y-3">
                ${htmlContent}
            </div>
        `;
        container.appendChild(msgDiv);
        scrollVenusChatToBottom();
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function handleVenusPromptClick(promptId, promptText) {
        const welcomeView = document.getElementById('venus-welcome-view');
        const threadView = document.getElementById('venus-thread-view');

        if (welcomeView) welcomeView.classList.add('hidden');
        if (threadView) threadView.classList.remove('hidden');

        // Mostrar mensaje del usuario
        addVenusUserMessage(promptText);

        // Mostrar indicador de typing
        showVenusTypingIndicator();

        setTimeout(() => {
            removeVenusTypingIndicator();

            if (promptId === 'estres_ansiedad') {
                // Desplegar la respuesta dentro del chat con los módulos integrados
                const botHtml = `
                    <p class="font-bold text-[var(--black-color)] text-sm md:text-base">
                        Entiendo perfectamente cómo te sientes. 💙
                    </p>
                    <p class="text-xs md:text-sm text-[var(--black-color)] leading-relaxed">
                        El estrés y la sobreestimulación son respuestas neurofisiológicas comunes. He desplegado para ti <strong>5 módulos clínicos interactivos directamente dentro de este chat</strong> para acompañarte y regularte somática y cognitivamente:
                    </p>

                    <!-- Píldoras interactivas de selección rápida dentro del chat -->
                    <div class="flex flex-wrap gap-1.5 pt-2">
                        <button type="button" onclick="window.filterVenusModules('all')" class="venus-module-quick-pill active" data-mod="all">
                            ✨ Ver todos
                        </button>
                        <button type="button" onclick="window.filterVenusModules('seccion-anclaje')" class="venus-module-quick-pill" data-mod="seccion-anclaje">
                            👁️ 1. Anclaje 5-4-3-2-1
                        </button>
                        <button type="button" onclick="window.filterVenusModules('seccion-boveda')" class="venus-module-quick-pill" data-mod="seccion-boveda">
                            🔐 2. La Bóveda
                        </button>
                        <button type="button" onclick="window.filterVenusModules('seccion-activacion')" class="venus-module-quick-pill" data-mod="seccion-activacion">
                            ⚡ 3. Activación
                        </button>
                        <button type="button" onclick="window.filterVenusModules('seccion-jacobson')" class="venus-module-quick-pill" data-mod="seccion-jacobson">
                            🧘 4. Jacobson
                        </button>
                        <button type="button" onclick="window.filterVenusModules('seccion-redes')" class="venus-module-quick-pill" data-mod="seccion-redes">
                            👥 5. Redes de Apoyo
                        </button>
                    </div>

                    <div class="pt-2 flex items-center gap-2">
                        <button type="button" onclick="window.returnToVenusHome()" class="px-3.5 py-1.5 rounded-full bg-slate-200/80 dark:bg-slate-700/80 hover:bg-slate-300 dark:hover:bg-slate-600 text-[var(--black-color)] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer">
                            <span class="material-symbols-outlined text-sm">arrow_back</span>
                            <span>Menú de opciones</span>
                        </button>
                    </div>
                `;
                addVenusBotMessage(botHtml);

                // Hacer visible la suite de módulos dentro del chat
                const suite = document.getElementById('venus-modules-suite');
                if (suite) {
                    suite.classList.remove('hidden');
                    window.filterVenusModules('all');
                }
            } else {
                // Funciones aún sin función / en desarrollo
                const botHtml = `
                    <div class="space-y-3">
                        <div class="flex items-center gap-2 text-amber-500 font-bold">
                            <span class="material-symbols-outlined text-lg">construction</span>
                            <span>Función en preparación clínica</span>
                        </div>
                        <p class="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            Aún estamos trabajando en este módulo para ofrecerte herramientas y recomendaciones validadas por profesionales de la salud. Estará disponible muy pronto en <strong>Salud Activa Lab</strong>. 💙
                        </p>
                        <div class="pt-1">
                            <button type="button" onclick="window.returnToVenusHome()" class="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 cursor-pointer">
                                <span class="material-symbols-outlined text-sm">arrow_back</span>
                                <span>Elegir otra opción</span>
                            </button>
                        </div>
                    </div>
                `;
                addVenusBotMessage(botHtml);
            }
        }, 400);
    }

    // Funciones globales para navegación y filtrado dentro del chat
    window.filterVenusModules = function(targetId) {
        const suite = document.getElementById('venus-modules-suite');
        if (suite) suite.classList.remove('hidden');

        // Actualizar tabs superiores
        const tabs = document.querySelectorAll('#venus-modules-tab-bar .venus-module-tab');
        tabs.forEach(tab => {
            if (tab.getAttribute('data-target') === targetId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Actualizar píldoras rápidas
        const quickPills = document.querySelectorAll('.venus-module-quick-pill');
        quickPills.forEach(pill => {
            if (pill.getAttribute('data-mod') === targetId) {
                pill.classList.add('active');
            } else {
                pill.classList.remove('active');
            }
        });

        const sections = [
            'seccion-anclaje',
            'seccion-boveda',
            'seccion-activacion',
            'seccion-jacobson',
            'seccion-redes'
        ];

        if (targetId === 'all') {
            sections.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.remove('hidden');
            });
            setTimeout(() => {
                if (suite) {
                    suite.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 50);
        } else {
            sections.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    if (id === targetId) {
                        el.classList.remove('hidden');
                    } else {
                        el.classList.add('hidden');
                    }
                }
            });
            setTimeout(() => {
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 50);
        }
    };

    window.venusJumpToModule = function(moduleId, openModal) {
        window.filterVenusModules(moduleId);
        if (openModal && moduleId === 'seccion-anclaje') {
            setTimeout(() => {
                openGroundingModal();
            }, 300);
        }
    };

    window.venusShowAllModules = function() {
        window.filterVenusModules('all');
    };

    window.returnToVenusHome = function() {
        const welcomeView = document.getElementById('venus-welcome-view');
        const threadView = document.getElementById('venus-thread-view');
        const container = document.getElementById('venus-messages-container');
        const suite = document.getElementById('venus-modules-suite');

        if (container) container.innerHTML = '';
        if (threadView) threadView.classList.add('hidden');
        if (welcomeView) welcomeView.classList.remove('hidden');
        if (suite) suite.classList.add('hidden');

        // Restaurar estado activo en sidebar
        const navInicio = document.getElementById('venus-nav-inicio');
        const navItems = document.querySelectorAll('.venus-nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        if (navInicio) navInicio.classList.add('active');

        // Scroll suave al inicio del área de chat
        const scrollArea = document.getElementById('venus-chat-scroll-area');
        if (scrollArea) {
            scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Funciones de Traffic Lights de macOS
    function exitVenusChat() {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        }
        const heroBanner = document.getElementById('Inicio') || document.querySelector('.hero-banner');
        const medals = document.getElementById('medals-container');
        const headerMenu = document.getElementById('header-menu');
        if (heroBanner) heroBanner.style.display = '';
        if (medals) medals.style.display = '';
        if (headerMenu) headerMenu.style.display = '';

        if (window.SPA && typeof window.SPA.navigateTo === 'function') {
            window.SPA.navigateTo('embriologia');
        } else {
            window.returnToVenusHome();
        }
    }
    window.exitVenusChat = exitVenusChat;

    function minimizeVenusChat() {
        window.returnToVenusHome();
        showVenusToast('Chat minimizado al menú de inicio de Venus.');
    }
    window.minimizeVenusChat = minimizeVenusChat;

    function toggleVenusFullscreen() {
        if (!document.fullscreenElement) {
            const root = document.getElementById('bienestar-root') || document.documentElement;
            if (root.requestFullscreen) {
                root.requestFullscreen().catch(() => {});
            } else if (root.webkitRequestFullscreen) {
                root.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }
    window.toggleVenusFullscreen = toggleVenusFullscreen;

    function setupVenusChat() {
        const btnToggleMenu = document.getElementById('btn-venus-menu-toggle');
        const btnCloseMenu = document.getElementById('btn-venus-menu-close');
        const sidebar = document.querySelector('.venus-sidebar');
        const overlay = document.getElementById('venus-sidebar-overlay');

        function toggleMobileSidebar() {
            if (sidebar && overlay) {
                sidebar.classList.toggle('sidebar-open');
                overlay.classList.toggle('active');
            }
        }

        if (btnToggleMenu) btnToggleMenu.addEventListener('click', toggleMobileSidebar);
        if (btnCloseMenu) btnCloseMenu.addEventListener('click', toggleMobileSidebar);
        if (overlay) overlay.addEventListener('click', toggleMobileSidebar);

        // Ocultar el menú automáticamente al hacer clic en una opción (solo en móvil)
        const navItemsList = document.querySelectorAll('.venus-nav-item');
        navItemsList.forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth < 768 && sidebar.classList.contains('sidebar-open')) {
                    toggleMobileSidebar();
                }
            });
        });

        // 1. Chips de preguntas predeterminadas
        const chips = document.querySelectorAll('.venus-prompt-chip');
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                const promptId = chip.getAttribute('data-prompt-id');
                const promptText = chip.getAttribute('data-prompt-text') || chip.textContent.trim();
                handleVenusPromptClick(promptId, promptText);
            });
        });

        // 2. Chat libre bloqueado (Formulario e Input)
        const form = document.getElementById('venus-chat-form');
        const input = document.getElementById('venus-text-input');
        const btnAttach = document.getElementById('btn-venus-attach');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                showVenusToast('Aún estamos trabajando en ello. Por favor selecciona una de las opciones sugeridas.');
                if (input) {
                    input.classList.add('ring-2', 'ring-amber-400');
                    setTimeout(() => input.classList.remove('ring-2', 'ring-amber-400'), 1500);
                    input.value = '';
                }
            });
        }

        if (btnAttach) {
            btnAttach.addEventListener('click', () => {
                showVenusToast('Aún estamos trabajando en ello.');
            });
        }

        // 3. Botones de Traffic Lights de macOS
        const trafficClose = document.getElementById('venus-traffic-close');
        const trafficMin = document.getElementById('venus-traffic-minimize');
        const trafficMax = document.getElementById('venus-traffic-maximize');
        const fullscreenIcon = document.getElementById('venus-fullscreen-icon');

        if (trafficClose) trafficClose.addEventListener('click', exitVenusChat);
        if (trafficMin) trafficMin.addEventListener('click', minimizeVenusChat);
        if (trafficMax) trafficMax.addEventListener('click', toggleVenusFullscreen);

        document.addEventListener('fullscreenchange', () => {
            if (fullscreenIcon) {
                if (document.fullscreenElement) {
                    fullscreenIcon.className = 'ri-fullscreen-exit-line traffic-icon';
                    if (trafficMax) trafficMax.title = 'Salir de Pantalla Completa';
                } else {
                    fullscreenIcon.className = 'ri-fullscreen-line traffic-icon';
                    if (trafficMax) trafficMax.title = 'Pantalla Completa';
                }
            }
        });

        // 4. Botones del Sidebar
        const navInicio = document.getElementById('venus-nav-inicio');
        const navHistorial = document.getElementById('venus-nav-historial');
        const navBienestar = document.getElementById('venus-nav-bienestar');
        const navConfig = document.getElementById('venus-nav-config');

        if (navInicio) {
            navInicio.addEventListener('click', () => {
                window.returnToVenusHome();
            });
        }

        if (navBienestar) {
            navBienestar.addEventListener('click', () => {
                const navItems = document.querySelectorAll('.venus-nav-item');
                navItems.forEach(item => item.classList.remove('active'));
                navBienestar.classList.add('active');
                handleVenusPromptClick('estres_ansiedad', 'Necesito ayuda con mi estrés y ansiedad');
            });
        }

        if (navHistorial) {
            navHistorial.addEventListener('click', () => {
                showVenusToast('El historial de conversaciones estará disponible próximamente.');
            });
        }

        if (navConfig) {
            navConfig.addEventListener('click', () => {
                showVenusToast('Las opciones de configuración estarán disponibles próximamente.');
            });
        }
    }

    // ============================================================
    // BOOTSTRAP DE BIENESTAR
    // ============================================================
    let isBienestarInitialized = false;
    function initBienestar() {
        // Enforce pantalla completa ocultando banner 'Apuntes Uni', medallas y menú de bienvenida
        const heroBanner = document.getElementById('Inicio') || document.querySelector('.hero-banner');
        const medals = document.getElementById('medals-container');
        const headerMenu = document.getElementById('header-menu');
        if (heroBanner) heroBanner.style.setProperty('display', 'none', 'important');
        if (medals) medals.style.setProperty('display', 'none', 'important');
        if (headerMenu) headerMenu.style.setProperty('display', 'none', 'important');

        if (isBienestarInitialized) return;
        isBienestarInitialized = true;
        setupVenusChat();
        checkDailyRenewal();
        setupEventListeners();
        updateVaultStatusUI();
        renderBehavioralTasks();
        renderJacobsonStepper();
        updateJacobsonUI();
        renderAnchorsGrid();
        console.log('[Bienestar] Módulo clínico inicializado con éxito.');
    }

    // Exponer API global
    window.initBienestar = initBienestar;
    window.__manualInitBienestar = initBienestar;

    // Si ya cargó el DOM o se ejecuta de forma independiente
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (document.getElementById('bienestar-root')) {
                initBienestar();
            }
        });
    } else {
        if (document.getElementById('bienestar-root')) {
            initBienestar();
        }
    }
})();
