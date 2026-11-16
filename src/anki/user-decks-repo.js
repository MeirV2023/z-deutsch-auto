// Репозиторий личных курсов игрока (IndexedDB + резервная копия в localStorage)

const IDB_NAME = 'zlingo_user_courses_v1';
const IDB_STORE = 'courses';
const LS_FALLBACK_KEY = 'zlingo_user_courses_backup_v1';


// --- Сохранение и загрузка личных курсов в IndexedDB + localStorage ---
function openCoursesDb() {
  if (!('indexedDB' in window)) return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch (_) {
      resolve(null);
    }
  });
}

export async function loadUserCourses() {
  const db = await openCoursesDb();
  if (db) {
    try {
      const items = await new Promise((resolve) => {
        const tx = db.transaction(IDB_STORE, 'readonly');
        const req = tx.objectStore(IDB_STORE).getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
      if (Array.isArray(items) && items.length > 0) {
        return items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      }
    } catch (_) {}
  }

  try {
    const raw = localStorage.getItem(LS_FALLBACK_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

export async function saveUserCourse(course) {
  const existing = await loadUserCourses();
  const updated = [course, ...existing.filter(c => c.id !== course.id)];

  try {
    localStorage.setItem(LS_FALLBACK_KEY, JSON.stringify(updated.slice(0, 12)));
  } catch (_) {}

  const db = await openCoursesDb();
  if (db) {
    await new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        tx.objectStore(IDB_STORE).put(course);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (_) {
        resolve();
      }
    });
  }
  return course;
}

export async function deleteUserCourse(courseId) {
  const existing = await loadUserCourses();
  const updated = existing.filter(c => c.id !== courseId);
  try {
    localStorage.setItem(LS_FALLBACK_KEY, JSON.stringify(updated));
  } catch (_) {}

  const db = await openCoursesDb();
  if (db) {
    await new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        tx.objectStore(IDB_STORE).delete(courseId);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (_) {
        resolve();
      }
    });
  }
}

