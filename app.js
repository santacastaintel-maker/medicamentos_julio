// app.js - MEDICAMENTOS JULIO

// Registrar Service Worker para PWA / Modo Offline
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('ServiceWorker registrado:', reg.scope))
      .catch(err => console.error('Error al registrar ServiceWorker:', err));
  });
}

// Lista de Medicamentos de Julio con información completa
const MEDICAMENTOS = [
  {
    id: 'clopidogrel',
    nombre: 'Clopidogrel',
    dosis: '1 comprimido en la comida',
    detalle: 'A media comida.',
    horario: 'comida',
    etiqueta: 'En la comida'
  },
  {
    id: 'dapagliflozina',
    nombre: 'Dapagliflozina',
    dosis: '1 comprimido en la comida',
    detalle: 'Con el alimento.',
    horario: 'comida',
    etiqueta: 'Con alimento'
  },
  {
    id: 'atorvastatina',
    nombre: 'Atorvastatina 80 mg',
    dosis: '1 comprimido por la noche',
    detalle: 'Tomar por la noche.',
    horario: 'noche',
    etiqueta: 'Por la noche'
  },
  {
    id: 'metformina',
    nombre: 'Metformina',
    dosis: '1 comprimido cada 12 hrs',
    detalle: 'Al terminar el alimento.',
    horario: '12h',
    etiqueta: 'Cada 12 hrs'
  },
  {
    id: 'omeprazol',
    nombre: 'Omeprazol',
    dosis: '1 comprimido cada 12 hrs',
    detalle: 'Antes del alimento.',
    horario: '12h',
    etiqueta: 'Cada 12 hrs'
  },
  {
    id: 'temisartan',
    nombre: 'Temisartan',
    dosis: '1 comprimido cada 24 hrs',
    detalle: 'Tomar 1 vez al día.',
    horario: '24h',
    etiqueta: 'Cada 24 hrs'
  }
];

let activeFilter = 'all';
let deferredInstallPrompt = null;
let toastTimeout = null;

// Mostrar notificación flotante (Toast)
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.classList.remove('hidden');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.add('hidden');
  }, 2800);
}

// Inicialización de fecha actual
function updateDateHeader() {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const today = new Date().toLocaleDateString('es-ES', options);
  const formattedDate = today.charAt(0).toUpperCase() + today.slice(1);
  const dateEl = document.getElementById('current-date');
  if (dateEl) dateEl.textContent = formattedDate;
}

// Renderizado de lista de tarjetas
function renderMedicationCards() {
  const container = document.getElementById('medication-cards-container');
  if (!container) return;

  container.innerHTML = '';

  const todayKey = new Date().toISOString().slice(0, 10);
  let completedCount = 0;
  let visibleCardsCount = 0;

  MEDICAMENTOS.forEach(med => {
    const storageKey = `med_${med.id}_${todayKey}`;
    const isChecked = localStorage.getItem(storageKey) === 'true';

    if (isChecked) completedCount++;

    // Filtrar según pestaña activa
    if (activeFilter === 'pending' && isChecked) return;
    if (activeFilter === 'completed' && !isChecked) return;

    visibleCardsCount++;

    const card = document.createElement('div');
    card.className = `med-card ${isChecked ? 'checked' : ''}`;
    card.dataset.id = med.id;

    let badgeClass = 'badge-24h';
    if (med.horario === 'comida') badgeClass = 'badge-comida';
    else if (med.horario === 'noche') badgeClass = 'badge-noche';
    else if (med.horario === '12h') badgeClass = 'badge-12h';

    card.innerHTML = `
      <div class="custom-checkbox">
        <svg viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <div class="med-info">
        <div class="med-header-row">
          <h3 class="med-name">${med.nombre}</h3>
          <span class="badge-tag ${badgeClass}">${med.etiqueta}</span>
        </div>
        <div class="med-dose">💊 ${med.dosis}</div>
        ${med.detalle ? `<div class="med-detail">💡 ${med.detalle}</div>` : ''}
      </div>
    `;

    card.addEventListener('click', () => {
      const nextCheckedState = !isChecked;
      localStorage.setItem(storageKey, nextCheckedState);
      renderMedicationCards();
      if (nextCheckedState) {
        showToast(`✅ ${med.nombre} marcado como tomado`);
      } else {
        showToast(`🔄 ${med.nombre} desmarcado`);
      }
    });

    container.appendChild(card);
  });

  // Si no hay tarjetas en el filtro actual, mostrar estado vacío
  if (visibleCardsCount === 0) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'empty-state';
    if (activeFilter === 'pending') {
      emptyDiv.innerHTML = `<div class="empty-state-icon">🎉</div><p><strong>¡Excelente!</strong> No tienes medicamentos pendientes por tomar hoy.</p>`;
    } else if (activeFilter === 'completed') {
      emptyDiv.innerHTML = `<div class="empty-state-icon">📋</div><p>Aún no has marcado ningún medicamento como tomado hoy.</p>`;
    } else {
      emptyDiv.innerHTML = `<div class="empty-state-icon">💊</div><p>No se encontraron medicamentos.</p>`;
    }
    container.appendChild(emptyDiv);
  }

  updateTabLabels(completedCount, MEDICAMENTOS.length);
  updateProgressBar(completedCount, MEDICAMENTOS.length);
}

