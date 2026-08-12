// app.js – lógica de la aplicación MEDICAMENTOS JULIO

// Registro del Service Worker para modo offline
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('ServiceWorker registrado', reg.scope))
      .catch(err => console.error('Error al registrar ServiceWorker', err));
  });
}

// Solicitar permiso de notificaciones al iniciar
if ('Notification' in window) {
  Notification.requestPermission().then(p => {
    console.log('Permiso de notificaciones:', p);
  });
}

// Lista estática de medicamentos (en español)
const medicamentos = [
  {
    nombre: 'Clopidogrel',
    dosis: '1 comprimido en la comida',
    detalle: 'A media comida.',
    frecuenciaMs: 24 * 60 * 60 * 1000 // una vez al día
  },
  {
    nombre: 'Dapagliflozina',
    dosis: '1 comprimido en la comida',
    detalle: 'Con el alimento.',
    frecuenciaMs: 24 * 60 * 60 * 1000
  },
  {
    nombre: 'Atorvastatina',
    dosis: '1 comprimido 80 mg por la noche',
    detalle: '',
    frecuenciaMs: 24 * 60 * 60 * 1000
  },
  {
    nombre: 'Metformina',
    dosis: '1 comprimido cada 12 hrs',
    detalle: 'Al terminar el alimento.',
    frecuenciaMs: 12 * 60 * 60 * 1000
  },
  {
    nombre: 'Omeprazol',
    dosis: '1 comprimido cada 12 hrs',
    detalle: 'Antes del alimento.',
    frecuenciaMs: 12 * 60 * 60 * 1000
  },
  {
    nombre: 'Temisartan',
    dosis: '1 comprimido cada 24 hrs',
    detalle: '',
    frecuenciaMs: 24 * 60 * 60 * 1000
  }
];

// Función para crear la lista en el DOM
function renderMedicamentos() {
  const ul = document.getElementById('med-list');
  ul.innerHTML = '';
  medicamentos.forEach(med => {
    const li = document.createElement('li');
    const id = `med-${med.nombre.replace(/\s+/g, '-').toLowerCase()}`;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = id;
    // cargar estado desde localStorage
    const stored = localStorage.getItem(id);
    checkbox.checked = stored === 'true';
    checkbox.addEventListener('change', () => {
      localStorage.setItem(id, checkbox.checked);
    });
    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = `${med.nombre}: ${med.dosis}` + (med.detalle ? ` (${med.detalle})` : '');
    li.appendChild(checkbox);
    li.appendChild(label);
    ul.appendChild(li);
  });
}

// Programar notificaciones periódicas para cada medicamento
function scheduleMedicationNotifications() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  medicamentos.forEach(med => {
    // Usamos setInterval para simular recordatorios cada frecuencia
    setInterval(() => {
      new Notification('Recordatorio de medicamento', {
        body: `${med.nombre}: ${med.dosis}`,
        icon: 'icons/icon-192.png'
      });
    }, med.frecuenciaMs);
  });
}

// Recordatorios de ejercicio y "om"
function setupExerciseButtons() {
  const ejercicioBtn = document.getElementById('ejercicio-btn');
  const omBtn = document.getElementById('om-btn');

  ejercicioBtn.addEventListener('click', () => {
    if (Notification.permission === 'granted') {
      new Notification('Ejercicio', { body: '¡Es hora de hacer ejercicio de cuerpo!', icon: 'icons/icon-192.png' });
    } else {
      alert('¡Hora de hacer ejercicio de cuerpo!');
    }
  });

  omBtn.addEventListener('click', () => {
    if (Notification.permission === 'granted') {
      new Notification('Meditación "om"', { body: 'Dedica unos minutos a tu práctica de "om".', icon: 'icons/icon-192.png' });
    } else {
      alert('Dedica unos minutos a tu práctica de "om".');
    }
  });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  renderMedicamentos();
  scheduleMedicationNotifications();
  setupExerciseButtons();
});
