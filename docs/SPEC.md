# SDD — Especificación: fix-cicd-packages-css

## 1. Resumen Ejecutivo

**Cambio**: Sincronización de package-lock.json con package.json para CI/CD
**Problema**: CI/CD falla porque sqlite3@5.1.7 falta en el lock file
**Solución**: Regenerar package-lock.json incluyendo todas las dependencias del proyecto
**Impacto**: Corregir los jobs lint-basic y backend-check que actualmente fallan

---

## 2. Análisis del Problema

### 2.1 Estado Actual del Proyecto

| Archivo | Contenido |
|---------|-----------|
| package.json | dependencies: sqlite3@^5.1.7 presente |
| package-lock.json | NO tiene sqlite3 en packages raiz |
| node_modules | sqlite3@5.1.7 instalado (funciona localmente) |

### 2.2 Diagnóstico del Fallo

- **Build**: Pasa correctamente
- **lint-basic**: Falla (backend-check necesita sqlite3)
- **backend-check**: Falla (sqlite3@5.1.7 no está en lock file)

Ellock file está desincronizado con package.json. La instalación local funciona porque npm instala dependencias implícitamente, pero CI/CD usa el lock file para reproducir el ambiente.

---

## 3. Requisitos Técnicos

### 3.1 Regeneración de package-lock.json

**Objetivo**: Generar un lock file completo que incluya todas las dependencias.

**Pasos Required**:

1. **Verificar estado actual**: Confirmar que sqlite3 falta en el lock file
2. **Eliminar lock file corrupto**: Borrar backend/package-lock.json
3. **Regenerar desde cero**: Ejecutar npm install en el directorio backend
4. **Verificar resultado**: Confirmar que sqlite3@5.1.7 aparece en el nuevo lock file
5. **Confirmar versiones lockeadas**: Todas las dependencies deben tener versión exacta

**Commandos a ejecutar**:

```bash
cd backend
del package-lock.json
npm install
```

### 3.2 Dependencias que Deben Estar en el Lock File

| Paquete | Versión Esperada | Notas |
|---------|-----------------|-------|
| sqlite3 | 5.1.7 | CRÍTICO - actualmente faltante |
| bcryptjs | ^3.0.3 | Debajo de ^ se lockea a versión exacta |
| cors | ^2.8.5 | Dependencia normal |
| dotenv | ^16.4.7 | Dependencia normal |
| express | ^5.2.1 | Dependencia normal |
| express-validator | ^7.3.1 | Dependencia normal |
| jsonwebtoken | ^9.0.2 | Dependencia normal |
| multer | ^2.0.2 | Dependencia normal |
| sql.js | ^1.14.1 | Dependencia normal |

Todas las dependencias transitive también deben estar lockeadas con sus versiones exactas.

---

## 4. Procedimiento de Verificación de CI/CD

### 4.1 Verificación Local (Pre-CI)

Antes de hacer commit, verificar que todo funciona localmente:

1. **Instalar dependencias limpias**:
   ```bash
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Verificar sqlite3 instalado**:
   ```bash
   npm list sqlite3
   ```

3. **Ejecutar lint-local**:
   ```bash
   npm run lint-local
   ```

4. **Probar backend-check**:
   ```bash
   node check_db_internal.js
   ```

### 4.2 Verificación en GitHub Actions

El workflow `.github/workflows/ci.yml` ejecuta:

| Job | Descripción | Esperado |
|-----|------------|----------|
| build | Instalar y build | ✅ PASS |
| lint-basic | ESLint en backend | ✅ PASS |
| backend-check | Verificar sqlite3 en lock | ✅ PASS |

---

## 5. Criterios de Aceptación

### 5.1 Criterios de Éxito

| # | Criterio | Método de Verificación |
|---|----------|----------------------|
| 1 | sqlite3@5.1.7 está en package-lock.json | Grep en lock file |
| 2 | npm install funciona sin errores | Ejecución limpia |
| 3 | lint-basic pasa en CI | GitHub Actions |
| 4 | backend-check pasa en CI | GitHub Actions |
| 5 | Todas las dependencias lockeadas | Revisión del lock file |

### 5.2 Criterios de Fracaso

| # | Condición | Resultado |
|---|-----------|----------|
| 1 | sqlite3 NO está en lock file | FALLO |
| 2 | npm install falla | FALLO |
| 3 | CI/CD lint-basic falla | FALLO |
| 4 | CI/CD backend-check falla | FALLO |

---

## 6. Plan de Ejecución

### Phase 1: Diagnóstico (ya completado)

- [x] Identificar que sqlite3 falta en lock file
- [x] Confirmar que build pasa pero checks fallan

### Phase 2: Corrección

- [ ] Eliminar package-lock.json existente
- [ ] Ejecutar npm install para regenerar
- [ ] Verificar que sqlite3 aparece en el nuevo lock file
- [ ] Hacer commit con los cambios

### Phase 3: Verificación

- [ ] Ejecutar verificación local
- [ ] Hacer push y esperar CI/CD
- [ ] Confirmar que todos los jobs pasan

---

## 7. Notas Adicionales

### 7.1 Por Qué Ocurrió Este Problema

Es probable que el lock file original se generara antes de agregar sqlite3 como dependencia, o que se copiara un lock file de otro proyecto sin actualizar.

### 7.2 Cómo Prevenir Este Problema en el Futuro

1. Siempre regenerar lock file al agregar nuevas dependencias: `npm install`
2. Verificar que el lock file se actualice en el mismo commit
3. Incluir el lock file en los commits (no ignore)

---

## 8. Historial de Versiones

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 19/04/2026 | Versión inicial |

---

*Especificación creada el 19/04/2026 para el cambio fix-cicd-packages-css*