// Actualizar etiquetas de pestañas
function updateTabLabels(completed, total) {
  const pendingCount = total - completed;
  const tabPending = document.getElementById('tab-pending');
  const tabCompleted = document.getElementById('tab-completed');
  
  if (tabPending) tabPending.textContent = `Pendientes (${pendingCount})`;
  if (tabCompleted) tabCompleted.textContent = `Completados (${completed})`;
}

// Actualizar barra de progreso
function updateProgressBar(completed, total) {
  const percent = Math.round((completed / total) * 100);
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const progressSubtitle = document.getElementById('progress-subtitle');

  if (progressBar) progressBar.style.width = `${percent}%`;
  if (progressText) progressText.textContent = `${percent}%`;
  if (progressSubtitle) {
    if (completed === total) {
      progressSubtitle.textContent = '🎉 ¡Felicitaciones! Has tomado todos los medicamentos del día.';
    } else {
      progressSubtitle.textContent = `${completed} de ${total} medicamentos tomados hoy`;
    }
  }
}

// Configurar Pestañas de Filtro
function setupTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.dataset.filter;
      renderMedicationCards();
    });
  });
}

// Botón de Reiniciar Día
function setupResetButton() {
  const resetBtn = document.getElementById('reset-day-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const todayKey = new Date().toISOString().slice(0, 10);
      MEDICAMENTOS.forEach(med => {
        localStorage.removeItem(`med_${med.id}_${todayKey}`);
      });
      renderMedicationCards();
      showToast('🔄 Se reinició el registro de hoy');
    });
  }
}

// Captura e interacción de Instalación PWA
function setupInstallPrompt() {
  const installAppBtn = document.getElementById('install-app-btn');
  const installHeaderBtn = document.getElementById('install-header-btn');
  const showHelpBtn = document.getElementById('show-help-btn');
  const modal = document.getElementById('install-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const understandBtn = document.getElementById('understand-btn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
  });

  const openInstall = async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      if (outcome === 'accepted') {
        showToast('🎉 ¡Gracias por instalar Medicamentos Julio!');
      }
      deferredInstallPrompt = null;
    } else {
      if (modal) modal.classList.remove('hidden');
    }
  };

  if (installAppBtn) installAppBtn.addEventListener('click', openInstall);
  if (installHeaderBtn) installHeaderBtn.addEventListener('click', openInstall);

  if (showHelpBtn) {
    showHelpBtn.addEventListener('click', () => {
      if (modal) modal.classList.remove('hidden');
    });
  }

  const closeModal = () => {
    if (modal) modal.classList.add('hidden');
  };

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (understandBtn) understandBtn.addEventListener('click', closeModal);
}

// Configurar Botones de Ejercicio & Om
function setupWellnessSection() {
  const omBtn = document.getElementById('om-action-btn');
  const bodyBtn = document.getElementById('body-action-btn');
  const omStatus = document.getElementById('om-status');
  const bodyStatus = document.getElementById('body-status');

  const omModal = document.getElementById('om-modal');
  const closeOmModal = document.getElementById('close-om-modal');
  const finishOmBtn = document.getElementById('finish-om-btn');

  const todayKey = new Date().toISOString().slice(0, 10);

  if (localStorage.getItem(`om_${todayKey}`) === 'completed') {
    if (omStatus) omStatus.textContent = '✅ Realizado hoy';
  }
  if (localStorage.getItem(`body_${todayKey}`) === 'completed') {
    if (bodyStatus) bodyStatus.textContent = '✅ Realizado hoy';
  }

  // Om Modal
  if (omBtn) {
    omBtn.addEventListener('click', () => {
      if (omModal) omModal.classList.remove('hidden');
    });
  }

  if (closeOmModal) {
    closeOmModal.addEventListener('click', () => {
      if (omModal) omModal.classList.add('hidden');
    });
  }

  if (finishOmBtn) {
    finishOmBtn.addEventListener('click', () => {
      localStorage.setItem(`om_${todayKey}`, 'completed');
      if (omStatus) omStatus.textContent = '✅ Realizado hoy';
      if (omModal) omModal.classList.add('hidden');
      showToast('🧘‍♂️ ¡Excelente práctica de "Om" completada!');
    });
  }

  // Body exercise
  if (bodyBtn) {
    bodyBtn.addEventListener('click', () => {
      localStorage.setItem(`body_${todayKey}`, 'completed');
      if (bodyStatus) bodyStatus.textContent = '✅ Realizado hoy';
      showToast('🏋️‍♂️ ¡Ejercicio de cuerpo registrado hoy!');
    });
  }
}

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
  updateDateHeader();
  renderMedicationCards();
  setupTabs();
  setupResetButton();
  setupInstallPrompt();
  setupWellnessSection();
});
