# Informe UI/UX - Práctica Final NomadNest

## 1. Evidencia IA (Fase 1)
**Prompt utilizado:**
> "Actúa como experto en UI/UX. Genera una paleta de colores para una web de 'Glamping' y trabajo remoto llamada NomadNest. El estilo debe ser 'Naturaleza Tech'. Dame también 2 tipografías de Google Fonts que combinen bien."

**Respuesta de la IA (Resumen):**
La IA sugirió una paleta basada en verdes profundos y tonos madera para evocar naturaleza, con un gris oscuro azulado para el toque "Tech".
- **Primary**: Verde Bosque (`#255D4A`)
- **Secondary**: Naranja Madera (`#E08E43`)
- **Accent**: Gris Tech (`#1F2933`)
- **Fonts**: 'Sora' (Headings) y 'Nunito' (Cuerpo).

## 2. Guía de Estilos (Fase 2)

### Paleta de Colores
- `Hex #255D4A` (Verde Principal) - Usado en títulos, navbar y elementos de marca.
- `Hex #E08E43` (Naranja Secundario) - Usado en botones (CTA) y hovers para llamar la atención.
- `Hex #E8F5E9` (Fondo) - Un verde muy pálido para suavizar la lectura en lugar de blanco puro.

### Tipografía
- **Títulos**: `Sora` (Sans-serif, moderna, geométrica).
- **Cuerpo**: `Nunito` (Sans-serif, redondeada, amable).

### Componentes UI
- **Botones**: Bordes redondeados (50px), sombra suave, efecto "lift" (subir) al hacer hover.
- **Tarjetas**: Fondo blanco, esquinas redondeadas (20px), sombra difusa que aumenta al pasar el ratón.

## 3. Verificación del Prototipo (Fase 3)
El diseño implementado cumple con la estructura requerida:
- [x] **Header**: Logotipo, Navegación y Selector de Idioma.
- [x] **Hero Section**: Imagen de fondo inmersiva, Título grande y CTA claro.
- [x] **Servicios (Productos)**: Grid responsive de tarjetas de alojamiento.
- [x] **Formulario**: Sección de administración funcional y estilizada.
- [x] **Footer**: Enlaces a redes sociales con iconos FontAwesome.

## 4. Reflexión (Fase 4)
Aunque la IA proporcionó una base sólida para los colores y la tipografía, tomé varias decisiones de diseño manuales para mejorar la usabilidad:

1.  **Ajuste de Contrastes**: La IA sugirió un gris muy claro para el texto que no cumplía con los estándares AAA de accesibilidad, así que lo oscurecí manualmente a `#555` y `#1F2933`.
2.  **Espaciado (Whitespace)**: Aumenté el `padding` de las secciones a `5rem` (la IA sugería 2rem) para dar un aspecto más "premium" y aireado, típico de las web de viajes de lujo.
3.  **Micro-interacciones**: Añadí transiciones CSS (`transition: all 0.3s`) a todos los elementos interactivos. La IA dio el código estático, pero la sensación de "suavidad" es un aporte personal para mejorar la experiencia de usuario (UX).

En conclusión, la IA actuó como un "Consultor Creativo" inicial, pero la implementación técnica y el pulido final requirieron criterio humano para cumplir con los estándares W3C y las heurísticas de usabilidad.
